import React from 'react';

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <select value={selectedLanguage} onChange={(e) => onLanguageChange(e.target.value)}>
      <option value="es">Spanish</option>
      <option value="fr">French</option>
      <option value="de">German</option>
      <option value="it">Italian</option>
      <option value="pt">Portuguese</option>
    </select>
  );
};

export default LanguageSelector;