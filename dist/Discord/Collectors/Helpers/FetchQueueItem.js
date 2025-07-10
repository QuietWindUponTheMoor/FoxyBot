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
exports.FetchQueueItem = FetchQueueItem;
/**
 *
 * @param mongo WildMongo instance
 * @param queue Specifies which queue collection type to use, 'queue' or 'queue-nsfw'
 * @returns Mongo find result
 */
function FetchQueueItem(mongo, queue) {
    return __awaiter(this, void 0, void 0, function* () {
        let [result] = yield mongo.database.collection(queue)
            .find({})
            .sort({ _id: 1 })
            .limit(1)
            .toArray();
        return result;
    });
}
//# sourceMappingURL=FetchQueueItem.js.map