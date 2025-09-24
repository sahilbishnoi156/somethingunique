import { NextRequest } from 'next/server';

const isDev = process.env.NODE_ENV !== 'production';

export const POST = async (request: NextRequest) => {
    try {
        // Parse incoming request safely
        let body: { url: string; options?: RequestInit };
        try {
            body = await request.json();
        } catch {
            return jsonResponse(
                { message: 'Invalid request format' },
                400
            );
        }

        const { url, options } = body;
        if (!url || typeof url !== 'string') {
            return jsonResponse(
                { message: 'Missing or invalid "url"' },
                400
            );
        }

        let response: Response;
        try {
            response = await fetch(url, options);
        } catch (err) {
            console.error('Backend connection error:', err);
            return jsonResponse(
                { message: 'Unable to reach the service. Please try again later.' },
                502
            );
        }

        // Parse response
        const contentType = response.headers.get('content-type') || '';
        let responseData: any;
        let displayMessage: string | undefined;

        try {
            if (contentType.includes('application/json')) {
                responseData = await response.json();
                displayMessage = responseData?.message || undefined;
            } else {
                const text = await response.text();
                responseData = text;

                if (contentType.includes('text/html')) {
                    const match = text.match(/<pre>(.*?)<\/pre>/s);
                    displayMessage = match ? match[1] : 'An error occurred';
                } else {
                    displayMessage = text.slice(0, 200);
                }
            }
        } catch (err) {
            console.error('Response parsing failed:', err);
            responseData = null;
            displayMessage = 'Something went wrong while processing the response.';
        }

        // ✅ DEV: return full debug info
        // ✅ PROD: return only safe fields
        const payload = isDev
            ? {
                  status: response.status,
                  ok: response.ok,
                  headers: Object.fromEntries(response.headers),
                  data: responseData,
                  message: displayMessage,
              }
            : {
                  status: response.status,
                  ok: response.ok,
                  message:
                      displayMessage ||
                      (response.ok
                          ? 'Request completed successfully.'
                          : 'Something went wrong. Please try again later.'),
              };

        return jsonResponse(payload, response.status);
    } catch (error) {
        console.error('Unexpected error in API route:', error);
        return jsonResponse(
            {
                message: isDev
                    ? `Unexpected server error: ${
                          error instanceof Error ? error.message : String(error)
                      }`
                    : 'Internal server error. Please try again later.',
            },
            500
        );
    }
};

/** Helper for consistent JSON responses */
function jsonResponse(payload: any, status: number) {
    return new Response(JSON.stringify(payload), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}
