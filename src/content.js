console.log('WhatsApp Translator content script is running');

let targetLanguage = 'es';
const indicator = document.createElement('div');
indicator.textContent = 'WhatsApp Translator Active';
indicator.style.position = 'fixed';
indicator.style.top = '10px';
indicator.style.right = '10px';
indicator.style.backgroundColor = 'yellow';
indicator.style.padding = '5px';
indicator.style.zIndex = '9999';
document.body.appendChild(indicator);
function translateMessage(text, messageNode) {
    console.log('Attempting to translate:', text);
    chrome.runtime.sendMessage({ action: 'translate', message: text, targetLanguage: targetLanguage }, function (response) {
      console.log('Received translation response:', response);
  
      if (response && response.translatedText) {
        const originalTextSpan = messageNode.querySelector('span.selectable-text span');
        if (originalTextSpan) {
          let translatedSpan = messageNode.querySelector('.translated-text');
          if (translatedSpan) {
            translatedSpan.textContent = response.translatedText;
          } else {
            translatedSpan = document.createElement('span');
            translatedSpan.className = 'translated-text';
            translatedSpan.style.display = 'block';  
            translatedSpan.style.color = 'blue';     
            translatedSpan.style.marginTop = '5px';  
  
            originalTextSpan.parentNode.insertBefore(translatedSpan, originalTextSpan.nextSibling);
          }
          translatedSpan.textContent = response.translatedText;
          
          translatedSpan.dataset.originalText = text;
        } else {
          console.log('Error: Could not find original text span.');
        }
      } else {
        console.log('Translation failed or no response received.');
      }
    });
  }
function addTranslateButton(messageNode) {
  console.log('Attempting to add translate button to:', messageNode);
  if (messageNode.querySelector('.translate-button')) {
    console.log('Translate button already exists for this message.');
    return;
  }

  const translateButton = document.createElement('button');
  translateButton.textContent = 'Translate';
  translateButton.className = 'translate-button';
  translateButton.style.marginLeft = '5px';
  translateButton.style.padding = '2px 5px';
  translateButton.style.backgroundColor = '#dcf8c6';
  translateButton.style.border = '1px solid #4a4a4a';
  translateButton.style.borderRadius = '3px';

  translateButton.addEventListener('click', function () {
    console.log('Translate button clicked');
    const messageText = messageNode.querySelector('div[data-pre-plain-text] span[dir="ltr"]');

    if (messageText) {
        const translatedSpan = messageNode.querySelector('.translated-text');
        const textToTranslate = translatedSpan ? translatedSpan.dataset.originalText : messageText.textContent.trim();
        console.log('Message text found:', textToTranslate);
        translateMessage(textToTranslate, messageNode);
      } else {
        console.log('Error: No selectable text found in the message.');
      }
    });
  const messageContainer = messageNode.querySelector('div.copyable-text');
  if (messageContainer) {
    messageContainer.appendChild(translateButton);
    console.log('Translate button added successfully.');
  } else {
    console.log('Could not find appropriate container for translate button.');
  }
}
function observeMessages() {
  console.log('Starting to observe DOM changes.');

  const targetNode = document.querySelector('#main');
  if (!targetNode) {
    console.log('Main chat container not found. Retrying in 1 second.');
    setTimeout(observeMessages, 1000);
    return;
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const newMessages = node.querySelectorAll('div.message-in, div.message-out');
            newMessages.forEach(addTranslateButton);
          }
        });
      }
    });
  });
  observer.observe(targetNode, { childList: true, subtree: true });
  console.log('Observer attached to main chat container.');
  processExistingMessages();
}
function processExistingMessages() {
  console.log('Processing existing messages.');
  const messages = document.querySelectorAll('div.message-in, div.message-out');
  messages.forEach(addTranslateButton);
}
setTimeout(observeMessages, 5000);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received in content script:', request);
  
    if (request.action === 'getSelectedText') {
      const selectedText = window.getSelection().toString();
      console.log('Selected text:', selectedText);
      sendResponse({ selectedText: selectedText });
    } else if (request.action === 'setTargetLanguage') {
      targetLanguage = request.language;
      console.log('Target language updated to:', targetLanguage);
      chrome.storage.sync.set({ targetLanguage: targetLanguage }, function() {
        console.log('Language saved to chrome.storage');
      });
    } else if (request.action === 'getTargetLanguage') {
      sendResponse({ targetLanguage: targetLanguage });
    }
  });
chrome.storage.sync.get(['targetLanguage'], function(result) {
    if (result.targetLanguage) {
      targetLanguage = result.targetLanguage;
      console.log('Loaded saved target language:', targetLanguage);
    }
  });