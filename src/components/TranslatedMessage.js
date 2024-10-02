import React from 'react';

const TranslatedMessage = ({ originalMessage, translatedMessage }) => {
  return (
    <div className="translated-message">
      <h3>Original Message:</h3>
      <p>{originalMessage}</p>
      <h3>Translated Message:</h3>
      <p>{translatedMessage}</p>
    </div>
  );
};

export default TranslatedMessage;