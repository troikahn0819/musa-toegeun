import { useState } from 'react';
import { applyTheme, getSavedTheme, THEMES } from './themes';
import type { ThemeId } from './themes';

export function ThemeSwitcher() {
  const [activeTheme, setActiveTheme] = useState<ThemeId>(getSavedTheme);

  const selectTheme = (theme: ThemeId) => {
    setActiveTheme(theme);
    applyTheme(theme);
  };

  return (
    <div className="theme-switcher" role="group" aria-label="디자인 테마">
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          type="button"
          className="theme-switcher__option"
          style={{ '--theme-swatch': theme.color } as React.CSSProperties}
          aria-label={theme.label}
          aria-pressed={activeTheme === theme.id}
          title={theme.label}
          onClick={() => selectTheme(theme.id)}
        >
          <span aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

