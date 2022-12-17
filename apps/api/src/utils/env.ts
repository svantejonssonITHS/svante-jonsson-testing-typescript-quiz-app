import { config } from 'dotenv';
config();

const AUTH0_DOMAIN: string = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID: string = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET: string = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_USERNAME: string = process.env.AUTH0_USERNAME;
const AUTH0_PASSWORD: string = process.env.AUTH0_PASSWORD;
const QUESTION_COUNT_DEFAULT: number = Number(process.env.QUESTION_COUNT_DEFAULT) || 10;
const QUESTION_TIME_DEFAULT: number = Number(process.env.QUESTION_TIME_DEFAULT) || 30;
const QUESTION_CATEGORY_DEFAULT: string = process.env.QUESTION_CATEGORY_DEFAULT || 'general_knowledge';
const QUESTION_REGION_DEFAULT: string = process.env.QUESTION_REGION_DEFAULT || 'US';
const QUESTION_DIFFICULTY_DEFAULT: string = process.env.QUESTION_DIFFICULTY_DEFAULT || 'medium';
const QUESTION_POINTS_POSSIBLE: number = Number(process.env.QUESTION_POINTS_POSSIBLE) || 1000;

export {
	AUTH0_DOMAIN,
	AUTH0_CLIENT_ID,
	AUTH0_CLIENT_SECRET,
	AUTH0_USERNAME,
	AUTH0_PASSWORD,
	QUESTION_COUNT_DEFAULT,
	QUESTION_TIME_DEFAULT,
	QUESTION_CATEGORY_DEFAULT,
	QUESTION_REGION_DEFAULT,
	QUESTION_DIFFICULTY_DEFAULT,
	QUESTION_POINTS_POSSIBLE
};
