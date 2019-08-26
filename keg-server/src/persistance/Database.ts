import { BeerRepository } from './BeerRepository';
import { KegRepository } from './KegRepository';

export const database = {
  beers: new BeerRepository(),
  kegs: new KegRepository(),
};
