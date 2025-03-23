/**
 * Simple server with React hydration
 */
import { serve } from "bun";
import { routeHandler } from "./routes";

const PORT = process.env.PORT || 3003;

console.log(`Starting server on port ${PORT}...`);

serve({
	port: Number(PORT),
	fetch: (req, server) => routeHandler(req, server),
});

console.log(`Server running at http://localhost:${PORT}`);
