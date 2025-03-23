import * as React from 'react';
import { createRoot } from 'react-dom/client';

console.log('About client script loaded');

// Add error logging
window.addEventListener('error', (event) => {
  console.error('About client error:', event.error);
});

/**
 * Simple client-side entry point for the About page
 * Just adds hydration without interactive components
 */
const AboutClient: React.FC = () => {
  const [isHydrated, setIsHydrated] = React.useState(false);

  // This effect only runs on the client
  React.useEffect(() => {
    console.log('AboutClient component mounted');
    setIsHydrated(true);
  }, []);

  return (
    <p id="hydration-message" className={isHydrated ? 'hydrated' : ''}>
      {isHydrated ? 'React has hydrated! 🚀' : 'Waiting for hydration...'}
    </p>
  );
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('About page DOM content loaded');

  // Get the container
  const container = document.querySelector('.container');
  if (container) {
    console.log('Found container for hydration');
    try {
      // Create a div for the hydration message
      const hydrationDiv = document.createElement('div');
      container.appendChild(hydrationDiv);

      // Create a React root in this div
      const root = createRoot(hydrationDiv);
      root.render(<AboutClient />);
      console.log('AboutClient rendered');
    } catch (error) {
      console.error('Error during About page hydration:', error);
    }
  } else {
    console.error('Container element not found for About page hydration');
  }
}); 