export function getCurrencySymbol(marketplace: string) {
  const euroMarkets = ["es", "de", "fr", "it"];
  if (euroMarkets.includes(marketplace.toLowerCase())) return "€";
  if (marketplace.toLowerCase() === "uk") return "£";
  return "$";
}
