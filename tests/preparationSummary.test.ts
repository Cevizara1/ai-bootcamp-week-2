import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createPreparationSummary } from '../server/preparationSummary.ts';

const seedItems = [
  { id: 1, title: 'Pročitaj opis pozicije', completed: true },
  { id: 2, title: 'Izdvoji tri najvažnije tehnologije', completed: true },
  { id: 3, title: 'Pripremi STAR primer za timski rad', completed: false },
  { id: 4, title: 'Pripremi primer debugovanja', completed: false },
  { id: 5, title: 'Proveri GitHub profil', completed: true },
  { id: 6, title: 'Zapiši pitanja za intervjuera', completed: false },
  { id: 7, title: 'Proveri lokalno pokretanje projekta', completed: false },
  { id: 8, title: 'Napravi kratak plan učenja', completed: false }
];

test('createPreparationSummary calculates the seed summary', () => {
  assert.deepEqual(createPreparationSummary(seedItems), {
    total: 8,
    completed: 3,
    remaining: 5,
    percentage: 38
  });
});

test('createPreparationSummary returns zeros for an empty list', () => {
  assert.deepEqual(createPreparationSummary([]), {
    total: 0,
    completed: 0,
    remaining: 0,
    percentage: 0
  });
});
