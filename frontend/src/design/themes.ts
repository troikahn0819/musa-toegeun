export const THEMES = [
  { id: 'paper', label: '업무철', color: '#d94a3a' },
  { id: 'night', label: '야간당직', color: '#77e2a8' },
  { id: 'mint', label: '전자결재', color: '#087f78' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

const STORAGE_KEY = 'musa-toegeun-theme';

export function isThemeId(value: string | null): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}

export function getSavedTheme(): ThemeId {
  const saved = localStorage.getItem(STORAGE_KEY);
  return isThemeId(saved) ? saved : 'paper';
}

export function applyTheme(theme: ThemeId) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
}

export function initializeTheme() {
  applyTheme(getSavedTheme());
}

