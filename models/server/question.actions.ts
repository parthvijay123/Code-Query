"use server";

import { prisma } from "./config";
import { revalidatePath } from "next/cache";

export async function createQuestion(
    title: string,
    content: string,
    authorId: string,
    tags: string[],
    attachment?: File
) {
    try {
        let attachmentId = null;

        // STORAGE MIGRATION PENDING: 
        // Appwrite Storage is removed. For now, we skip attachment upload.
        // TODO: Implement S3/Blob storage if needed.
        if (attachment) {
            console.warn("Attachment upload disabled in migration.");
        }

        const question = await prisma.question.create({
            data: {
                title,
                content,
                authorId,
                tags,
                attachmentId // storing null or previous logic
            }
        });

        // Map to Appwrite-like structure for frontend compatibility
        const questionDoc = {
            ...question,
            $id: question.id,
            $createdAt: question.createdAt.toISOString(),
            $updatedAt: question.updatedAt.toISOString(),
            $collectionId: "questions",
            $databaseId: "main-stackflow"
        };

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
                        await createComment("question", questionDoc.$id, commentText, botUserId);
                    }
                }
            })();
        } catch (err) {
            console.error("Failed to trigger AI comment:", err);
        }
        // --------------------------

        return { success: true, question: questionDoc };
    } catch (error: any) {
        console.error("Error creating question:", error);
        return { success: false, error: error.message };
    }
}

export async function getQuestions(
    params: { search?: string, tag?: string } = {}
) {
    try {
        const { search, tag } = params;

        const where: any = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (tag) {
            where.tags = { has: tag };
        }

        const questions = await prisma.question.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: true
            }
        });

        const total = await prisma.question.count({ where });

        const documents = questions.map(q => ({
            ...q,
            $id: q.id,
            $createdAt: q.createdAt.toISOString(),
            $updatedAt: q.updatedAt.toISOString(),
            $collectionId: "questions",
            $databaseId: "main-stackflow",
            author: { ...q.author, $id: q.author.id, $createdAt: q.author.createdAt.toISOString() }
        }));

        return { success: true, documents, total };
    } catch (error: any) {
        console.error("Error getting questions:", error);
        return { success: false, error: error.message };
    }
}

export async function getQuestion(questionId: string) {
    try {
        const question = await prisma.question.findUnique({
            where: { id: questionId },
            include: { author: true }
        });

        if (!question) throw new Error("Question not found");

        const questionDoc = {
            ...question,
            $id: question.id,
            $createdAt: question.createdAt.toISOString(),
            $updatedAt: question.updatedAt.toISOString(),
            $collectionId: "questions",
            $databaseId: "main-stackflow",
            author: { ...question.author, $id: question.author.id, $createdAt: question.author.createdAt.toISOString() }
        };

        return { success: true, question: questionDoc };
    } catch (error: any) {
        console.error("Error getting question:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteQuestion(questionId: string, authorId: string) {
    try {
        // RLS / Owner check
        const q = await prisma.question.findUnique({ where: { id: questionId } });
        if (!q) throw new Error("Question not found");
        if (q.authorId !== authorId) throw new Error("Unauthorized");

        await prisma.question.delete({
            where: { id: questionId }
        });
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting question:", error);
        return { success: false, error: error.message };
    }
}
