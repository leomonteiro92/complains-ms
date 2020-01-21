//@ts-check
const { MongoClient, Db, ObjectId } = require('mongodb');
const { expect } = require('chai');
const faker = require('faker');
const Service = require('./complains.service');
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
  it('Must create with valid input', async () => {
    const inputComplain = {
      title: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      company: faker.random.uuid(),
      latitude: +faker.address.latitude(),
      longitude: +faker.address.longitude()
    };
    const result = await Service.create(inputComplain);
    expect(result).to.not.be.null;
    expect(result).to.haveOwnProperty('_id');
    expect(result).to.haveOwnProperty('createdAt');
    expect(result).to.haveOwnProperty('updatedAt');
    expect(result).to.haveOwnProperty('location');
  });
  it('Must throw error if latitude is empty', () => {});
  it('Must throw error if longitude is empty', () => {});
  it('Must throw error if title is empty', () => {});
  it('Must throw error if description is empty', () => {});
  it('Must throw error if company is empty', () => {});
});

describe('Update a complain', () => {
  it('Must update the record', async () => {
    /**
     * Populate data
     */
    const mockComplainID = '5e25cd5bfc13ae5941000000';
    const mockComplain = {
      _id: new ObjectId(mockComplainID),
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
    db.collection('complains').insertOne(mockComplain);
    let result = await db.collection('complains').findOne({ _id: new ObjectId(mockComplainID) });

    const newTitle = faker.lorem.words(3);

    await Service.update(mockComplainID, { title: newTitle });

    result = await db.collection('complains').findOne({ _id: new ObjectId(mockComplainID) });
    expect(result._id.toString()).to.be.eqls(mockComplainID);
    expect(result.title).to.be.eqls(newTitle);
  });
  it('Must throw error if try to update a record that do not exists', () => {});
});

describe('Remove a complain', () => {
  it('Must remove the record', async () => {
    /**
     * Populate data
     */
    const mockComplainID = '5e25cd5bfc13ae5941000000';
    const mockComplain = {
      _id: new ObjectId(mockComplainID),
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
    db.collection('complains').insertOne(mockComplain);
    let result = await db.collection('complains').findOne({ _id: new ObjectId(mockComplainID) });
    expect(result).to.exist;
    await Service.remove(mockComplainID);
    result = await db.collection('complains').findOne({ _id: new ObjectId(mockComplainID) });
    expect(result).to.be.null;
  });
  it('Must throw error if try to remove a record that do not exists', () => {});
});

describe('List complains', () => {
  it("Must list only the complais made 2km near to the developer's residence", async () => {
    /**
     * Populate  data
     */
    const [centerLat, centerLng] = [-23.601791, -46.6455662];
    await db.collection('complains').insertMany(mockData);

    const { count, complains } = await Service.list({
      size: 10,
      page: 0,
      filters: {
        latitude: centerLat,
        longitude: centerLng,
        radius: 1
      }
    });

    expect(count).to.be.eqls(2);
    expect(complains.length).to.be.eqls(2);
  });

  it('Must sort the results by title ascending', async () => {
    await db.collection('complains').insertMany(mockData);

    const { count, complains } = await Service.list({
      sort: {
        title: 1
      }
    });

    expect(count).to.be.eqls(5);
    expect(complains[0].title).to.match(/guarulhos/gi);
    expect(complains[complains.length - 1].title).to.match(/santa/gi);
  });

  it('Must sort the results by title descending', async () => {
    await db.collection('complains').insertMany(mockData);

    const { count, complains } = await Service.list({
      sort: {
        title: -1
      }
    });

    expect(count).to.be.eqls(5);
    expect(complains[0].title).to.match(/santa/gi);
    expect(complains[complains.length - 1].title).to.match(/guarulhos/gi);
  });

  it('Must filter the results by title ignoring case', async () => {
    await db.collection('complains').insertMany(mockData);

    const { count, complains } = await Service.list({
      filters: {
        title: 'guarulhos'
      }
    });

    expect(count).to.be.eqls(1);
    expect(complains[0].title).to.match(/guarulhos/gi);
  });
});

describe('Find By Id', () => {
  it('Must return the details of an complain by its id', async () => {
    const mockComplainID = '5e25cd5bfc13ae5941000000';
    const mockComplain = {
      _id: new ObjectId(mockComplainID),
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
    db.collection('complains').insertOne(mockComplain);

    const result = await Service.findById(mockComplainID);
    expect(result._id.toString()).to.be.eqls(mockComplainID);
    expect(result.title).to.be.eqls(mockComplain.title);
  });
});
