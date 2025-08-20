export const defaultCategories = [
  { name: 'Work', color: '#8B9DC3' }, // Muted blue
  { name: 'Personal', color: '#D4A574' }, // Muted orange
  { name: 'Health', color: '#9CAF88' }, // Muted green
  { name: 'Learning', color: '#C8A2C8' }, // Muted purple
  { name: 'Errands', color: '#B8B8B8' }, // Muted gray
  { name: 'Home', color: '#C4A484' }, // Muted brown
  { name: 'Finance', color: '#A8C4A2' } // Muted sage
];

export const getCategoryColor = (categoryName?: string) => {
  if (!categoryName) return '#E8E8E8';
  const category = defaultCategories.find(cat => cat.name === categoryName);
  return category ? category.color : '#A8A8A8';
};