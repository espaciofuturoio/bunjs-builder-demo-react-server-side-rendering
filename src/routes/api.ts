/**
 * API route handlers for the simple server
 */

import { Serve } from 'bun'
import {
	fileToBuffer,
	optimizeImage,
	type ImageFormat,
} from '../utils/image/imageCompressionUtil'

/**
 * Handles image optimization requests
 */
export async function handleImageOptimize(
	req: Request,
	server: Serve,
): Promise<Response> {
	// Only accept POST requests
	if (req.method !== 'POST') {
		return new Response(JSON.stringify({ error: 'Method not allowed' }), {
			status: 405,
			headers: { 'Content-Type': 'application/json' },
		})
	}

	try {
		// Parse the multipart form data
		const formData = await req.formData()
		const imageFile = formData.get('image') as File | null
		const formatParam = formData.get('format') as string | null
		const qualityParam = formData.get('quality') as string | null

		// Validate required fields
		if (!imageFile) {
			return new Response(JSON.stringify({ error: 'No image file provided' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		// Parse and validate parameters
		const format = (formatParam || 'webp') as ImageFormat
		const quality = qualityParam ? Number.parseInt(qualityParam, 10) : 80

		// Validate format
		if (!['jpeg', 'png', 'webp', 'avif'].includes(format)) {
			return new Response(JSON.stringify({ error: 'Invalid format' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		// Validate quality
		if (Number.isNaN(quality) || quality < 0 || quality > 100) {
			return new Response(
				JSON.stringify({ error: 'Quality must be between 0 and 100' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				},
			)
		}

		// Convert file to buffer
		const imageBuffer = await fileToBuffer(imageFile)

		// Optimize the image
		const optimizedImage = await optimizeImage(imageBuffer, {
			format,
			quality,
		})

		// Create a unique filename
		const timestamp = Date.now()
		const randomId = Math.floor(Math.random() * 10000)
		const filename = `optimized-${timestamp}-${randomId}.${format}`

		// In a real app, we would store this in a cloud storage service
		// For this demo, we'll save it in memory and create a URL
		const blob = new Blob([optimizedImage.data], { type: `image/${format}` })
		const url = URL.createObjectURL(blob)

		// Return the optimization result
		return new Response(
			JSON.stringify({
				url,
				size: optimizedImage.info.size,
				width: optimizedImage.info.width,
				height: optimizedImage.info.height,
				format,
				filename,
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			},
		)
	} catch (error) {
		console.error('Image optimization error:', error)
		return new Response(
			JSON.stringify({
				error: 'Failed to optimize image',
				message: error instanceof Error ? error.message : 'Unknown error',
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			},
		)
	}
}
