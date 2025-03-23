import fs from "node:fs";
import path from "node:path";

export async function buildClient() {
	try {
		const output = await Bun.build({
			entrypoints: ["./src/client.ts"],
			outdir: "./public",
			minify: process.env.NODE_ENV === "production",
			sourcemap: process.env.NODE_ENV === "development" ? "inline" : "none",
		});

		if (!output.success) {
			console.error("Build failed:", output.logs);
			return false;
		}

		// Create a manifest file
		const manifest = {
			clientJs: "client.js",
			buildTime: new Date().toISOString(),
		};

		fs.writeFileSync(
			path.join(process.cwd(), "public", "manifest.json"),
			JSON.stringify(manifest, null, 2),
		);

		console.log("✅ Client build completed successfully!");
		return true;
	} catch (error) {
		console.error("Error building client:", error);
		return false;
	}
}

// Run the build function when this file is executed directly
if (import.meta.path === Bun.main) {
	buildClient()
		.then((success) => {
			if (!success) {
				process.exit(1);
			}
		})
		.catch((err) => {
			console.error("Build error:", err);
			process.exit(1);
		});
}
