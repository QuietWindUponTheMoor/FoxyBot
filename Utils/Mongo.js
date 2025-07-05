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
exports.WildMongo = void 0;
const mongodb_1 = require("mongodb");
class WildMongo {
    constructor(database = "wildwhispers") {
        let uri = process.env.mongoURI;
        this.client = new mongodb_1.MongoClient(uri);
        this.database = this.client.db(database);
    }
    get() {
        if (this.client !== null &&
            this.database !== null) {
            return this.database;
        }
        else {
            throw new Error("Cannot get Mongo client. Specified client or database was null.");
        }
    }
    setDatabase(database) {
        this.database = this.client.db(database);
    }
    insertOne(collection_1, dataObj_1) {
        return __awaiter(this, arguments, void 0, function* (collection, dataObj, openConnection = true, closeConnection = true) {
            if (openConnection) {
                yield this.client.connect();
            }
            let result = yield this.database.collection(collection).insertOne(dataObj);
            if (closeConnection) {
                yield this.client.close();
            }
            return result;
        });
    }
    /**
     *
     * @param collection The collection to update
     * @param filter Specifies which record to update
     * @param dataObj The data to update or insert
     * @param upsert Whether or not to only update, or insert if a record doesn't already exist with that filter
     * @param openConnection Whether to open a new connection or use an existing one
     * @param closeConnection Whether to close the connection when done with the query
     * @returns Promise<UpdateResult<Any>>
     */
    updateOne(collection_1, filter_1, dataObj_1) {
        return __awaiter(this, arguments, void 0, function* (collection, filter, dataObj, upsert = true, openConnection = true, closeConnection = true) {
            if (openConnection) {
                yield this.client.connect();
            }
            let result = yield this.database.collection(collection).updateOne(filter, dataObj, { upsert: upsert });
            if (closeConnection) {
                yield this.client.close();
            }
            return result;
        });
    }
    /**
     *
     * @param collection The collection to update
     * @param filter Specifies which record to update
     * @param dataObj The data to update or insert
     * @param upsert Whether or not to only update, or insert if a record doesn't already exist with that filter
     * @param openConnection Whether to open a new connection or use an existing one
     * @param closeConnection Whether to close the connection when done with the query
     * @returns Promise<UpdateResult<Any>>
     */
    findOneAndUpdate(collection_1, filter_1, dataObj_1) {
        return __awaiter(this, arguments, void 0, function* (collection, filter, dataObj, upsert = true, openConnection = true, closeConnection = true) {
            if (openConnection) {
                yield this.client.connect();
            }
            let result = yield this.database.collection(collection).findOneAndUpdate(filter, dataObj, { upsert: upsert, returnDocument: "after" });
            if (closeConnection) {
                yield this.client.close();
            }
            return result;
        });
    }
    find(collection_1, dataObj_1) {
        return __awaiter(this, arguments, void 0, function* (collection, dataObj, openConnection = true, closeConnection = true) {
            if (openConnection) {
                yield this.client.connect();
            }
            let result = yield this.database.collection(collection).find(dataObj).toArray();
            if (closeConnection) {
                yield this.client.close();
            }
            return result;
        });
    }
}
exports.WildMongo = WildMongo;
