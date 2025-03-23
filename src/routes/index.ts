import { homeRoute } from "./home";
import { aboutRoute } from "./about";
import { handleImageOptimize } from "./api";
import type { Serve } from "bun";

type RouteHandler = (clientJs: string) => Response;
interface Routes {
	[key: string]: {
		handler: RouteHandler;
		clientJs: string;
	};
}

// Define all available routes with their corresponding client JS files
const routes: Routes = {
	"/": {
		handler: homeRoute,
		clientJs: "home.js",
	},
	"/home": {
		handler: homeRoute,
		clientJs: "home.js",
	},
	"/about": {
		handler: aboutRoute,
		clientJs: "about.js",
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

		// Set proper content type for JavaScript files
		const headers: Record<string, string> = {};
		if (assetPath.endsWith(".js")) {
			headers["Content-Type"] = "application/javascript";
		}

		return new Response(file, { headers });
	}

	// Handle page routes
	const route = routes[path];
	if (route) {
		return route.handler(route.clientJs);
	}

	// 404 for everything else
	return new Response("Not Found", { status: 404 });
}
