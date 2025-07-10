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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scraper = Scraper;
const Animals_1 = require("../../Enums/Animals");
const AnimalTypes_1 = require("../../Enums/AnimalTypes");
function Scraper(mongo) {
    return __awaiter(this, void 0, void 0, function* () {
        // Select random animal
        let animal = (0, Animals_1.GetRandomAnimal)();
        // Run API calls to scraped endpoint
        let numberCallsPerSchedule = 100;
        for (let i = 0; i < numberCallsPerSchedule; i++) {
            try {
                let result = yield fetch(`https://some-random-api.com/animal/${animal}`);
                // Get data
                let data = yield result.json();
                let image = data.image;
                let fact = data.fact;
                // Insert into database
                yield mongo.updateOne(`queue`, { image, fact }, {
                    $setOnInsert: {
                        type: AnimalTypes_1.AnimalTypes.NotFurry,
                        animal: animal,
                        image: image,
                        fact: fact
                    }
                });
                // Delay between requests
                let delayTimeInSeconds = 5;
                yield new Promise((result) => setTimeout(result, delayTimeInSeconds * 1000));
            }
            catch (error) {
                console.error("There was an error running scraper function. Is there an internet connection? Is the endpoint offline?", error);
                continue;
            }
        }
    });
}
//# sourceMappingURL=Scraper.js.map