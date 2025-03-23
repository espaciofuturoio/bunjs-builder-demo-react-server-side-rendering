/**
 * HTML template for the about page
 */
export function renderAbout(clientJs: string): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About - Simple Server</title>
  <script src="/client/${clientJs}" defer></script>
  <style>
    body {
      font-family: system-ui, sans-serif;
      max-width: 800px;
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
  </style>
</head>
<body>
  <div class="container">
    <div class="nav">
      <a href="/">Home</a>
    </div>
    <h1>About Simple Server</h1>
    <p>This is a simple demonstration of a Bun server with client-side hydration.</p>
    <p>The server has a simple routing system and serves static assets.</p>
    <div id="hydration-message">Waiting for hydration...</div>
  </div>
</body>
</html>`
}
