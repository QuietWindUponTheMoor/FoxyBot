"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const Mongo_1 = require("./Utils/Mongo");
const node_cron_1 = __importDefault(require("node-cron"));
// Local imports
const Register_1 = require("./Utils/Commands/Register");
const Scraper_1 = require("./Utils/Cron/Scraper");
// Configure dotenv
dotenv_1.default.config();
// Configure mongo
let mongo = new Mongo_1.WildMongo("FoxyBot");
// Create client
let client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
    ],
});
// Register commands
let commands = new Register_1.Commands(client, mongo);
commands.Register();
commands.InteractionsHandler();
client.on(discord_js_1.Events.ClientReady, readyClient => {
    // Start scraper cron job
    (0, Scraper_1.Scraper)(mongo); // Do once on startup
    node_cron_1.default.schedule("0 */2 * * *", () => {
        console.log(`[${new Date().toISOString()}] Running image caching job...`);
        (0, Scraper_1.Scraper)(mongo);
    });
    // Log ready status
    console.log(`Logged in as ${readyClient.user.tag}!`);
});
client.on("error", error => {
    console.error(`[${new Date().toISOString()}] [Discord Client Error]`, error);
});
client.ws.on("error", error => {
    console.error(`[${new Date().toISOString()}] [Discord Gateway Error]`, error);
});
client.login(process.env.FOXYBOT);
