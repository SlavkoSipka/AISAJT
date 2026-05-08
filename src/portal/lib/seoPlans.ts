export type SeoPlanKey = 'start' | 'grow' | 'pro';

export interface SeoPlanOption {
  key: SeoPlanKey;
  name: 'Start' | 'Grow' | 'Pro';
  price: 150 | 250 | 450;
}

export const SEO_PLAN_OPTIONS: SeoPlanOption[] = [
  { key: 'start', name: 'Start', price: 150 },
  { key: 'grow', name: 'Grow', price: 250 },
  { key: 'pro', name: 'Pro', price: 450 },
];

export function getSeoPlanByKey(key: SeoPlanKey): SeoPlanOption {
  return SEO_PLAN_OPTIONS.find(p => p.key === key) || SEO_PLAN_OPTIONS[1];
}

export function resolveSeoPlan(
  packageName: string | null | undefined,
  packagePrice: number | null | undefined,
): SeoPlanOption | null {
  const normalizedName = packageName?.trim().toLowerCase();

  if (normalizedName) {
    const byName = SEO_PLAN_OPTIONS.find(p => p.name.toLowerCase() === normalizedName);
    if (byName) return byName;
  }

  if (typeof packagePrice === 'number') {
    const byPrice = SEO_PLAN_OPTIONS.find(p => p.price === packagePrice);
    if (byPrice) return byPrice;
  }

  return null;
}

export function getSeoPlanDisplay(
  packageName: string | null | undefined,
  packagePrice: number | null | undefined,
): string | null {
  const plan = resolveSeoPlan(packageName, packagePrice);
  return plan ? `${plan.name} — €${plan.price}/mes` : null;
}
