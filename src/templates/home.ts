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
    /* DaisyUI-like classes for our component */
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
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }
    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }
    .btn-outline {
      background-color: transparent;
      border-color: currentColor;
      color: #3b82f6;
    }
    .btn-active {
      background-color: #2563eb;
      color: white;
    }
    .btn-group {
      display: inline-flex;
    }
    .btn-group .btn {
      border-radius: 0;
    }
    .btn-group .btn:first-child {
      border-top-left-radius: 0.375rem;
      border-bottom-left-radius: 0.375rem;
    }
    .btn-group .btn:last-child {
      border-top-right-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }
    .card {
      background-color: white;
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }
    .card-body {
      padding: 1.25rem;
    }
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      line-height: 1;
      background-color: #e5e7eb;
    }
    .badge-info {
      background-color: #3b82f6;
      color: white;
    }
    .file-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
    }
    .label {
      display: flex;
      justify-content: space-between;
    }
    .label-text {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    .label-text-alt {
      font-size: 0.75rem;
      color: #6b7280;
    }
    .form-control {
      margin-bottom: 1rem;
    }
    .alert {
      padding: 1rem;
      border-radius: 0.375rem;
      margin-bottom: 1rem;
    }
    .alert-error {
      background-color: #fee2e2;
      color: #b91c1c;
    }
    .toast {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 50;
    }
    .alert-info {
      background-color: #e0f2fe;
      color: #1e40af;
      padding: 0.75rem 1rem;
      border-radius: 0.375rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .text-success {
      color: #16a34a;
    }
    .text-primary {
      color: #3b82f6;
    }
    .loading {
      display: inline-block;
      width: 2rem;
      height: 2rem;
      border: 4px solid #e5e7eb;
      border-radius: 50%;
      border-top-color: #3b82f6;
      animation: spin 1s linear infinite;
    }
    .loading-lg {
      width: 3rem;
      height: 3rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .5; }
    }
    .flex {
      display: flex;
    }
    .flex-col {
      flex-direction: column;
    }
    .items-center {
      align-items: center;
    }
    .justify-center {
      justify-content: center;
    }
    .justify-between {
      justify-content: space-between;
    }
    .w-full {
      width: 100%;
    }
    .max-w-xs {
      max-width: 20rem;
    }
    .max-w-md {
      max-width: 28rem;
    }
    .max-w-2xl {
      max-width: 42rem;
    }
    .max-w-4xl {
      max-width: 56rem;
    }
    .mx-auto {
      margin-left: auto;
      margin-right: auto;
    }
    .my-4 {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
    .mt-1 {
      margin-top: 0.25rem;
    }
    .mt-2 {
      margin-top: 0.5rem;
    }
    .mt-4 {
      margin-top: 1rem;
    }
    .mb-1 {
      margin-bottom: 0.25rem;
    }
    .mb-2 {
      margin-bottom: 0.5rem;
    }
    .mb-3 {
      margin-bottom: 0.75rem;
    }
    .mb-4 {
      margin-bottom: 1rem;
    }
    .ml-2 {
      margin-left: 0.5rem;
    }
    .p-2 {
      padding: 0.5rem;
    }
    .p-4 {
      padding: 1rem;
    }
    .rounded {
      border-radius: 0.25rem;
    }
    .rounded-md {
      border-radius: 0.375rem;
    }
    .rounded-lg {
      border-radius: 0.5rem;
    }
    .rounded-full {
      border-radius: 9999px;
    }
    .bg-base-100 {
      background-color: white;
    }
    .bg-base-200 {
      background-color: #f3f4f6;
    }
    .bg-primary {
      background-color: #3b82f6;
    }
    .bg-white {
      background-color: white;
    }
    .bg-black\/50 {
      background-color: rgba(0, 0, 0, 0.5);
    }
    .shadow-xl {
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    .shadow-lg {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    .text-center {
      text-align: center;
    }
    .text-right {
      text-align: right;
    }
    .text-white {
      color: white;
    }
    .text-xs {
      font-size: 0.75rem;
    }
    .text-sm {
      font-size: 0.875rem;
    }
    .text-lg {
      font-size: 1.125rem;
    }
    .text-xl {
      font-size: 1.25rem;
    }
    .font-medium {
      font-weight: 500;
    }
    .font-semibold {
      font-weight: 600;
    }
    .font-bold {
      font-weight: 700;
    }
    .relative {
      position: relative;
    }
    .absolute {
      position: absolute;
    }
    .inset-0 {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
    .top-0 {
      top: 0;
    }
    .top-2 {
      top: 0.5rem;
    }
    .top-1\/2 {
      top: 50%;
    }
    .left-0 {
      left: 0;
    }
    .left-1\/2 {
      left: 50%;
    }
    .left-2 {
      left: 0.5rem;
    }
    .right-2 {
      right: 0.5rem;
    }
    .bottom-0 {
      bottom: 0;
    }
    .z-10 {
      z-index: 10;
    }
    .z-20 {
      z-index: 20;
    }
    .overflow-hidden {
      overflow: hidden;
    }
    .overflow-auto {
      overflow: auto;
    }
    .object-cover {
      object-fit: cover;
    }
    .object-contain {
      object-fit: contain;
    }
    .h-full {
      height: 100%;
    }
    .max-h-64 {
      max-height: 16rem;
    }
    .h-2.5 {
      height: 0.625rem;
    }
    .h-4 {
      height: 1rem;
    }
    .h-8 {
      height: 2rem;
    }
    .w-0.5 {
      width: 0.125rem;
    }
    .w-4 {
      width: 1rem;
    }
    .w-8 {
      width: 2rem;
    }
    .gap-1 {
      gap: 0.25rem;
    }
    .gap-2 {
      gap: 0.5rem;
    }
    .gap-4 {
      gap: 1rem;
    }
    .select-none {
      user-select: none;
    }
    .cursor-ew-resize {
      cursor: ew-resize;
    }
    .-translate-x-1\/2 {
      transform: translateX(-50%);
    }
    .-translate-y-1\/2 {
      transform: translateY(-50%);
    }
    .range {
      height: 1.25rem;
      width: 100%;
      cursor: pointer;
      appearance: none;
      background-color: transparent;
    }
    .range::-webkit-slider-runnable-track {
      height: 0.5rem;
      background-color: #e5e7eb;
      border-radius: 9999px;
    }
    .range::-webkit-slider-thumb {
      appearance: none;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 9999px;
      background-color: #3b82f6;
      margin-top: -0.375rem;
    }
    .range-primary::-webkit-slider-thumb {
      background-color: #3b82f6;
    }
    .flex-1 {
      flex: 1 1 0%;
    }
    code {
      font-family: monospace;
    }
    .lg\\:flex-row {
      flex-direction: row;
    }
    @media (min-width: 1024px) {
      .lg\\:flex-row {
        flex-direction: row;
      }
    }
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
