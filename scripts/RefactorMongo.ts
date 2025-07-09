import dotenv from "dotenv";
import { WildMongo } from "wildmongowhispers";

// Configure dotenv
dotenv.config();

// Configure mongo & redis
let mongo = new WildMongo("FoxyBot", process.env.mongoURI as string);

let version = process.argv[2];
switch (version) {
    case "for-1.1.0":
        For1_1_0();
        break;
    default:
        console.error("Please specify a valid refactor version: 'for-1.1.0', N/A, etc.");
        process.exit(1);
}

async function For1_1_0() {
    await mongo.database.createCollection("queue");
    await mongo.database.createCollection("queue-nsfw");
    await mongo.database.createCollection("queue-rejected");
    await mongo.database.createCollection("queue-nsfw-rejected");
    await mongo.database.createCollection("animals");
    await mongo.database.createCollection("factcounter");
    await mongo.database.createCollection("animal-intervals");

    await mongo.database.collection("foxybot-fox").drop()

    await mongo.database.collection("foxybot-factcounter").rename("factcounter");
    await mongo.database.collection("factcounter").deleteMany({});

    await mongo.database.collection("foxybot-foxxo-intervals").rename("foxxo-intervals")
    await mongo.database.collection("foxxo-intervals").deleteMany({});

    await mongo.database.collection("foxybot-notfoxxo-intervals").rename("notfoxxo-intervals")
    await mongo.database.collection("notfoxxo-intervals").deleteMany({});

    await mongo.database.collection("foxybot-queue-red_panda").drop();
    await mongo.database.collection("foxybot-birb").drop();
    await mongo.database.collection("foxybot-bird").drop();
    await mongo.database.collection("foxybot-cat").drop();
    await mongo.database.collection("foxybot-dog").drop();
    await mongo.database.collection("foxybot-kangaroo").drop();
    await mongo.database.collection("foxybot-koala").drop();
    await mongo.database.collection("foxybot-panda").drop();
    await mongo.database.collection("foxybot-racoon").drop();
    await mongo.database.collection("foxybot-red_panda").drop();
    await mongo.database.collection("foxybot-whale").drop();

    console.log("Database successfully wiped and refactored!");
    process.exit(0);
}