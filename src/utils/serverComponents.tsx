import * as React from 'react';
import { renderToString } from 'react-dom/server';

/**
 * Renders a React component to HTML on the server
 * @param Component The React component to render
 * @param props Props to pass to the component
 * @returns HTML string of the rendered component
 */
export function renderServerComponent<P>(
  Component: React.ComponentType<P>,
  props: P
): string {
  try {
    return renderToString(React.createElement(Component, props));
  } catch (error) {
    console.error('Error rendering server component:', error);
    return `<div>Error rendering component</div>`;
  }
}

/**
 * Creates a full HTML page with server-rendered React and client hydration
 * @param content The server-rendered HTML content
 * @param clientJs Path to the client JS bundle for hydration
 * @param title Page title
 * @returns Complete HTML page
 */
export function createHtmlWithReact(
  content: string,
  clientJs: string,
  title: string = 'React App'
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="/client/${clientJs}" defer></script>
  <style>
    body {
      font-family: system-ui, sans-serif;
      max-width: 1024px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.5;
    }
    .container {
      border: 1px solid #ddd;
      padding: 2rem;
      border-radius: 0.5rem;
    }
    .hydrated {
      color: #16a34a;
      font-weight: bold;
    }
    a {
      color: #3b82f6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .nav {
      margin-bottom: 2rem;
    }
    /* Component styles */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      background-color: #e5e7eb;
      border: 1px solid transparent;
    }
    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }
    /* Server-side image uploader placeholder styles */
    .image-uploader.server-version {
      border: 2px dashed #ddd;
      padding: 2rem;
      border-radius: 0.5rem;
      text-align: center;
    }
    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .server-placeholder {
      border: 2px dashed #ddd;
      padding: 2rem; 
      border-radius: 0.5rem;
      text-align: center;
    }
  </style>
</head>
<body>
  <div id="app-root">${content}</div>
  <script>
    console.log('Initial page load script running');
    window.addEventListener('DOMContentLoaded', () => {
      console.log('DOMContentLoaded in inline script');
    });
  </script>
</body>
</html>`;
} 