"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { createComment } from "@/models/server/comment.actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Or Input
import { useRouter } from "next/navigation";

export default function CommentForm({
    type,
    typeId
}: {
    type: "question" | "answer",
    typeId: string
}) {
    const { data: session } = useSession();
    const user = session?.user;
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content) return;
        if (!user) {
            router.push("/login");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const { success, error: apiError } = await createComment(
                type,
                typeId,
                content,
                user.id!
            );

            if (success) {
                setContent("");
                setIsOpen(false);
                router.refresh();
            } else {
                setError(apiError || "Failed to submit comment");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button variant="link" size="sm" onClick={() => setIsOpen(true)} className="px-0 text-muted-foreground">
                Add a comment
            </Button>
        );
    }

    return (
        <div className="mt-2 pl-4 border-l-2">
            {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-2">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your comment..."
                    rows={2}
                    className="min-h-[60px]"
                />
                <div className="flex gap-2">
                    <Button size="sm" disabled={loading || !content}>
                        {loading ? "Posting..." : "Add Comment"}
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
