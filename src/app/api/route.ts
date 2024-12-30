import { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
    try {
        const { url, options } = await request.json();

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                message: 'Something went wrong',
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
};
