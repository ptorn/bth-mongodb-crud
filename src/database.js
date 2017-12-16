/**
 * Setting up a Mongo DB connection and include methods to handle data.
 */
"use strict";

// MongoDB
const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const dbConnection = (database) => {
    return {
        dsn:  process.env.DBWEBB_DSN || 'mongodb://127.0.0.1:27017/' + database,
        connect: async function() {
            try {
                this.db = await mongo.connect(this.dsn);
            } catch (err) {
                throw err;
            }
        },
        findInCollection: async function (collection, criteria, projection, limit=0) {
            try {
                await this.connect();
                const col = await this.db.collection(collection);
                const res = await col.find(criteria, projection).limit(limit).toArray();

                await this.close();
                return res;
            } catch (err) {
                throw err;
            }
        },
        empty: async function (collection) {
            await this.connect();
            const col = await this.db.collection(collection);

            col.deleteMany();
            await this.close();
        },
        delete: async function (collection, key, valueData) {
            try {
                await this.connect();
                const col = await this.db.collection(collection);
                let value = valueData;

                if (key == "_id") {
                    value = ObjectID(valueData);
                }
                let res = await col.deleteOne({[key]: value});

                await this.close();
                return res;
            } catch (err) {
                throw err;
            }
        },
        // returns boolean and id
        insert: async function (collection, object) {
            try {
                await this.connect();
                const col = await this.db.collection(collection);
                let res;

                if (Array.isArray(object)) {
                    res = await col.insertMany(object);
                } else {
                    res = await col.insertOne(object);
                }
                await this.close();
                return res;
            } catch (err) {
                throw err;
            }
        },
        close: async function () {
            await this.db.close();
        },
        update: async function (collection, key, value, object) {
            try {
                if (object['_id']) {
                    delete object['_id'];
                }
                await this.connect();
                const col = await this.db.collection(collection);
                const res = await col.updateOne({'_id': ObjectID(value)}, {$set: object});

                await this.close();
                return res;
            } catch (err) {
                throw err;
            }
        },
    };
};

module.exports = dbConnection;
