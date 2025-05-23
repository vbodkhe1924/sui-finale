import { suiClient } from './client';

export async function getBalance(address: string) {
  return suiClient.getBalance({ owner: address });
}

export async function getObjects(address: string) {
  return suiClient.getOwnedObjects({ owner: address });
} 