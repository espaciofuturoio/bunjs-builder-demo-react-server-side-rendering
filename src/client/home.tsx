import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { SimpleImageUploader } from '../components/simple_image_uploader';

/**
 * Client-side entry point for the home page
 */
function App() {
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      <SimpleImageUploader onClientSide={true} />
      <p id="hydration-message" className={isHydrated ? 'hydrated' : ''}>
        {isHydrated ? 'React has hydrated! 🚀' : 'Waiting for hydration...'}
      </p>
    </div>
  );
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const appRoot = document.getElementById('app-root');
  if (appRoot) {
    const root = createRoot(appRoot);
    root.render(<App />);
  }
}); 