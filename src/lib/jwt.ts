import { JwtPayload } from '@/types/auth.types';

export interface IsJwtExpiredOptions {
    /**
     * If true, tokens without an "exp" claim are considered NOT expired.
     * Default: false (tokens missing "exp" are treated as expired).
     */
    allowMissingExp?: boolean;
    /**
     * Clock skew in seconds to tolerate differences between issuer and verifier clocks.
     * Default: 0 (no skew).
     */
    clockSkewSeconds?: number;
    /**
     * Override current time (in seconds). Useful for deterministic tests.
     * Default: Math.floor(Date.now() / 1000)
     */
    nowSeconds?: number;
}

/**
 * Decodes a base64url-encoded string to a UTF-8 string.
 * Throws on invalid input.
 */
export function decodeBase64Url(base64Url: string): string {
    // Convert base64url to base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Pad to a multiple of 4
    const pad = base64.length % 4;
    const padded = base64 + (pad ? '='.repeat(4 - pad) : '');

    // Browser atob path
    try {
        if (typeof atob === 'function') {
            const binary = atob(padded);
            // Convert binary string to percent-encoded UTF-8 then decode
            const percentEncoded = Array.prototype.map
                .call(binary, (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('');
            return decodeURIComponent(percentEncoded);
        }
    } catch {
        // fall through to Buffer path (Node)
    }

    // Node.js Buffer path
    if (typeof Buffer !== 'undefined') {
        try {
            return Buffer.from(padded, 'base64').toString('utf8');
        } catch (err) {
            throw new Error('Invalid base64url payload');
        }
    }

    throw new Error('No base64 decoder available in this environment');
}

/**
 * Parse the JWT payload (second segment) and return the parsed object.
 * Returns null on any error (malformed token, invalid base64, invalid JSON).
 */
export function parseJwt(token: string): JwtPayload | null {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;

    const payloadPart = parts[1].trim();
    if (!payloadPart) return null;

    try {
        const json = decodeBase64Url(payloadPart);
        // guard: JSON.parse can throw
        const parsed = JSON.parse(json) as JwtPayload;
        return parsed;
    } catch {
        return null;
    }
}

/**
 * Returns true when the token should be considered expired.
 * - Malformed tokens or failed parsing => treated as expired (returns true).
 * - If exp is missing and allowMissingExp is false (default) => treated as expired.
 * - clockSkewSeconds allows a tolerance window (positive number).
 */
export function isJwtExpired(token: string, options?: IsJwtExpiredOptions): boolean {
    const { allowMissingExp = false, clockSkewSeconds = 0, nowSeconds } = options || {};
    const payload = parseJwt(token);

    if (!payload) {
        // malformed or unparsable token
        return true;
    }

    const expRaw = (payload as any).exp;
    if (expRaw === undefined || expRaw === null) {
        return !allowMissingExp;
    }

    const exp = Number(expRaw);
    if (!Number.isFinite(exp)) {
        // invalid exp format
        return true;
    }

    const now = typeof nowSeconds === 'number' ? Math.floor(nowSeconds) : Math.floor(Date.now() / 1000);

    // Allow a clock skew: token is considered expired only if exp < now - clockSkewSeconds
    return exp < now - Math.max(0, Math.floor(clockSkewSeconds));
}

/*
Example test cases (for quick manual testing):

// Helper to create a simple unsigned token for tests (header.payload.signature)
function makeTokenPayload(obj: any) {
    function b64UrlEncode(str: string) {
        let b64 = (typeof Buffer !== 'undefined')
            ? Buffer.from(str, 'utf8').toString('base64')
            : btoa(unescape(encodeURIComponent(str)));
        return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    const header = b64UrlEncode(JSON.stringify({ alg: "none", typ: "JWT" }));
    const payload = b64UrlEncode(JSON.stringify(obj));
    return `${header}.${payload}.`;
}

// 1) Valid future token
const future = Math.floor(Date.now() / 1000) + 60;
const tokenValid = makeTokenPayload({ sub: "1", exp: future });
console.log(isJwtExpired(tokenValid)); // false

// 2) Expired token
const past = Math.floor(Date.now() / 1000) - 60;
const tokenExpired = makeTokenPayload({ sub: "1", exp: past });
console.log(isJwtExpired(tokenExpired)); // true

// 3) Missing exp
const tokenNoExp = makeTokenPayload({ sub: "1" });
console.log(isJwtExpired(tokenNoExp)); // true
console.log(isJwtExpired(tokenNoExp, { allowMissingExp: true })); // false

// 4) Malformed token
console.log(isJwtExpired('not.a.token')); // true
*/
