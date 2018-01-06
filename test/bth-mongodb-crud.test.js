const mocha = require('mocha');
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const describe = mocha.describe;
const it = mocha.it;
const db = require('../src/bth-mongodb-crud')('test');
const expect = chai.expect;
const beforeEach = mocha.beforeEach;
const afterEach = mocha.afterEach;

chai.use(chaiAsPromised);

describe('Test database module', function () {
    beforeEach(async () => {
        await db.insert('test', {username: 'John Smith'});
    });
    afterEach(async () => {
        await db.empty('test');
    });

    describe('Check db default config', () => {
        it('DSN Default', () => {
            expect(db.dsn).to.equal('mongodb://127.0.0.1:27017/test');
        });

        it('Get sample data', async () => {
            let result = await db.findInCollection('test', {}, {});

            expect(result[0].username).to.equal('John Smith');
        });

        it('Check if connect throws error', async () => {
            db.dsn = 'mongodb://127.0.0.2:27018/test';
            expect(db.connect()).to.be.rejectedWith();
            db.dsn = 'mongodb://127.0.0.1:27017/test';
        });
    });

    describe('Test CRUD methods.', () => {
        it('Check only one test data stored', async () => {
            let result = await db.findInCollection('test', {}, {});

            expect(result.length).to.equal(1);
        });

        it('Check if find throws error', async () => {
            expect(db.findInCollection()).to.be.rejectedWith();
        });

        it('Add one item', async () => {
            await db.insert('test', {insert: "item inserted"});
            let result = await db.findInCollection('test', {}, {});

            expect(result[1].insert).to.equal('item inserted');
            expect(result.length).to.equal(2);
        });

        it('Check if delete throws error', async () => {
            expect(db.insert()).to.be.rejectedWith();
        });

        it('Add two items', async () => {
            await db.insert('test', [{insert: 'item inserted'}, {insert2: 'item2 inserted'}]);
            let result = await db.findInCollection('test', {}, {});

            expect(result[1].insert).to.equal('item inserted');
            expect(result.length).to.equal(3);
        });

        it('Delete one item by id', async () => {
            await db.insert('test', [{ insert: 'item inserted' }, { insert2: 'item2 inserted' }]);
            let item = await db.findInCollection('test', {insert: 'item inserted'}, {});

            await db.delete('test', '_id', item[0]._id);
            let result = await db.findInCollection('test', {}, {});

            expect(result[2]).to.be.undefined;
            expect(result.length).to.equal(2);
        });

        it('Check if delete throws error', async () => {
            expect(db.delete()).to.be.rejectedWith();
        });

        it('Update one item by id', async () => {
            let item = await db.findInCollection('test', {username: 'John Smith'}, {});

            await db.update('test', "_id", item[0]._id, {username: 'John Snow'});
            let result = await db.findInCollection('test', {}, {});

            expect(result[0].username).to.equal('John Snow');
            expect(result.length).to.equal(1);
        });

        it('Update one item by id inside object', async () => {
            let item = await db.findInCollection('test', { username: 'John Smith' }, {});

            await db.update('test', "_id", item[0]._id, {
                _id: item[0]._id,
                username: 'John Snow',
            });
            let result = await db.findInCollection('test', {}, {});

            expect(result[0].username).to.equal('John Snow');
            expect(result.length).to.equal(1);
        });

        it('Check if update throws error', async () => {
            expect(db.update()).to.be.rejectedWith();
        });
    });
});
