import { homeRoute } from "./home";
import { aboutRoute } from "./about";
import { handleImageOptimize } from "./api";
import type { Serve } from "bun";

type RouteHandler = (clientJs: string) => Response;
interface Routes {
	[key: string]: RouteHandler;
}

// Define all available routes
const routes: Routes = {
	"/": (clientJs: string) => {
		return homeRoute(clientJs);
	},
	"/home": (clientJs: string) => {
		return homeRoute(clientJs);
	},
	"/about": (clientJs: string) => {
		return aboutRoute(clientJs);
	},
};

/**
 * Main routing configuration
 */
export function routeHandler(
	req: Request,
	server: Serve,
): Response | Promise<Response> {
	const url = new URL(req.url);
	const path = url.pathname;

	// Handle API routes
	if (path === "/api/upload/optimize" && req.method === "POST") {
		return handleImageOptimize(req, server);
	}

	// Handle static assets (client-side JS)
	if (path.startsWith("/client/")) {
		const assetPath = path.substring(8); // Remove '/client/' prefix
		const file = Bun.file(`dist/client/${assetPath}`);

		if (!file.size) {
			return new Response("Not Found", { status: 404 });
		}

		return new Response(file);
	}

	// Handle page routes
	const handler = routes[path];
	if (handler) {
		return handler("home.js"); // Using home.js as the client JS for all routes for now
	}

	// 404 for everything else
	return new Response("Not Found", { status: 404 });
}
