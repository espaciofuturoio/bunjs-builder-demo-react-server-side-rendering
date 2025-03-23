/**
 * HTML template for the home page with React hydration
 */
export function renderHome(clientJs: string): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple Server</title>
  <script src="/client/${clientJs}" defer></script>
  <style>
    @import "tailwindcss";
    @plugin "daisyui";
  </style>
</head>
<body>
  <div class="container">
    <div class="nav">
      <a href="/about">About</a>
    </div>
    <h1>Simple Image Uploader</h1>
    <p>This is a demonstration of React hydration with an image uploader component x.</p>
    
    <!-- Root element for React -->
    <div id="app-root">
      <!-- Server-rendered placeholder before hydration -->
      <div class="flex flex-col items-center p-4">
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Upload Image</span>
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/avif,image/heic,image/heif"
            class="file-input file-input-bordered file-input-primary w-full"
          />
          <label class="label">
            <span class="label-text-alt">Supported: JPEG, PNG, GIF, WebP, AVIF, HEIC</span>
          </label>
        </div>
        <p id="hydration-message">Waiting for hydration...</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
