"use server";

import { prisma } from "./config";

export async function createVote(
    type: "question" | "answer",
    typeId: string,
    voteStatus: "up" | "down",
    authorId: string
) {
    try {
        // Check if user has already voted
        const existingVote = await prisma.vote.findFirst({
            where: {
                type,
                typeId,
                votedById: authorId
            }
        });

        if (existingVote) {
            // If same vote, remove it (toggle)
            if (existingVote.voteStatus === voteStatus) {
                await prisma.vote.delete({
                    where: { id: existingVote.id }
                });
                return { success: true, message: "Vote removed" };
            }

            // If different vote, update it
            await prisma.vote.update({
                where: { id: existingVote.id },
                data: { voteStatus }
            });
            return { success: true, message: "Vote updated" };
        }

        // Create new vote
        await prisma.vote.create({
            data: {
                type,
                typeId,
                voteStatus,
                votedById: authorId
            }
        });

        return { success: true, message: "Vote created" };
    } catch (error: any) {
        console.error("Error creating vote:", error);
        return { success: false, error: error.message };
    }
}

export async function getVotes(type: "question" | "answer", typeId: string) {
    try {
        const votes = await prisma.vote.findMany({
            where: {
                type,
                typeId
            }
        });

        const upvotes = votes.filter(v => v.voteStatus === "up").length;
        const downvotes = votes.filter(v => v.voteStatus === "down").length;

        const documents = votes.map(v => ({
            ...v,
            $id: v.id,
            $createdAt: v.createdAt.toISOString(),
            $updatedAt: v.updatedAt.toISOString(),
            $collectionId: "votes",
            $databaseId: "main-stackflow"
        }));

        return { success: true, upvotes, downvotes, total: upvotes - downvotes, documents };
    } catch (error: any) {
        console.error("Error getting votes:", error);
        return { success: false, error: error.message };
    }
}

