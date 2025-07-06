import { ChatInputCommandInteraction, Client, Events, REST, Routes} from "discord.js";
import { pathToFileURL } from "url";
import fs from "fs";
import path from "path";
import { WildMongo } from "wildmongowhispers";

export class Commands {
    client: Client;
    mongo: WildMongo;
    rest: REST;
    commands: Array<JSON>;

    constructor(client: Client, mongo: WildMongo) {
        this.client = client;
        this.mongo = mongo;

        // Configure REST
        this.rest = new REST({ version: "10"}).setToken(process.env.FOXYBOT);

        // Get commands registry file
        let commandsFile = path.join(process.cwd(), "commands.json");

        // Get commands
        let rawData = fs.readFileSync(commandsFile, "utf8");
        let commandsJSON = JSON.parse(rawData);
        this.commands = [...commandsJSON.commands];
    }

    async Register(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("Refreshing FoxyBoy commands.");

                let result = await this.rest.put(Routes.applicationCommands(process.env.FOXYCLIENT), { body: this.commands });

                console.log("Successfully refreshed commands.");

                resolve(result);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        });
    }

    async InteractionsHandler(): Promise<void> {
        // Get the individual commands files
        let interactionsDir = path.join(__dirname, "Interactions/");
        let files = fs.readdirSync(interactionsDir).filter(file => file.endsWith(".js"));

        let handlers = [];

        for (let file of files) {
            let filePath = path.join(interactionsDir, file);
            let module = await import(pathToFileURL(filePath).href);
            let handler = module?.default?.default ?? module?.default;

            if (typeof handler === "function") {
                handlers.push(handler);
            }
        }

        this.client.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;

            for (let handler of handlers) {
                await handler(interaction as ChatInputCommandInteraction, this.mongo as WildMongo);
            }
        });
    }
}