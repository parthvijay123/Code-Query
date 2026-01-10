"use server";

import { ID, Query } from "node-appwrite";
import { databases, storage } from "./config";
import { db, questionCollection, questionAttachmentBucket } from "../name";

export async function createQuestion(
    title: string,
    content: string,
    authorId: string,
    tags: string[],
    attachment?: File
) {
    try {
        let attachmentId = null;

        if (attachment) {
            const response = await storage.createFile(
                questionAttachmentBucket,
                ID.unique(),
                attachment
            );
            attachmentId = response.$id;
        }

        const question = await databases.createDocument(
            db,
            questionCollection,
            ID.unique(),
            {
                title,
                content,
                authorId,
                tags,
                attachmentId,
            }
        );
        // ...


        // --- GEMINI INTEGRATION ---
        try {
            // We do this asynchronously without awaiting to not block the UI response
            (async () => {
                const { generateAIComment, getOrCreateBotUser } = await import("@/lib/gemini");
                const { createComment } = await import("@/models/server/comment.actions");

                const commentText = await generateAIComment(title, content);
                if (commentText) {
                    const botUserId = await getOrCreateBotUser();
                    if (botUserId) {
                        await createComment("question", question.$id, commentText, botUserId);
                    }
                }
            })();
        } catch (err) {
            console.error("Failed to trigger AI comment:", err);
        }
        // --------------------------

        return { success: true, question };
    } catch (error: any) {
        console.error("Error creating question:", error);
        return { success: false, error: error.message };
    }
}

export async function getQuestions(
    queries: string[] = []
) {
    try {
        const response = await databases.listDocuments(
            db,
            questionCollection,
            [
                Query.orderDesc("$createdAt"),
                ...queries
            ]
        );
        return { success: true, documents: response.documents, total: response.total };
    } catch (error: any) {
        console.error("Error getting questions:", error);
        return { success: false, error: error.message };
    }
}

export async function getQuestion(questionId: string) {
    try {
        const question = await databases.getDocument(
            db,
            questionCollection,
            questionId
        );
        return { success: true, question };
    } catch (error: any) {
        console.error("Error getting question:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteQuestion(questionId: string, authorId: string) {
    try {
        // Optional: Verify author before deleting (though RLS usually handles this)
        // const q = await getQuestion(questionId);
        // if (q.question.authorId !== authorId) throw new Error("Unauthorized");

        await databases.deleteDocument(
            db,
            questionCollection,
            questionId
        );
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting question:", error);
        return { success: false, error: error.message };
    }
}
