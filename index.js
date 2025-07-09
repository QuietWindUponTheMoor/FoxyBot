"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const node_cron_1 = __importDefault(require("node-cron"));
const wildmongowhispers_1 = require("wildmongowhispers");
// Local imports
const Register_1 = require("./Discord/Commands/Register");
const Scraper_1 = require("./Utils/Cron/Scraper");
const AnimalsOnATimer_1 = require("./Utils/Cron/AnimalsOnATimer");
const FoxxoOnATimerButtonHandler_1 = require("./Discord/Commands/Interactions/ButtonReplies/FoxxoOnATimerButtonHandler");
const CreateMongoIndexes_1 = require("./Utils/CreateMongoIndexes");
// Configure dotenv
dotenv_1.default.config();
// Configure mongo & redis
let mongo = new wildmongowhispers_1.WildMongo("FoxyBot", process.env.mongoURI);
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
client.on(discord_js_1.Events.ClientReady, (readyClient) => __awaiter(void 0, void 0, void 0, function* () {
    // Create mongo indexes (do this first to avoid timing conflicts)
    yield (0, CreateMongoIndexes_1.CreateMongoIndexes)(mongo);
    // Start scraper cron job
    (0, Scraper_1.Scraper)(mongo); // Do once on startup
    node_cron_1.default.schedule("0 */2 * * *", () => {
        console.log(`[${new Date().toISOString()}] Running image caching job...`);
        (0, Scraper_1.Scraper)(mongo);
    });
    // Start animals on a timer cron job
    (0, AnimalsOnATimer_1.AnimalsOnATimer)(client, mongo, node_cron_1.default);
    // Log ready status
    console.log(`Logged in as ${readyClient.user.tag}!`);
}));
client.on("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    // FoxxoOnATimerButtonHandler
    yield (0, FoxxoOnATimerButtonHandler_1.FoxxoOnATimerButtonHandler)(mongo, interaction);
}));
client.on("guildDelete", (guild) => __awaiter(void 0, void 0, void 0, function* () {
    console.warn(`[${new Date().toISOString()}] [Guild Removed] ${guild.id} | ${guild.name}`);
    // Delete intervals
    yield mongo.database.collection("animal-intervals").deleteMany({ guildID: guild.id });
}));
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    // Shut down server
    console.warn(`[${new Date().toISOString()}] Shutting down server...`);
    // Close mongo pool connection
    yield mongo.ClosePoolConnection();
    // Finally exit
    process.exit(0);
}));
client.on("error", error => {
    console.error(`[${new Date().toISOString()}] [Discord Client Error]`, error);
});
client.ws.on("error", error => {
    console.error(`[${new Date().toISOString()}] [Discord Gateway Error]`, error);
});
client.login(process.env.FOXYBOT);
//# sourceMappingURL=index.js.map