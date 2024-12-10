import { JwtPayload } from '@/types/auth.types';

export function parseJwt(token: string): JwtPayload {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split('')
            .map(function (c) {
                return (
                    '%' +
                    ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                );
            })
            .join('')
    );

    return JSON.parse(jsonPayload);
}

export const isJwtExpired = (token: string) => {
    const payload = parseJwt(token);
    if (payload?.exp) {
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        return payload.exp < currentTime; // Returns true if expired
    }
    return false; // TODO: Return true if no expiration field
};
