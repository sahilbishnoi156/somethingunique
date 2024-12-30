export type JwtPayload = {
    id: string;
    user: {
        email?: string;
        username?: string;
        college_id?: string;
        college_name?: string;
        id?: string;
        role?: 'super_admin' | 'student' | 'college_admin';
    };
    iat: number;
    exp: number;
};
