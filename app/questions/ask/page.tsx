"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { createQuestion } from "@/models/server/question.actions";
import { useRouter } from "next/navigation";

export default function AskQuestionPage() {
    const { data: session } = useSession();
    const user = session?.user;
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        // Protect route
        // if (!user) ... logic
    }, [user]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) {
            router.push("/login");
            return;
        }

        setIsLoading(true);
        setError("");
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const tagsStr = formData.get("tags") as string;
        const attachment = formData.get("attachment") as File;

        // Parse tags
        const tags = tagsStr.split(",").map(t => t.trim()).filter(Boolean);

        try {
            const { success, error: apiError, question } = await createQuestion(
                title,
                content,
                user.id!,
                tags,
                attachment.size > 0 ? attachment : undefined
            );

            if (success) {
                router.push(`/questions/${question?.$id}`);
            } else {
                setError(apiError || "Failed to create question");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Ask a Question</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        placeholder="e.g. How to center a div?"
                        required
                    />
                    <p className="text-sm text-muted-foreground">
                        Be specific and imagine you're asking a question to another person.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                        id="content"
                        name="content"
                        placeholder="Include all the information someone would need to answer your question"
                        rows={10}
                        required
                    />
                    <p className="text-sm text-muted-foreground">
                        Markdown is supported.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                        id="tags"
                        name="tags"
                        placeholder="e.g. css, html, flexbox"
                        required
                    />
                    <p className="text-sm text-muted-foreground">
                        Add up to 5 tags to describe what your question is about. Separate with commas.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="attachment">Attachment (Optional)</Label>
                    <Input
                        id="attachment"
                        name="attachment"
                        type="file"
                        accept="image/*"
                    />
                </div>

                <Button className="w-full" disabled={isLoading}>
                    {isLoading ? "Posting..." : "Post Question"}
                </Button>
            </form>
        </div>
    );
}
