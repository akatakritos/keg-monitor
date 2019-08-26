import Datastore from 'nedb-promises';
import uuid from 'uuid';
import { KegLog, Tap } from '../models';
import { childLogger } from '../lib/Logger';
const logger = childLogger('db');

const kegs = Datastore.create({ filename: 'data/kegs.db' });
function createLogger(ds: Datastore, op: string) {
  ds.on(op, (ds, result, query) => {
    logger.debug('kegs.' + op, query);
  });
}

createLogger(kegs, 'find');
createLogger(kegs, 'findOne');
createLogger(kegs, 'insert');
createLogger(kegs, 'remove');
createLogger(kegs, 'update');

export class KegRepository {
  open() {
    return kegs.load();
  }

  async tapKeg(tap: Tap, beerId: string): Promise<KegLog> {
    await this.removeCurrentKeg(tap);

    const log: KegLog = {
      _id: uuid(),
      tap,
      tapped: new Date(),
      emptied: null,
      beerId,
      isCurrent: true,
    };

    await kegs.insert(log);
    return log;
  }

  get(tap: Tap): Promise<KegLog> {
    return kegs.findOne({ tap, isCurrent: true });
  }

  async markTapEmpty(tap: Tap): Promise<KegLog> {
    const log = await this.get(tap);
    return this.markEntryEmpty(log._id);
  }

  private async markEntryEmpty(id: string): Promise<KegLog> {
    return kegs.update({ _id: id }, { $set: { emptied: new Date() } }, { returnUpdatedDocs: true });
  }

  private async removeCurrentKeg(tap: Tap) {
    const current = await this.get(tap);

    if (current) {
      if (!current.emptied) {
        await this.markEntryEmpty(current._id);
      }

      await kegs.update({ _id: current._id }, { $set: { isCurrent: false } });
    }
  }

  async getLog(): Promise<KegLog[]> {
    const result = await kegs.find({}).sort({ tapped: 1 });
    return result as KegLog[];
  }
}
