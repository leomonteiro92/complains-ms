// @ts-check
const { MongoClient, Db, ObjectId } = require('mongodb');
const Controller = require('./complains.controller');
const faker = require('faker');
const sinon = require('sinon');
const mockData = require('./mock/data');

/**
 *
 * @type {MongoClient}
 */
let conn;
/**
 * @type {Db}
 */
let db;

before(async () => {
  conn = new MongoClient(process.env.DB_URL || 'mongodb://local:dev@127.0.0.1:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await conn.connect();
  db = conn.db(process.env.DB_NAME);
});

after(async () => {
  conn.close();
});

beforeEach(async () => {
  /** Clean database before each execution */
  db.collection('complains').deleteMany({});
});

describe('Create a complain', () => {
  it('should create a complain and return status 201', async () => {
    const req = {
      body: {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        company: faker.random.uuid(),
        latitude: +faker.address.latitude(),
        longitude: +faker.address.longitude()
      }
    };

    // @ts-ignore
    const res = { send: sinon.stub() };
    const next = sinon.spy();

    // @ts-ignore
    await Controller.create(req, res, next);
    sinon.assert.calledOnce(res.send);
    sinon.match(200).test(res.send.returnValues[0]);
  });

  it('should return status 400 if latitude is null', async () => {
    const req = {
      body: {
        body: {
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          company: faker.random.uuid(),
          longitude: +faker.address.longitude()
        }
      }
    };
    const res = { send: sinon.stub() };
    const next = sinon.spy();

    // @ts-ignore
    await Controller.create(req, res, next);
    sinon.assert.calledOnce(next);
    sinon.match(400).test(next.returnValues[0]);
  });

  it('should return status 400 if latitude is not a number', async () => {
    const req = {
      body: {
        body: {
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          company: faker.random.uuid(),
          latitude: faker.address.latitude(), //
          longitude: +faker.address.longitude()
        }
      }
    };
    const res = {
      send: sinon.stub()
    };
    const next = sinon.spy();

    // @ts-ignore
    // @ts-ignore
    await Controller.create(req, res, next);
    sinon.assert.calledOnce(next);
    sinon.match(400).test(next.returnValues[0]);
  });
});

describe('Update a complain', () => {
  it('should return status 204', async () => {
    //Populate data
    const testComplainID = '5e1729977f83ec615cceae36';
    const testComplain = {
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      company: faker.random.uuid(),
      latitude: +faker.address.latitude(),
      longitude: +faker.address.longitude(),
      location: {
        type: 'Point',
        coordinates: [+faker.address.longitude(), +faker.address.latitude()]
      },
      createdAt: faker.date.past(),
      updatedAt: faker.date.past()
    };
    await db.collection('complains').insertOne(testComplain);
    //Mock request and response
    const req = {
      params: {
        id: testComplainID
      },
      body: {
        title: 'Title changed'
      }
    };
    const res = {
      send: sinon.stub()
    };
    //Assert
    // @ts-ignore
    await Controller.update(req, res, sinon.spy());
    sinon.assert.calledOnce(res.send);
    sinon.match(204).test(res.send.returnValues[0]);
  });
});

describe('Remove a complain', () => {
  it('should return status 204', async () => {
    //Populate data
    const testComplainID = '5e1729977f83ec615cceae36';
    const testComplain = {
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      company: faker.random.uuid(),
      latitude: +faker.address.latitude(),
      longitude: +faker.address.longitude(),
      location: {
        type: 'Point',
        coordinates: [+faker.address.longitude(), +faker.address.latitude()]
      },
      createdAt: faker.date.past(),
      updatedAt: faker.date.past()
    };
    await db.collection('complains').insertOne(testComplain);
    //Mock request and response
    const req = {
      params: {
        id: testComplainID
      }
    };
    const res = {
      send: sinon.stub()
    };
    //Assert
    // @ts-ignore
    await Controller.remove(req, res, () => {});
    sinon.assert.calledOnce(res.send);
    sinon.match(204).test(res.send.returnValues[0]);
  });
});

describe('Fetch a complain', () => {
  it('should return status 200 after searching a complain', async () => {
    //Populate data
    const testComplainID = '5e1729977f83ec615cceae36';
    const testComplain = {
      _id: new ObjectId(testComplainID),
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      company: faker.random.uuid(),
      latitude: +faker.address.latitude(),
      longitude: +faker.address.longitude(),
      location: {
        type: 'Point',
        coordinates: [+faker.address.longitude(), +faker.address.latitude()]
      },
      createdAt: faker.date.past(),
      updatedAt: faker.date.past()
    };
    await db.collection('complains').insertOne(testComplain);
    //Mock request and response
    const req = {
      params: {
        id: testComplainID
      }
    };
    const res = { send: sinon.stub() };
    //Assert
    // @ts-ignore
    await Controller.findById(req, res, sinon.spy());
    sinon.assert.calledOnce(res.send);
    sinon.match(200).test(res.send.returnValues[0]);
  });
});

describe('List orders', () => {
  it('should return status 200 after request a list of orders', async () => {
    //Populate data
    await db.collection('complains').insertMany(mockData);

    //Mock request and response
    const req = {};
    const res = { send: sinon.stub() };
    //Assert
    // @ts-ignore
    await Controller.list(req, res, sinon.spy());
    sinon.assert.calledOnce(res.send);
    sinon.match(200).test(res.send.returnValues[0]);
  });
});
