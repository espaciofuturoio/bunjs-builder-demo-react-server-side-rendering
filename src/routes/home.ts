import * as React from "react";
import {
	renderServerComponent,
	createHtmlWithReact,
} from "../utils/serverComponents";
import { Home } from "../components/Home";

export function homeRoute(clientJs: string): Response {
	// Server-side render the Home component
	const content = renderServerComponent(Home, { onClientSide: false });

	// Create the full HTML with the server-rendered content
	const html = createHtmlWithReact(content, clientJs, "Image Optimizer");

	return new Response(html, {
		headers: {
			"Content-Type": "text/html",
		},
	});
}
