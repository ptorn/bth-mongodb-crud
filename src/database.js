"use strict";

/**
 * Setting up a Mongo DB connection and include methods to handle data.
 */

// MongoDB
const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const dbConnection = (database) => {
    return {
        dsn:  process.env.DBWEBB_DSN || 'mongodb://127.0.0.1:27017/' + database,

        /**
         * connect to MongoDB
         * @return {void}
         */
        connect: async function() {
            try {
                this.db = await mongo.connect(this.dsn);
            } catch (err) {
                throw err;
            }
        },



        /**
         * Find object/objects in database
         * @param  {string} collection name of collection
         * @param  {object} criteria   search criteria
         * @param  {object} projection projection
         * @param  {Number} [limit=0]  0 for no limit else nr for amount result.
         * @return {array}             Array with result
         */
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



        /**
         * Empty collection
         * @param  {string} collection Name of collection
         * @return {void}
         */
        empty: async function (collection) {
            await this.connect();
            const col = await this.db.collection(collection);

            col.deleteMany();
            await this.close();
        },



        /**
         * Delete object from database
         * @param  {string} collection Name of collection
         * @param  {string} key        Key value to search in
         * @param  {string} valueData  Value to search for
         * @return {boolean}           True or false
         */
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



        /**
         * Insert object in database
         * @param  {string} collection Name of collection
         * @param  {object} object     Object to insert into database
         * @return {object}            Object with new id
         */
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



        /**
         * Close connection to database
         * @return {void}
         */
        close: async function () {
            await this.db.close();
        },



        /**
         * Update object
         * @param  {string} collection Name of collection
         * @param  {string} key        Key value to search in
         * @param  {string} value      Value to search for
         * @param  {object} object     Object data to update with
         * @return {boolean}           True or false
         */
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
