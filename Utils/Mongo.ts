import { MongoClient, Db, InsertOneResult, UpdateResult, WithId, Document } from "mongodb";

export class WildMongo {
    public client: MongoClient;
    public database: Db;

    constructor(database: string = "wildwhispers") {
        let uri = process.env.mongoURI;
        this.client = new MongoClient(uri);
        this.database = this.client.db(database);
    }

    get(): Db {
        if (
            this.client !== null &&
            this.database !== null
        ) {
            return this.database;
        } else {
            throw new Error("Cannot get Mongo client. Specified client or database was null.");
        }
    }

    setDatabase(database: string): void {
        this.database = this.client.db(database);
    }

    async insertOne(collection: string, dataObj: Object, openConnection=true, closeConnection=true): Promise<InsertOneResult<any>> {
        if (openConnection) {
            await this.client.connect();
        }
        let result = await this.database.collection(collection).insertOne(dataObj);
        if (closeConnection) {
            await this.client.close();
        }
        return result;
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
    async updateOne(collection: string, filter: Object, dataObj: Object, upsert=true, openConnection=true, closeConnection=true): Promise<UpdateResult<any>> {
        if (openConnection) {
            await this.client.connect();
        }
        let result = await this.database.collection(collection).updateOne(filter, dataObj, { upsert: upsert });
        if (closeConnection) {
            await this.client.close();
        }
        return result;
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
    async findOneAndUpdate(collection: string, filter: Object, dataObj: Object, upsert=true, openConnection=true, closeConnection=true): Promise<WithId<Document>> {
        if (openConnection) {
            await this.client.connect();
        }
        let result = await this.database.collection(collection).findOneAndUpdate(filter, dataObj, { upsert: upsert, returnDocument: "after" });
        if (closeConnection) {
            await this.client.close();
        }
        return result;
    }

    async find(collection: string, dataObj: Object, openConnection=true, closeConnection=true): Promise<Array<any>> {
        if (openConnection) {
            await this.client.connect();
        }
        let result = await this.database.collection(collection).find(dataObj).toArray();
        if (closeConnection) {
            await this.client.close();
        }
        return result;
    }
}