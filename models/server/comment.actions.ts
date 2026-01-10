"use server";

import { ID, Query } from "node-appwrite";
import { databases } from "./config";
import { db, commentCollection } from "../name";

export async function createComment(
    type: "question" | "answer",
    typeId: string,
    content: string,
    authorId: string
) {
    try {
        const comment = await databases.createDocument(
            db,
            commentCollection,
            ID.unique(),
            {
                type,
                typeId,
                content,
                authorId,
            }
        );
        return { success: true, comment };
    } catch (error: any) {
        console.error("Error creating comment:", error);
        return { success: false, error: error.message };
    }
}

export async function getComments(type: "question" | "answer", typeId: string) {
    try {
        const response = await databases.listDocuments(
            db,
            commentCollection,
            [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.orderDesc("$createdAt"),
            ]
        );
        return { success: true, documents: response.documents };
    } catch (error: any) {
        console.error("Error getting comments:", error);
        return { success: false, error: error.message };
    }
}
