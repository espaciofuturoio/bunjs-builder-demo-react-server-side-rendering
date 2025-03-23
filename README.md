# Simple Server

A minimal Bun server with client-side hydration example.

## Features

- Single route server with Bun
- Client-side hydration example
- Built-in build process
- No WebSockets or complex routing

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
bun install
```

### Development

To start the development server with hot reloading:

```bash
bun dev
```

The server will start at `http://localhost:3002`.

### Building

To build the client:

```bash
bun build
```

### Production

To run in production mode:

```bash
bun start
```

## Project Structure

- `src/index.ts` - Main server entry point
- `src/client.ts` - Client-side code for hydration
- `src/utils/buildClient.ts` - Utility for building the client
- `build.ts` - Build script
- `public/` - Static assets and build output

## License

MIT
