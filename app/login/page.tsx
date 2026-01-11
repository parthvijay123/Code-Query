"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/Auth";
import { account } from "@/models/client/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Particles } from "@/components/magicui/particles";

export default function LoginPage() {
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const { success, error: loginError } = await login(email, password);
        if (success) {
            router.push("/");
        } else {
            setError(loginError?.message || "Login failed");
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
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to your account to continue
                    </p>
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-2 text-sm font-medium">Email</label>
                        <Input type="email" name="email" placeholder="name@example.com" required />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">Password</label>
                        <Input type="password" name="password" required />
                    </div>
                    <Button className="w-full" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Log In"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
