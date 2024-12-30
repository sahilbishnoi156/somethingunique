import { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
    try {
        const { url, options } = await request.json();
        console.log(url, options);

        // Make the fetch request
        const response = await fetch(url, options);

        // Read the response body as JSON
        const data = await response.json();
        console.log(data);

        // Return the exact same response with the same status and headers
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
                ...Object.fromEntries(response.headers), // Optional: copy all headers from the response
            },
        });
    } catch (error) {
        console.error(error);

        // Handle error by returning a 500 response with the error message
        if (error instanceof Error) {
            return new Response(
                JSON.stringify({
                    message: error.message,
                    data: error,
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        } else {
            return new Response(
                JSON.stringify({
                    message: 'Something went wrong',
                    data: error,
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
    }
};
