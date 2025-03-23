import { renderHome } from '../templates/home'

export function homeRoute(clientJs: string): Response {
	const html = renderHome(clientJs)

	return new Response(html, {
		headers: {
			'Content-Type': 'text/html',
		},
	})
}
