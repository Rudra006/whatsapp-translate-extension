import React, { useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import TranslatedMessage from './TranslatedMessage';
import { translateText } from '../utils/translator';

const App = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [originalMessage, setOriginalMessage] = useState('');
  const [translatedMessage, setTranslatedMessage] = useState('');

  useEffect(() => {
    // Load the saved language when the component mounts
    chrome.storage.sync.get(['targetLanguage'], function(result) {
      if (result.targetLanguage) {
        setSelectedLanguage(result.targetLanguage);
      }
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getSelectedText' }, (response) => {
        if (response && response.selectedText) {
          setOriginalMessage(response.selectedText);
        }
      });
    });
  }, []);

  useEffect(() => {
    if (originalMessage) {
      translateText(originalMessage, selectedLanguage)
        .then((result) => setTranslatedMessage(result))
        .catch((error) => console.error('Translation error:', error));
    }
  }, [originalMessage, selectedLanguage]);

  const handleLanguageChange = (newLanguage) => {
    setSelectedLanguage(newLanguage);
    chrome.storage.sync.set({ targetLanguage: newLanguage }, function() {
      console.log('Language saved to chrome.storage');
    });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'setTargetLanguage', language: newLanguage });
    });
  };

  return (
    <div className="app">
      <h1>WhatsApp Translator</h1>
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />
      <TranslatedMessage
        originalMessage={originalMessage}
        translatedMessage={translatedMessage}
      />
    </div>
  );
};

export default App;