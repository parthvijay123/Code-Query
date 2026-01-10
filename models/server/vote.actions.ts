"use server";

import { ID, Query } from "node-appwrite";
import { databases } from "./config";
import { db, voteCollection } from "../name";

export async function createVote(
    type: "question" | "answer",
    typeId: string,
    voteStatus: "up" | "down",
    authorId: string
) {
    try {
        // Check if user has already voted
        const response = await databases.listDocuments(
            db,
            voteCollection,
            [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("votedById", authorId),
            ]
        );

        if (response.documents.length > 0) {
            const vote = response.documents[0];
            // If same vote, remove it (toggle)
            if (vote.voteStatus === voteStatus) {
                await databases.deleteDocument(db, voteCollection, vote.$id);
                return { success: true, message: "Vote removed" };
            }
            // If different vote, update it
            await databases.updateDocument(db, voteCollection, vote.$id, {
                voteStatus,
            });
            return { success: true, message: "Vote updated" };
        }

        // Create new vote
        await databases.createDocument(
            db,
            voteCollection,
            ID.unique(),
            {
                type,
                typeId,
                voteStatus,
                votedById: authorId,
            }
        );
        return { success: true, message: "Vote created" };
    } catch (error: any) {
        console.error("Error creating vote:", error);
        return { success: false, error: error.message };
    }
}

export async function getVotes(type: "question" | "answer", typeId: string) {
    try {
        const response = await databases.listDocuments(
            db,
            voteCollection,
            [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
            ]
        );

        const upvotes = response.documents.filter(v => v.voteStatus === "up").length;
        const downvotes = response.documents.filter(v => v.voteStatus === "down").length;

        return { success: true, upvotes, downvotes, total: upvotes - downvotes, documents: response.documents };
    } catch (error: any) {
        console.error("Error getting votes:", error);
        return { success: false, error: error.message };
    }
}
