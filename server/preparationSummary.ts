import type { PreparationItem, PreparationSummary } from './contracts.ts';

export function createPreparationSummary(items: readonly PreparationItem[]): PreparationSummary {
  const total = items.length;

  // Rani izlaz ide PRVI: za prazan niz bi completed / total dalo 0/0 = NaN,
  // a ugovor traži četiri nule.
  if (total === 0) {
    return { total: 0, completed: 0, remaining: 0, percentage: 0 };
  }

  const completed = items.filter((item) => item.completed).length;

  // remaining se izvodi iz total i completed umesto da se broji zasebno —
  // jedan izvor istine, nemoguće je da se dve brojke raziđu.
  const remaining = total - completed;

  // Math.round po tački 3 uputstva: 3/8 = 37.5 → 38.
  // Math.floor bi dao 37 i oborio obavezni primer.
  const percentage = Math.round((completed / total) * 100);

  return { total, completed, remaining, percentage };
}