// Simple client-side hydration script

function hydrate() {
	console.log('🌊 Hydration complete!')

	// Common hydration for all pages
	const hydrationMsg = document.getElementById('hydration-message')
	if (hydrationMsg) {
		hydrationMsg.textContent = 'Client-side hydration successful!'
		hydrationMsg.classList.add('hydrated')
	}

	// Specific hydration for home page
	const button = document.getElementById('hydration-button')
	if (button) {
		button.addEventListener('click', () => {
			if (hydrationMsg) {
				hydrationMsg.textContent = 'Button clicked! Hydration working!'
			}
		})

		// Show that the page is hydrated
		button.textContent = 'Click me (Hydrated)'
		button.classList.add('hydrated')
	}

	// Add navigation with client-side enhancements
	const navLinks = document.querySelectorAll('a')
	for (const link of navLinks) {
		link.addEventListener('click', (e) => {
			console.log(`Navigating to: ${link.getAttribute('href')}`)
			// We're not preventing default navigation, just enhancing
		})
	}
}

// Run hydration when the DOM is ready
document.addEventListener('DOMContentLoaded', hydrate)
