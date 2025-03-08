import React from 'react';

function ThemeSwitcher({ theme, setTheme, translations }) {
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="theme-switcher">
      <label htmlFor="theme-toggle" className="me-2">
        {theme === 'light' ? 
          <span className="light-mode-icon">☀️</span> : 
          <span className="dark-mode-icon">🌙</span>}
        {translations[theme === 'light' ? 'darkMode' : 'lightMode']}
      </label>
      <label className="toggle-switch">
        <input 
          type="checkbox" 
          id="theme-toggle"
          checked={theme === 'dark'} 
          onChange={toggleTheme} 
        />
        <span className="slider"></span>
      </label>
    </div>
  );
}

export default ThemeSwitcher;