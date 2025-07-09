import { WildMongo } from "wildmongowhispers";
import { AnimalTypes } from "../../../Enums/AnimalTypes";

export interface AnimalFetchRandomResult {
    _id: any,
    type: AnimalTypes,
    animal: string,
    image: string,
    fact: string
}

export interface AnimalFetchRandomReturn {
    message: string,
    result: AnimalFetchRandomResult | null
}

/**
 * Fetches a random record that matches the specific animal (fox, bird, etc) and type of animal (furry or notfurry)
 * @param mongo WildMongo instance
 * @param foxxoOrNotFoxxo "foxxo" or "notfoxxo"
 * @param type AnimalTypes.Furry | AnimalTypes.NotFurry
 */
export async function AnimalFetchRandom(mongo: WildMongo, foxxoOrNotFoxxo: string, type: AnimalTypes) {
    let result: Array<AnimalFetchRandomResult>;

    if (foxxoOrNotFoxxo === "foxxo") {
        result = await mongo.database.collection<AnimalFetchRandomResult>("animals").aggregate([
            { $match: { animal: "foxxo", type: type } },
            { $sample: { size: 1 } }
        ]).toArray() as Array<AnimalFetchRandomResult>;
    } else {
        result = await mongo.database.collection<AnimalFetchRandomResult>("animals").aggregate([
            { $match: { type: type } },
            { $sample: { size: 1 } }
        ]).toArray() as Array<AnimalFetchRandomResult>;
    }

    if (result.length === 0) {
        return {
            message: `# There are no available '${foxxoOrNotFoxxo}' records. \n### More content moderation needed! \nIf this was a scheduled \`/foxxo\` or \`/notfoxxo\` command, please bug the Foxy™ developers and content moderators to approve more content :)`,
            result: null
        } as AnimalFetchRandomReturn;
    }
    
    return {
        message: `Here is a '${foxxoOrNotFoxxo}' record!`,
        result: result[0]
    } as AnimalFetchRandomReturn;
}