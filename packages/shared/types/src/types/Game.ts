import { GameStage } from '../../../enums/src';

type Game = {
	id: string;
	stage: GameStage;
	options: GameOptions;
	numberOfQuestions: number;
	questions: Question[];
	activeQuestion?: Question;
	previousQuestions: Question[];
	players: Player[];
	host: Player;
	questionTimeout?: NodeJS.Timeout;
};

type GameOptions = {
	isPrivate: boolean;
	category: string;
	tag: string;
	region: string;
	difficulty: string;
	questionCount: number;
	questionTime: number;
};

type Question = {
	id: string;
	question: string;
	correctAnswer?: string;
	answers: string[];
	playerAnswers: PlayerAnswer[];
	sentAt?: number;
};

type Player = {
	id: string;
	name: string;
	email: string;
	profilePicture: string;
	score?: number;
	streak?: number;
	isReady?: boolean;
};

type PlayerAnswer = {
	playerId: string;
	answer: string;
	isCorrect: boolean;
	sentAt: number;
};

export type { Game, GameOptions, Question, Player, PlayerAnswer };
