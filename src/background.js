console.log('Background script loaded');
import { translateText } from './utils/translator';
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate') {
    console.log('Translating message:', request.message);
    translateText(request.message, request.targetLanguage)
      .then((translatedText) => {
        sendResponse({ translatedText });
      })
      .catch((error) => {
        console.error('Translation error:', error);
        sendResponse({ error: 'Translation failed' });
      });
    return true; // Indicates that the response is sent asynchronously
  }
});