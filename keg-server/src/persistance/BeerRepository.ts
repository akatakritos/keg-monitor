import Datastore from 'nedb-promises';
import uuid from 'uuid';
import { Beer } from '../models';
import { childLogger } from '../lib/Logger';
const logger = childLogger('db');

function createLogger(ds: Datastore, op: string) {
  ds.on(op, (ds, result, query) => {
    logger.debug('beers.' + op, query);
  });
}

const beers = Datastore.create({ filename: 'data/beers.db' });
createLogger(beers, 'find');
createLogger(beers, 'findOne');
createLogger(beers, 'insert');
createLogger(beers, 'remove');
createLogger(beers, 'update');

export class BeerRepository {
  open() {
    return beers.load();
  }

  async insert(beer: Beer): Promise<Beer> {
    const copy = { ...beer };
    copy._id = uuid();
    copy.upvotes = 0;
    copy.downvotes = 0;
    await beers.insert(copy);
    return copy;
  }

  async patch(id: string, set: Partial<Beer>) {
    return beers.update({ _id: id }, { $set: set });
  }

  async get(id: string): Promise<Beer | null> {
    return beers.findOne({ _id: id });
  }

  async getAll(): Promise<Beer[]> {
    return beers.find({});
  }

  async delete(id: string) {
    return beers.remove({ _id: id }, { multi: false });
  }

  async upvote(id: string) {
    return beers.update({ _id: id }, { $inc: { upvotes: 1 } }, { returnUpdatedDocs: true });
  }

  async downvote(id: string) {
    return beers.update({ _id: id }, { $inc: { downvotes: 1 } }, { returnUpdatedDocs: true });
  }
}
