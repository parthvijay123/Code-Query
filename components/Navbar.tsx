"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { data: session } = useSession();
    const user = session?.user;
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        router.push("/login");
    };

    return (
        <nav className="border-b bg-background sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center w-[200px]">
                    <Link href="/" className="text-2xl font-bold">
                        Code <span className="text-primary">Query</span>
                    </Link>
                </div>

                <div className="flex-1 max-w-md mx-4 relative hidden md:block">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const query = (form.elements.namedItem("search") as HTMLInputElement).value;
                        if (query) {
                            window.location.href = `/questions?search=${encodeURIComponent(query)}`;
                        }
                    }}>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input name="search" placeholder="Search questions..." className="pl-10" />
                    </form>
                </div>

                <div className="flex items-center justify-end w-[200px] gap-4">
                    {/* Theme Toggle placeholder if needed, typically handled by separate component or integrated */}

                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium hidden md:block">{user.name || "User"}</span>
                            <Avatar>
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback>{user.name ? user.name[0] : "U"}</AvatarFallback>
                            </Avatar>
                            <Button variant="ghost" size="sm" onClick={handleLogout}>Log out</Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost">Log in</Button>
                            </Link>
                            <Link href="/register">
                                <Button>Sign up</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
