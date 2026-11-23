
export type Theme = 'sinutre' | 'sinutre-dark' | 'sinutre-blue';

const THEME_KEY = 'sinutre.theme';

export function getTheme(): Theme {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (
    savedTheme === 'sinutre-dark' ||
    savedTheme === 'sinutre-blue' ||
    savedTheme === 'sinutre'
  ) {
    return savedTheme;
  }

  return 'sinutre';
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}
