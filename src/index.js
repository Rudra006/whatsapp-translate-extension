import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

// const App = () => {
//   return (
//     <div>
//       <h1>WhatsApp Translator</h1>
//       <p>This is a basic React popup.</p>
//     </div>
//   );
// };

const root = document.getElementById('root');
if (root) {
  ReactDOM.render(<App />, root);
} else {
  console.error('Root element not found');
}