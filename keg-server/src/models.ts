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
  description: string;
}
export type Tap = 'left' | 'right';

export interface Tapped extends KegLog {
  beer: Beer;
}

export interface KegLog {
  _id: string;
  tap: Tap;
  tapped: Date;
  emptied?: Date;
  beerId: string;
  isCurrent: boolean;
}

export interface TapDescription {
  tapLeft: Tapped | null;
  tapRight: Tapped | null;
}
