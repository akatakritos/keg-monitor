import { BeerRepository } from './beer-repository';
import { KegRepository } from './keg-repository';

export const database = {
  beers: new BeerRepository(),
  kegs: new KegRepository(),
};
