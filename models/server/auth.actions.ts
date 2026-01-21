"use server";

import { prisma } from "./config";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const RegisterSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

export async function registerUser(prevState: any, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, email, password } = validatedFields.data;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                success: false,
                message: "User with this email already exists.",
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                reputation: 0,
            },
        });

        // We can't automatically sign in using 'credentials' provider via server action easily without redirecting
        // But usually we just redirect to login or handle it in the component.
        // However, we can try to facilitate auto-login logic if needed. 
        // For now, let's return success and let the client handle redirection to login or auto-login.

        return { success: true };
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, message: "Something went wrong during registration." };
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}
