import * as React from 'react';
import { SimpleImageUploader } from './simple_image_uploader';

interface HomeProps {
  onClientSide?: boolean;
}

/**
 * Home component that can be rendered on both server and client
 */
export function Home({ onClientSide = false }: HomeProps) {
  const [isHydrated, setIsHydrated] = React.useState(false);

  // This effect only runs on the client
  React.useEffect(() => {
    console.log('Home component mounted, setting hydrated state to true');
    setIsHydrated(true);
  }, []);

  console.log('Home component rendering, onClientSide:', onClientSide, 'isHydrated:', isHydrated);

  return (
    <div className="container">
      <div className="nav">
        <a href="/">Home</a> | <a href="/about">About</a>
      </div>

      <h1>Image Optimizer</h1>
      <p>
        Upload an image to optimize it for the web. The optimized image will be smaller
        and faster to load while maintaining good quality.
      </p>

      {/* For debugging to ensure component is rendering */}
      <div id="debug-info" style={{ display: 'none' }}>
        onClientSide: {String(onClientSide)}, isHydrated: {String(isHydrated)}
      </div>

      {/* We render different versions based on server/client */}
      {(onClientSide || isHydrated) ? (
        <SimpleImageUploader onClientSide={true} />
      ) : (
        <div className="server-placeholder">
          <p>Loading image uploader...</p>
        </div>
      )}

      <p id="hydration-message" className={isHydrated ? 'hydrated' : ''}>
        {isHydrated ? 'React has hydrated! 🚀' : 'Waiting for hydration...'}
      </p>
    </div>
  );
} 