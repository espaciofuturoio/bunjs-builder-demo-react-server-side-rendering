import * as React from 'react';
import { renderServerComponent, createHtmlWithReact } from '../utils/serverComponents';

// Simple About component for server-side rendering
const About: React.FC = () => {
  return (
    <div className="container">
      <div className="nav">
        <a href="/">Home</a> | <a href="/about">About</a>
      </div>
      <h1>About Image Optimizer</h1>
      <p>
        This is a simple image optimization tool built with Bun.js and React.
        It allows you to compress and convert images to different formats for better web performance.
      </p>
      <p>
        The application demonstrates server-side React rendering with client-side hydration,
        all powered by Bun.js without any additional frameworks.
      </p>
    </div>
  );
};

export function aboutRoute(clientJs: string): Response {
  // Server-side render the About component
  const content = renderServerComponent(About, {});

  // Create the full HTML with the server-rendered content
  const html = createHtmlWithReact(content, clientJs, 'About - Image Optimizer');

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
} 