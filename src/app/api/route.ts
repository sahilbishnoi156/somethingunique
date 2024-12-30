import { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
    try {
        const { url, options } = await request.json();
        console.log(url, options);
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        console.log(data);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
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
