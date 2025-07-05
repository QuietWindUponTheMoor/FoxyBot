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
exports.Commands = void 0;
const discord_js_1 = require("discord.js");
const url_1 = require("url");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Commands {
    constructor(client, mongo) {
        this.client = client;
        this.mongo = mongo;
        // Configure REST
        this.rest = new discord_js_1.REST({ version: "10" }).setToken(process.env.FOXYBOT);
        // Get commands registry file
        let commandsFile = path_1.default.join(process.cwd(), "commands.json");
        // Get commands
        let rawData = fs_1.default.readFileSync(commandsFile, "utf8");
        let commandsJSON = JSON.parse(rawData);
        this.commands = [...commandsJSON.commands];
    }
    Register() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log("Refreshing FoxyBoy commands.");
                    let result = yield this.rest.put(discord_js_1.Routes.applicationCommands(process.env.FOXYCLIENT), { body: this.commands });
                    console.log("Successfully refreshed commands.");
                    resolve(result);
                }
                catch (error) {
                    console.error(error);
                    reject(error);
                }
            }));
        });
    }
    InteractionsHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // Get the individual commands files
            let interactionsDir = path_1.default.join(__dirname, "Interactions/");
            let files = fs_1.default.readdirSync(interactionsDir).filter(file => file.endsWith(".js"));
            let handlers = [];
            for (let file of files) {
                let filePath = path_1.default.join(interactionsDir, file);
                let module = yield import((0, url_1.pathToFileURL)(filePath).href);
                let handler = (_b = (_a = module === null || module === void 0 ? void 0 : module.default) === null || _a === void 0 ? void 0 : _a.default) !== null && _b !== void 0 ? _b : module === null || module === void 0 ? void 0 : module.default;
                if (typeof handler === "function") {
                    handlers.push(handler);
                }
            }
            this.client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(this, void 0, void 0, function* () {
                if (!interaction.isChatInputCommand())
                    return;
                for (let handler of handlers) {
                    yield handler(interaction, this.mongo);
                }
            }));
        });
    }
}
exports.Commands = Commands;
