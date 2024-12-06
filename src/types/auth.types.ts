export type JwtPayload = {
    id: string;
    user: {
        email?: string;
        username?: string;
        college_id?: string;
        college_name?: string;
        id?: string;
    };
    iat: number;
    exp: number;
};
