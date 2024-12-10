export const validateEmail = (email: string) => {
    const studentEmailRegex =
        /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)?(edu|ac)\.[a-zA-Z]{2,}$/;
    return studentEmailRegex.test(email);
};
