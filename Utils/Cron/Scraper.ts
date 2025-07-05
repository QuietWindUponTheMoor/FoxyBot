import { WildMongo } from "../Mongo";
import { Animals, GetRandomAnimal } from "../../Enums/Animals";

export async function Scraper(mongo: WildMongo) {
    // Select random animal
    let animal = GetRandomAnimal();

    // Run API calls to scraped endpoint
    for (let i = 0; i < 100; i++) {
        try {
            let result = await fetch(`https://some-random-api.com/animal/${animal}`);
        
            // Get data
            let data = await result.json();
            let image = data.image;
            let fact = data.fact;

            // Insert into database
            await mongo.updateOne(`foxybot-${animal}`, { image, fact }, {
                $setOnInsert: {
                    image: image,
                    fact: fact
                }
            });

            // Delay between requests
            let delayTimeInSeconds = 5;
            await new Promise((result) => setTimeout(result, delayTimeInSeconds * 1000));
        } catch (error) {
            console.error("There was an error. Is there an internet connection? Is the endpoint offline?");
            continue;
        }
    }
}