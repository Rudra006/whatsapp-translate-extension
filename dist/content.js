/******/ (() => { // webpackBootstrap
/*!************************!*\
  !*** ./src/content.js ***!
  \************************/
console.log('WhatsApp Translator content script is running');
var targetLanguage = 'es';
// Create a visible indicator that the script is running
var indicator = document.createElement('div');
indicator.textContent = 'WhatsApp Translator Active';
indicator.style.position = 'fixed';
indicator.style.top = '10px';
indicator.style.right = '10px';
indicator.style.backgroundColor = 'yellow';
indicator.style.padding = '5px';
indicator.style.zIndex = '9999';
document.body.appendChild(indicator);

// Function to send the text for translation and update the UI with the result
function translateMessage(text, messageNode) {
  console.log('Attempting to translate:', text);

  // Send the translation request to the background script
  chrome.runtime.sendMessage({
    action: 'translate',
    message: text,
    targetLanguage: targetLanguage
  }, function (response) {
    console.log('Received translation response:', response);
    if (response && response.translatedText) {
      // Update the message with translated text displayed below the original text
      var originalTextSpan = messageNode.querySelector('span.selectable-text span');
      if (originalTextSpan) {
        // Check if a translated message already exists
        var translatedSpan = messageNode.querySelector('.translated-text');
        if (translatedSpan) {
          translatedSpan.textContent = response.translatedText;
        } else {
          // Create a new span for the translated text and display it below the original message
          translatedSpan = document.createElement('span');
          translatedSpan.className = 'translated-text';
          translatedSpan.style.display = 'block'; // Ensure it is displayed below
          translatedSpan.style.color = 'blue'; // Differentiate the translated text visually
          translatedSpan.style.marginTop = '5px'; // Add some spacing from the original text

          originalTextSpan.parentNode.insertBefore(translatedSpan, originalTextSpan.nextSibling);
        }
        translatedSpan.textContent = response.translatedText;

        // Store the original text as a data attribute
        translatedSpan.dataset.originalText = text;
      } else {
        console.log('Error: Could not find original text span.');
      }
    } else {
      console.log('Translation failed or no response received.');
    }
  });
}

// Function to add the translate button to each message
function addTranslateButton(messageNode) {
  console.log('Attempting to add translate button to:', messageNode);

  // Check if button already exists to avoid duplicates
  if (messageNode.querySelector('.translate-button')) {
    console.log('Translate button already exists for this message.');
    return;
  }
  var translateButton = document.createElement('button');
  translateButton.textContent = 'Translate';
  translateButton.className = 'translate-button';
  translateButton.style.marginLeft = '5px';
  translateButton.style.padding = '2px 5px';
  translateButton.style.backgroundColor = '#dcf8c6';
  translateButton.style.border = '1px solid #4a4a4a';
  translateButton.style.borderRadius = '3px';
  translateButton.addEventListener('click', function () {
    console.log('Translate button clicked');
    // Use a more specific selector to target the text content
    var messageText = messageNode.querySelector('div[data-pre-plain-text] span[dir="ltr"]');
    if (messageText) {
      var translatedSpan = messageNode.querySelector('.translated-text');
      var textToTranslate = translatedSpan ? translatedSpan.dataset.originalText : messageText.textContent.trim();
      console.log('Message text found:', textToTranslate);
      translateMessage(textToTranslate, messageNode);
    } else {
      console.log('Error: No selectable text found in the message.');
    }
  });

  // Find the appropriate place to insert the button
  var messageContainer = messageNode.querySelector('div.copyable-text');
  if (messageContainer) {
    messageContainer.appendChild(translateButton);
    console.log('Translate button added successfully.');
  } else {
    console.log('Could not find appropriate container for translate button.');
  }
}

// Function to observe new messages and add the translate button
function observeMessages() {
  console.log('Starting to observe DOM changes.');
  var targetNode = document.querySelector('#main'); // Observe the main chat container
  if (!targetNode) {
    console.log('Main chat container not found. Retrying in 1 second.');
    setTimeout(observeMessages, 1000);
    return;
  }
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check for new messages and add translate buttons
            var newMessages = node.querySelectorAll('div.message-in, div.message-out');
            newMessages.forEach(addTranslateButton);
          }
        });
      }
    });
  });

  // Observe the main chat container for new message elements
  observer.observe(targetNode, {
    childList: true,
    subtree: true
  });
  console.log('Observer attached to main chat container.');

  // Process existing messages when the script loads
  processExistingMessages();
}

// Function to process existing messages and add translate buttons
function processExistingMessages() {
  console.log('Processing existing messages.');
  var messages = document.querySelectorAll('div.message-in, div.message-out');
  messages.forEach(addTranslateButton);
}

// Setup the observer after a slight delay to ensure chat is loaded
setTimeout(observeMessages, 5000);

// Listen for messages from the popup (if any)
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('Message received in content script:', request);
  if (request.action === 'getSelectedText') {
    var selectedText = window.getSelection().toString();
    console.log('Selected text:', selectedText);
    sendResponse({
      selectedText: selectedText
    });
  } else if (request.action === 'setTargetLanguage') {
    targetLanguage = request.language;
    console.log('Target language updated to:', targetLanguage);
    // Save the target language to chrome.storage
    chrome.storage.sync.set({
      targetLanguage: targetLanguage
    }, function () {
      console.log('Language saved to chrome.storage');
    });
  } else if (request.action === 'getTargetLanguage') {
    sendResponse({
      targetLanguage: targetLanguage
    });
  }
});
// Load the saved target language when the script starts
chrome.storage.sync.get(['targetLanguage'], function (result) {
  if (result.targetLanguage) {
    targetLanguage = result.targetLanguage;
    console.log('Loaded saved target language:', targetLanguage);
  }
});
/******/ })()
;
//# sourceMappingURL=content.js.map