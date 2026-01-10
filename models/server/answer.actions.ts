"use server";

import { ID, Query } from "node-appwrite";
import { databases } from "./config";
import { db, answerCollection } from "../name";

export async function createAnswer(
    questionId: string,
    content: string,
    authorId: string
) {
    try {
        const answer = await databases.createDocument(
            db,
            answerCollection,
            ID.unique(),
            {
                questionId,
                content,
                authorId,
            }
        );
        return { success: true, answer };
    } catch (error: any) {
        console.error("Error creating answer:", error);
        return { success: false, error: error.message };
    }
}

export async function getAnswers(questionId: string) {
    try {
        const response = await databases.listDocuments(
            db,
            answerCollection,
            [
                Query.equal("questionId", questionId),
                Query.orderDesc("$createdAt"),
            ]
        );
        return { success: true, documents: response.documents };
    } catch (error: any) {
        console.error("Error getting answers:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteAnswer(answerId: string) {
    try {
        await databases.deleteDocument(
            db,
            answerCollection,
            answerId
        );
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting answer:", error);
        return { success: false, error: error.message };
    }
}
