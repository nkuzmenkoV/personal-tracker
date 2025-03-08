import React from 'react';

function LanguageSelector({ language, setLanguage, translations }) {
  return (
    <div className="language-selector">
      <label htmlFor="language-select" className="me-2">
        {translations[language].language}:
      </label>
      <select 
        id="language-select" 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
        className="form-select form-select-sm d-inline-block w-auto"
      >
        <option value="en">{translations[language].english}</option>
        <option value="ru">{translations[language].russian}</option>
      </select>
    </div>
  );
}

export default LanguageSelector;