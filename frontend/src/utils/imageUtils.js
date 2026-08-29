export const getCategoryFallbackImage = (categoryName) => {
  if (!categoryName) return '/cat_medicines.png';
  const name = categoryName.toLowerCase();
  if (name.includes('supplement') || name.includes('vitamin')) return '/cat_supplements.png';
  if (name.includes('device') || name.includes('equipment')) return '/cat_devices.png';
  if (name.includes('baby') || name.includes('pediatric')) return '/cat_babycare.png';
  if (name.includes('derma') || name.includes('cosmetic')) return '/cat_cosmetics.png';
  if (name.includes('ayurveda') || name.includes('herbal')) return '/cat_ayurveda.png';
  return '/cat_medicines.png';
};
