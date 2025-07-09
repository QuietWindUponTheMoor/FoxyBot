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
exports.AnimalFetchRandom = AnimalFetchRandom;
/**
 * Fetches a random record that matches the specific animal (fox, bird, etc) and type of animal (furry or notfurry)
 * @param mongo WildMongo instance
 * @param foxxoOrNotFoxxo "foxxo" or "notfoxxo"
 * @param type AnimalTypes.Furry | AnimalTypes.NotFurry
 */
function AnimalFetchRandom(mongo, foxxoOrNotFoxxo, type) {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        if (foxxoOrNotFoxxo === "foxxo") {
            result = (yield mongo.database.collection("animals").aggregate([
                { $match: { animal: "foxxo", type: type } },
                { $sample: { size: 1 } }
            ]).toArray());
        }
        else {
            result = (yield mongo.database.collection("animals").aggregate([
                { $match: { type: type } },
                { $sample: { size: 1 } }
            ]).toArray());
        }
        if (result.length === 0) {
            return {
                message: `# There are no available '${foxxoOrNotFoxxo}' records. \n### More content moderation needed! \nIf this was a scheduled \`/foxxo\` or \`/notfoxxo\` command, please bug the Foxy™ developers and content moderators to approve more content :)`,
                result: null
            };
        }
        return {
            message: `Here is a '${foxxoOrNotFoxxo}' record!`,
            result: result[0]
        };
    });
}
//# sourceMappingURL=AnimalFetchRandom.js.map