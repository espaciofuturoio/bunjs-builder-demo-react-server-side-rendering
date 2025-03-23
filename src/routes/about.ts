import { renderAbout } from '../templates/about'

export function aboutRoute(clientJs: string): Response {
	const html = renderAbout(clientJs)

	return new Response(html, {
		headers: {
			'Content-Type': 'text/html',
		},
	})
}
