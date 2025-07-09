import "source-map-support/Register";
import { ButtonInteraction, Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import cron from "node-cron";
import { WildMongo } from "wildmongowhispers";

// Local imports
import { Commands } from "./Discord/Commands/Register";
import { Scraper } from "./Utils/Cron/Scraper";
import { AnimalsOnATimer } from "./Utils/Cron/AnimalsOnATimer";
import { FoxxoOnATimerButtonHandler } from "./Discord/Commands/Interactions/ButtonReplies/FoxxoOnATimerButtonHandler";
import { CreateMongoIndexes } from "./Utils/CreateMongoIndexes";

// Configure dotenv
dotenv.config();

// Configure mongo & redis
let mongo = new WildMongo("FoxyBot", process.env.mongoURI);

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

client.on(Events.ClientReady, async readyClient => {
    // Create mongo indexes (do this first to avoid timing conflicts)
    await CreateMongoIndexes(mongo);

    // Start scraper cron job
    Scraper(mongo); // Do once on startup
    cron.schedule("0 */2 * * *", () => {
        console.log(`[${new Date().toISOString()}] Running image caching job...`);
        Scraper(mongo);
    });

    // Start animals on a timer cron job
    AnimalsOnATimer(client, mongo, cron);

    // Log ready status
    console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on("interactionCreate", async (interaction: ButtonInteraction) => {
    // FoxxoOnATimerButtonHandler
    await FoxxoOnATimerButtonHandler(mongo, interaction);
});

client.on("guildDelete", async guild => {
    console.warn(`[${new Date().toISOString()}] [Guild Removed] ${guild.id} | ${guild.name}`);

    // Delete intervals
    await mongo.database.collection("animal-intervals").deleteMany({ guildID: guild.id });
});

process.on("SIGINT", async () => {
    // Shut down server
    console.warn(`[${new Date().toISOString()}] Shutting down server...`);

    // Close mongo pool connection
    await mongo.ClosePoolConnection();

    // Finally exit
    process.exit(0);
});

client.on("error", error => {
    console.error(`[${new Date().toISOString()}] [Discord Client Error]`, error);
});

(client.ws as any).on("error", error => {
    console.error(`[${new Date().toISOString()}] [Discord Gateway Error]`, error);
});

client.login(process.env.FOXYBOT);