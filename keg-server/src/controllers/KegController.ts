import { Request, Response } from 'express';
import { database } from '../persistance/Database';
import { Tapped, Beer, Tap } from '../models';

export async function tap(req: Request, res: Response) {
  const tap = req.params.tap as Tap;
  const beerId = req.body.beerId;
  const log = await database.kegs.tapKeg(tap, beerId);
  const beer = await database.beers.get(log.beerId);

  const result: Tapped = {
    beer,
    ...log,
  };

  return res.send(result);
}

export async function markEmpty(req: Request, res: Response) {
  const tap = req.params.tap as Tap;

  const log = await database.kegs.markTapEmpty(tap);
  const beer = await database.beers.get(log.beerId);

  const result: Tapped = {
    beer,
    ...log,
  };

  return res.send(result);
}

export async function getTaps(req: Request, res: Response) {
  const kegs = await Promise.all([database.kegs.get('left'), database.kegs.get('right')]);
  const beers = await Promise.all(kegs.map(k => (k ? database.beers.get(k.beerId) : Promise.resolve(null))));

  const result = [kegs[0] ? { beer: beers[0], ...kegs[0] } : null, kegs[1] ? { beer: beers[1], ...kegs[1] } : null];

  return res.send(result);
}

export async function getLog(req: Request, res: Response) {
  const logs = await database.kegs.getLog();
  const cache: Map<string, Beer> = new Map();

  const result: Tapped[] = [];
  for (let i = 0; i < logs.length; i++) {
    let beer;
    if (cache.has(logs[i].beerId)) {
      beer = cache.get(logs[i].beerId);
    } else {
      beer = await database.beers.get(logs[i].beerId);
    }

    result.push({
      beer,
      ...logs[i],
    });
  }

  return res.send(result);
}
