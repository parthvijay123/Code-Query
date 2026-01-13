"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/Auth";
import { createAnswer } from "@/models/server/answer.actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export default function AnswerForm({ questionId }: { questionId: string }) {
    const { user } = useAuthStore();
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
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
            const { success, error: apiError } = await createAnswer(
                questionId,
                content,
                user.$id
            );

            if (success) {
                setContent("");
                router.refresh();
            } else {
                setError(apiError || "Failed to submit answer");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Your Answer</h3>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your answer here..."
                    rows={6}
                    className="w-full"
                />
                <Button disabled={loading || !content}>
                    {loading ? "Posting..." : "Post Answer"}
                </Button>
            </form>
        </div>
    );
}
