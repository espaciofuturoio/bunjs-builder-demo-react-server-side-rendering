import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Home } from '../components/Home';

/**
 * Client-side entry point for the home page
 */
console.log('Client home.js bundle loaded');

// Add error logging
window.addEventListener('error', (event) => {
  console.error('Client-side error:', event.error);
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, looking for app-root');
  const appRoot = document.getElementById('app-root');
  if (appRoot) {
    console.log('Found app-root, creating React root for hydration');
    try {
      const root = createRoot(appRoot);
      root.render(<Home onClientSide={true} />);
      console.log('React root render called');
    } catch (error) {
      console.error('Error during React hydration:', error);
    }
  } else {
    console.error('Could not find app-root element!');
  }
}); 