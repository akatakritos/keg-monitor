import { Request, Response } from 'express';

import { database } from '../persistance/Database';
import { Beer } from '../models';
import { childLogger } from '../lib/Logger';

const logger = childLogger('BeerController');

export async function beers(req: Request, res: Response) {
  const beers = await database.beers.getAll();
  res.send(beers);
}

export async function createBeer(req: Request, res: Response) {
  const beer = req.body as Beer;
  if (beer._id) {
    logger.warn('tried to create beer with _id field');
    return res.status(400);
  }

  const result = await database.beers.insert(beer);
  logger.info('beer "%s" (%s) created', result.name, result._id);

  return res.send(result);
}

export async function patchBeer(req: Request, res: Response) {
  const id = req.params.id;
  await database.beers.patch(id, req.body);
  const updated = await database.beers.get(id);
  logger.info('beer "%s" (%s) patched', updated.name, updated._id);

  return res.send(updated);
}

export async function upvote(req: Request, res: Response) {
  const id = req.params.id;
  const updated = await database.beers.upvote(id);
  logger.info('beer %s upvoted', id);

  return res.send(updated);
}
export async function downvote(req: Request, res: Response) {
  const id = req.params.id;
  const updated = await database.beers.downvote(id);
  logger.info('beer %s downvoted', id);

  return res.send(updated);
}

export async function remove(req: Request, res: Response) {
  const id = req.params.id;
  await database.beers.delete(id);
  logger.info('beer %s deleted', id);

  return res.status(200).send();
}
