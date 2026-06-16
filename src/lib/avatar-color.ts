const COLORS = [
  { bg: 'bg-peach-soft', text: 'text-peach-text' },
  { bg: 'bg-lavender-soft', text: 'text-lavender-text' },
  { bg: 'bg-sage-soft', text: 'text-sage-text' },
  { bg: 'bg-sky-soft', text: 'text-sky-text' },
  { bg: 'bg-butter-soft', text: 'text-butter-text' },
  { bg: 'bg-blush-soft', text: 'text-blush-text' },
]

export function getAvatarColor(name: string) {
  if (!name) return COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function getInitials(name: string): string {
  if (!name) return "";
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
}
