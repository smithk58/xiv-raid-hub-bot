import * as dotenv from 'dotenv';
import { Bot } from '../bot';
import app from './app';
dotenv.config();
// Init the webserer
const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT);
// Init the discord bot
const bot = new Bot();
try {
    void bot.init();
} catch (e) {
    console.error(e);
    process.exit(0);
}
