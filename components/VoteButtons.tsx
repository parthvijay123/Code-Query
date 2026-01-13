"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/Auth";
import { createVote, getVotes } from "@/models/server/vote.actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VoteButtons({
    type,
    typeId,
    initialUpvotes = 0,
    initialDownvotes = 0
}: {
    type: "question" | "answer",
    typeId: string,
    initialUpvotes?: number,
    initialDownvotes?: number
}) {
    const { user } = useAuthStore();
    const router = useRouter();
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [downvotes, setDownvotes] = useState(initialDownvotes);
    const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Ideally fetch initial counts properly if not passed, and also user's vote
        const fetchVoteStatus = async () => {
            if (user) {
                const { documents } = await getVotes(type, typeId);
                // Find if user voted
                // This is inefficient if many votes, but for MVP it works. 
                // Better: getVotes accepts userId to filter? Or use a separate "getUserVote" action.
                const myVote = documents?.find((v: any) => v.votedById === user.$id);
                if (myVote) {
                    setUserVote(myVote.voteStatus);
                }

                const ups = documents?.filter((v: any) => v.voteStatus === "up").length || 0;
                const downs = documents?.filter((v: any) => v.voteStatus === "down").length || 0;
                setUpvotes(ups);
                setDownvotes(downs);
            } else {
                // Just get counts
                const { upvotes: ups, downvotes: downs } = await getVotes(type, typeId);
                if (ups !== undefined) setUpvotes(ups);
                if (downs !== undefined) setDownvotes(downs);
            }
        };

        fetchVoteStatus();
    }, [type, typeId, user]);

    const handleVote = async (status: "up" | "down") => {
        if (!user) {
            router.push("/login");
            return;
        }
        setLoading(true);

        try {
            const { success, error } = await createVote(type, typeId, status, user.$id);
            if (success) {
                // Optimistic update or refetch
                // For simplicity, refetch or just toggle local state logic (complex).
                // Let's refetch to be sure.
                const { documents } = await getVotes(type, typeId);
                const myVote = documents?.find((v: any) => v.votedById === user.$id);
                setUserVote(myVote ? myVote.voteStatus : null);
                setUpvotes(documents?.filter((v: any) => v.voteStatus === "up").length || 0);
                setDownvotes(documents?.filter((v: any) => v.voteStatus === "down").length || 0);
                router.refresh();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-1 mr-4">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVote("up")}
                disabled={loading}
                className={cn("h-8 w-8", userVote === "up" && "text-orange-500")}
            >
                <ArrowBigUp className={cn("h-6 w-6", userVote === "up" && "fill-current")} />
            </Button>
            <span className="font-semibold text-lg">{upvotes - downvotes}</span>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVote("down")}
                disabled={loading}
                className={cn("h-8 w-8", userVote === "down" && "text-orange-500")}
            >
                <ArrowBigDown className={cn("h-6 w-6", userVote === "down" && "fill-current")} />
            </Button>
        </div>
    );
}
