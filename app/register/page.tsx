"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/Auth";
import { account } from "@/models/client/config";
import { useRouter } from "next/navigation";
import { ID } from "appwrite";
import Link from "next/link";
import { Particles } from "@/components/magicui/particles";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
    const { createAccount, login } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const { success, error: createError } = await createAccount(name, email, password);

        if (success) {
            const { success: loginSuccess, error: loginError } = await login(email, password);
            if (loginSuccess) {
                router.push("/");
            } else {
                setError(loginError?.message || "Login failed after registration");
                setIsLoading(false);
            }
        } else {
            setError(createError?.message || "Registration failed");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <Particles
                className="absolute inset-0 z-0"
                quantity={50}
                color="#a78bfa"
                refresh
            />
            <div className="w-full max-w-md space-y-8 z-10 bg-background/50 backdrop-blur-sm p-8 rounded-xl border shadow-xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Join the community today
                    </p>
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" required placeholder="John Doe" />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required placeholder="name@example.com" />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                    </div>

                    <Button className="w-full" disabled={isLoading}>
                        {isLoading ? "Creating account..." : "Sign up"}
                    </Button>
                </form>
                <p className="mt-4 text-sm text-center text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-primary hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}
