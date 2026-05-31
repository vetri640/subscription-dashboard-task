import { z } from 'zod';

export const validateRegistration = (req, res, next) => {
    const schema = z.object({
        name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
        email: z.string().email({ message: 'Invalid email address' }),
        password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    });

    const result = schema.safeParse(req.body);
    
    if (!result.success) {
        res.status(400);
        return next(new Error(result.error.issues[0].message));
    }
    next();
};

export const validateLogin = (req, res, next) => {
    const schema = z.object({
        email: z.string().email({ message: 'Invalid email address' }),
        password: z.string().min(1, { message: 'Password is required' }),
    });

    const result = schema.safeParse(req.body);
    
    if (!result.success) {
        res.status(400);
        return next(new Error(result.error.issues[0].message));
    }
    next();
};
