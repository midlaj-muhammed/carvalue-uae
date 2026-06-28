export function formatPrice(amount: number): string {
  return `AED ${amount.toLocaleString()}`;
}

export function formatRange(min: number, max: number): string {
  return `AED ${min.toLocaleString()} — AED ${max.toLocaleString()}`;
}

export function formatMileage(km: number): string {
  return `${km.toLocaleString()} KM`;
}
