import { WildMongo } from "wildmongowhispers";

import { GetRandomAnimal } from "../../Enums/Animals";
import { AnimalTypes } from "../../Enums/AnimalTypes";

export async function Scraper(mongo: WildMongo) {
    // Select random animal
    let animal = GetRandomAnimal();

    // Run API calls to scraped endpoint
    let numberCallsPerSchedule = 100;
    for (let i = 0; i < numberCallsPerSchedule; i++) {
        try {
            let result = await fetch(`https://some-random-api.com/animal/${animal}`);
        
            // Get data
            let data = await result.json();
            let image = data.image;
            let fact = data.fact;

            // Insert into database
            await mongo.updateOne(`queue`, { image, fact }, {
                $setOnInsert: {
                    type: AnimalTypes.NotFurry,
                    animal: animal,
                    image: image,
                    fact: fact
                }
            });

            // Delay between requests
            let delayTimeInSeconds = 5;
            await new Promise((result) => setTimeout(result, delayTimeInSeconds * 1000));
        } catch (error) {
            console.error("There was an error running scraper function. Is there an internet connection? Is the endpoint offline?", error);
            continue;
        }
    }
}