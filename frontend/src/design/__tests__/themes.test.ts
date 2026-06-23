import { beforeEach, describe, expect, it } from 'vitest';
import { applyTheme, getSavedTheme, isThemeId, THEMES } from '../themes';

describe('design themes', () => {
  beforeEach(() => localStorage.clear());

  it('provides several interchangeable themes', () => {
    expect(THEMES.map((theme) => theme.id)).toEqual(['paper', 'night', 'mint']);
  });

  it('persists and restores the selected theme', () => {
    applyTheme('night');
    expect(document.documentElement.dataset.theme).toBe('night');
    expect(getSavedTheme()).toBe('night');
  });

  it('falls back safely when stored data is invalid', () => {
    localStorage.setItem('musa-toegeun-theme', 'broken-theme');
    expect(isThemeId('broken-theme')).toBe(false);
    expect(getSavedTheme()).toBe('paper');
  });
});

