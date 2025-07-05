import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { WildMongo } from "./Utils/Mongo";
import cron from "node-cron";

// Local imports
import { Commands } from "./Utils/Commands/Register";
import { Scraper } from "./Utils/Cron/Scraper";

// Configure dotenv
dotenv.config();

// Configure mongo
let mongo = new WildMongo("FoxyBot");

// Create client
let client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});

// Register commands
let commands = new Commands(client, mongo);
commands.Register();
commands.InteractionsHandler();

client.on(Events.ClientReady, readyClient => {
    // Start scraper cron job
    Scraper(mongo); // Do once on startup
    cron.schedule("0 */2 * * *", () => {
        console.log(`[${new Date().toISOString()}] Running image caching job...`);
        Scraper(mongo);
    });

    // Log ready status
    console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on("error", error => {
    console.error(`[${new Date().toISOString()}] [Discord Client Error]`, error);
});

(client.ws as any).on("error", error => {
    console.error(`[${new Date().toISOString()}] [Discord Gateway Error]`, error);
});



client.login(process.env.FOXYBOT);