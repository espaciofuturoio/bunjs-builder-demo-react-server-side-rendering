// client.ts: Hydration utility for client-side JavaScript
console.log("Client-side hydration code loaded");

// Log any errors for debugging
window.addEventListener("error", (event) => {
	console.error("Client-side error:", event.error);
});

// Check if ReactDOM loaded correctly
document.addEventListener("DOMContentLoaded", () => {
	console.log("DOM Content Loaded, preparing for hydration");
	console.log("React available:", typeof React !== "undefined");
	console.log("ReactDOM available:", typeof ReactDOM !== "undefined");

	// Check for app-root
	const appRoot = document.getElementById("app-root");
	console.log("Found app-root element:", !!appRoot);

	// Common hydration for all pages
	const hydrationMsg = document.getElementById("hydration-message");
	if (hydrationMsg) {
		hydrationMsg.textContent = "Client-side hydration successful!";
		hydrationMsg.classList.add("hydrated");
	}

	// Specific hydration for home page
	const button = document.getElementById("hydration-button");
	if (button) {
		button.addEventListener("click", () => {
			if (hydrationMsg) {
				hydrationMsg.textContent = "Button clicked! Hydration working!";
			}
		});

		// Show that the page is hydrated
		button.textContent = "Click me (Hydrated)";
		button.classList.add("hydrated");
	}

	// Add navigation with client-side enhancements
	const navLinks = document.querySelectorAll("a");
	for (const link of navLinks) {
		link.addEventListener("click", (e) => {
			console.log(`Navigating to: ${link.getAttribute("href")}`);
			// We're not preventing default navigation, just enhancing
		});
	}
});
