import { Request, Response } from 'express';

export interface Beer {
  _id: string;
  name: string;
  brewer: string;
  image: string;
  bitterness: number;
  abv: number;
  style: string;
  upvotes: number;
  downvotes: number;
}

import { database } from '../persistance/database';

export async function beers(req: Request, res: Response) {
  const beers = await database.beers.getAll();
  res.send(beers);
}

export async function createBeer(req: Request, res: Response) {
  const beer = req.body as Beer;
  if (beer._id) {
    return res.status(400);
  }

  const result = await database.beers.insert(beer);

  return res.send(result);
}

export async function patchBeer(req: Request, res: Response) {
  const id = req.params.id;
  await database.beers.patch(id, req.body);
  const updated = await database.beers.get(id);

  return res.send(updated);
}

export async function upvote(req: Request, res: Response) {
  const id = req.params.id;
  const updated = await database.beers.upvote(id);
  return res.send(updated);
}
export async function downvote(req: Request, res: Response) {
  const id = req.params.id;
  const updated = await database.beers.downvote(id);
  return res.send(updated);
}

export async function remove(req: Request, res: Response) {
  const id = req.params.id;
  await database.beers.delete(id);
  return res.status(200).send();
}
