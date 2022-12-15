// External dependencies
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AxiosResponse } from 'axios';

// Internal dependencies
import { Game, GameOptions, Player, Event, Question } from '_packages/shared/types/src';
import getAuth0User from '$src/utils/getAuth0User';
import createGameId from '$src/utils/createGameId';
import {
	QUESTION_CATEGORY_DEFAULT,
	QUESTION_COUNT_DEFAULT,
	QUESTION_DIFFICULTY_DEFAULT,
	QUESTION_REGION_DEFAULT,
	QUESTION_TIME_DEFAULT
} from '$src/utils/env';
import axios from '$src/utils/axios';
import { TRIVIA_API_URL } from '$src/utils/constants';
import getTriviaQuestions from '$src/utils/getTriviaQuestions';

const _games: Game[] = [];

@Injectable()
export class GameService {
	async createGame(authorization: string): Promise<Game> {
		const host: Player = await getAuth0User(authorization);

		const id: string = createGameId(_games.map((game: Game) => game.id));

		const options: GameOptions = {
			questionCount: QUESTION_COUNT_DEFAULT,
			questionTime: QUESTION_TIME_DEFAULT,
			category: QUESTION_CATEGORY_DEFAULT,
			tag: undefined,
			region: QUESTION_REGION_DEFAULT,
			difficulty: QUESTION_DIFFICULTY_DEFAULT,
			isPrivate: true
		};

		const questions: Question[] = await getTriviaQuestions(options);

		const game: Game = {
			id,
			options,
			questions: questions.map((question: Question) => ({ ...question, correctAnswer: undefined })),
			host,
			players: []
		};

		_games.push(game);

		return game;
	}

	async handleJoin(client: Socket, payload: Event): Promise<void> {
		try {
			const player: Player = await getAuth0User(client.handshake.headers.authorization);

			const game: Game = _games.find((game: Game) => game.id === payload.gameId);

			if (!game) throw new Error('Game not found');

			const playerExists: boolean = game.players.some((player: Player) => player.id === player.id);

			if (game.options.isPrivate && player.id !== game.host.id) throw new Error('Game is private');

			if (playerExists) throw new Error('Player is already in game');

			if (game.players.length >= 10) throw new Error('Game is full');

			const isHost: boolean = player.id === game.host.id;

			if (isHost) player.isReady = true;

			game.players.push(player);

			client.emit(game.id, game);
		} catch (error) {
			console.log(error);
		}
	}

	async handleChangePlayerStatus(client: Socket, payload: Event): Promise<void> {
		try {
			const player: Player = await getAuth0User(client.handshake.headers.authorization);

			const game: Game = _games.find((game: Game) => game.id === payload.gameId);

			if (!game) throw new Error('Game not found');

			const playerExists: boolean = game.players.some((gamePlayer: Player) => gamePlayer.id === player.id);

			if (!playerExists) throw new Error('Player is not in game');

			const isHost: boolean = player.id === game.host.id;

			if (isHost) throw new Error('Host cannot change status');

			game.players = game.players.map((gamePlayer: Player) => {
				if (gamePlayer.id === player.id) {
					gamePlayer.isReady = payload.data.isReady;
				}

				return gamePlayer;
			});

			client.emit(game.id, game);
		} catch (error) {
			console.log(error);
		}
	}

	async handleLeave(client: Socket, payload: Event): Promise<void> {
		try {
			const player: Player = await getAuth0User(client.handshake.headers.authorization);

			const game: Game = _games.find((game: Game) => game.id === payload.gameId);

			if (!game) throw new Error('Game not found');

			const playerExists: boolean = game.players.some((gamePlayer: Player) => gamePlayer.id === player.id);

			if (!playerExists) throw new Error('Player is not in game');

			game.players = game.players.filter((gamePlayer: Player) => gamePlayer.id !== player.id);

			// Delete game if no players are left
			// Since the game is private as default, this will only happen if at least the host has joined previously
			if (game.players.length === 0) {
				_games.splice(_games.indexOf(game), 1);
			}

			client.emit(game.id, game);
		} catch (error) {
			console.log(error);
		}
	}

	async handleChangeOptions(client: Socket, payload: Event): Promise<void> {
		try {
			const player: Player = await getAuth0User(client.handshake.headers.authorization);

			const game: Game = _games.find((game: Game) => game.id === payload.gameId);

			if (!game) {
				throw new Error('Game not found');
			}

			if (!game.players.some((gamePlayer: Player) => gamePlayer.id === player.id)) {
				throw new Error('Player is not in game');
			}

			if (player.id !== game.host.id) {
				throw new Error('Player is not host');
			}

			for (const key in payload.data.options) {
				if (payload.data.options[key] !== undefined) {
					game.options[key] = payload.data.options[key];
				}
			}

			if (Object.keys(payload.data.options).length === 0) throw new Error('No options changed');

			game.questions = await getTriviaQuestions(game.options);

			client.emit(game.id, {
				...game,
				// Remove the correct answer from each Question object
				// We do not want to send the correct answer to the client
				questions: game.questions.map((question: Question) => ({ ...question, correctAnswer: undefined }))
			});
		} catch (error) {
			console.log(error);
		}
	}
}
