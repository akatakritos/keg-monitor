import io from 'socket.io-client';
import { TapDescription, Beer, Tap, Metadata } from '../ServerModels';

// const root = 'http://192.168.164.129:4000';
// const root = 'http://localhost:4000';
// const root = 'http://192.168.20.5:4000';
const root = '';

export enum SocketEvents {
  temperature = 'temp',
  refreshBeers = 'refresh',
}

function post(endpoint: string, body?: any) {
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  });
}

function patch(endpoint: string, body: any) {
  return fetch(endpoint, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

function httpDelete(endpoint: string) {
  return fetch(endpoint, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  });
}

function put(endpoint: string, body: any) {
  return fetch(endpoint, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export function openSocket(): SocketIOClient.Socket {
  return io(root);
}

export async function getTaps(): Promise<TapDescription> {
  const response = await fetch(root + '/api/taps');
  return await response.json();
}

export async function getTemp(): Promise<number> {
  const response = await fetch(root + '/api/temp');
  const body = await response.json();
  return body.temperature;
}

export async function saveBeer(payload: Partial<Beer>) {
  const response = await post(root + '/api/beers', payload);
  const beer = (await response.json()) as Beer;
  return beer;
}

export async function getBeers() {
  const response = await fetch(root + '/api/beers');
  const beers = (await response.json()) as Beer[];
  return beers;
}

export async function patchBeer(id: string, payload: Partial<Beer>) {
  const response = await patch(root + '/api/beers/' + id, payload);
  const beer = (await response.json()) as Beer;
  return beer;
}

export async function upVoteBeer(id: string) {
  const response = await post(root + '/api/beers/' + id + '/upvotes');
  const beer = (await response.json()) as Beer;
  return beer;
}

export async function downVoteBeer(id: string) {
  const response = await post(root + '/api/beers/' + id + '/downvotes');
  const beer = (await response.json()) as Beer;
  return beer;
}

export async function deleteBeer(id: string) {
  await httpDelete(root + '/api/beers/' + id);
}

export async function markTapEmpty(tap: Tap) {
  await httpDelete(root + '/api/taps/' + tap);
}

export async function tapKeg(tap: Tap, beerId: string) {
  await put(root + '/api/taps/' + tap, { beerId });
}

export async function getMetadata(): Promise<Metadata> {
  const response = await fetch(root + '/api/metadata');
  return await response.json();
}
