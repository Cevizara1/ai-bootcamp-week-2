import { test } from 'node:test';
import assert from 'node:assert/strict';

import type { PreparationItem } from '../server/contracts.ts';
import { createPreparationSummary } from '../server/preparationSummary.ts';

// Helper umesto ručnog nabrajanja osam objekata — čita se lakše i
// trivijalno je promeniti odnos completed/total u drugim testovima.
function buildItems(total: number, completed: number): PreparationItem[] {
  return Array.from({ length: total }, (_, index) => ({
    id: index + 1,
    title: `Stavka ${index + 1}`,
    completed: index < completed, // prvih `completed` stavki su završene
  }));
}

test('vraća 8 / 3 / 5 / 38 za obavezni primer', () => {
  const summary = createPreparationSummary(buildItems(8, 3));

  // deepStrictEqual proverava ceo objekat odjednom — hvata i višak polja,
  // ne samo pogrešne vrednosti kao pojedinačni assert.equal pozivi.
  assert.deepStrictEqual(summary, {
    total: 8,
    completed: 3,
    remaining: 5,
    percentage: 38, // 3/8 = 37.5 → zaokruženo na najbliži ceo broj
  });
});

test('vraća sve nule za prazan niz', () => {
  assert.deepStrictEqual(createPreparationSummary([]), {
    total: 0,
    completed: 0,
    remaining: 0,
    percentage: 0,
  });
});

// Edge slučajevi preko minimuma — jeftini, a hvataju regresije u
// graničnim vrednostima procenta.
test('vraća 100 posto kada su sve stavke završene', () => {
  const summary = createPreparationSummary(buildItems(4, 4));
  assert.equal(summary.percentage, 100);
  assert.equal(summary.remaining, 0);
});

test('vraća 0 posto kada nijedna stavka nije završena', () => {
  const summary = createPreparationSummary(buildItems(4, 0));
  assert.equal(summary.percentage, 0);
  assert.equal(summary.completed, 0);
});

test('ne mutira ulazni niz', () => {
  const items = buildItems(3, 1);
  const snapshot = structuredClone(items);

  createPreparationSummary(items);

  // Potpis je readonly, ali TypeScript to ne garantuje u runtime-u —
  // ovaj test to proverava stvarno.
  assert.deepStrictEqual(items, snapshot);
});