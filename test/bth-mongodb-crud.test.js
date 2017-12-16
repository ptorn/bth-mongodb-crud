const mocha = require('mocha');
const chai = require('chai');
const describe = mocha.describe;
const it = mocha.it;
const db = require('../src/bth-mongodb-crud')('test');
const expect = chai.expect;

describe('Test database module', function () {
    before(async () => {
        await db.insert('test', {username: 'John Smith'});
    });
    after(async () => {
        await db.empty('test');
    });

    describe('Check db default config', () => {
        it('DSN Default', () => {
            expect(db.dsn).to.equal('mongodb://127.0.0.1:27017/test');
        });

        it('Get sample data', async () => {
            let result = await db.findInCollection('test', {}, {});

            // console.log(db);
            expect(result[0].username).to.equal('John Smith');
        });
    });

    describe('Test CRUD methods.', () => {
        it('Check only one test data stored', async () => {
            let result = await db.findInCollection('test', {}, {});

            expect(result.length).to.equal(1);
        });

        it('Add one item', async () => {
            await db.insert('test', {insert: "item inserted"});
            let result = await db.findInCollection('test', {}, {});

            expect(result[1].insert).to.equal('item inserted');
            expect(result.length).to.equal(2);
        });

        it('Add two items', async () => {
            await db.insert('test', [{insert: 'item inserted'}, {insert2: 'item2 inserted'}]);
            let result = await db.findInCollection('test', {}, {});

            expect(result[1].insert).to.equal('item inserted');
            expect(result.length).to.equal(4);
        });

        it('Delete one item by id', async () => {
            let item = await db.findInCollection('test', {insert: 'item inserted'}, {});

            await db.delete('test', '_id', item[0]._id);

            let result = await db.findInCollection('test', {}, {});

            expect(result[3]).to.be.undefined;
            expect(result.length).to.equal(3);
        });

        it('Update one item by id', async () => {
            let item = await db.findInCollection('test', {username: 'John Smith'}, {});

            await db.update('test', "_id", item[0]._id, {username: 'John Snow'});
            let result = await db.findInCollection('test', {}, {});

            expect(result[0].username).to.equal('John Snow');
            expect(result.length).to.equal(3);
        });
    });
});
