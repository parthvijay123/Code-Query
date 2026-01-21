"use server";

import { prisma } from "./config";

export async function createComment(
    type: "question" | "answer",
    typeId: string,
    content: string,
    authorId: string
) {
    try {
        const comment = await prisma.comment.create({
            data: {
                type,
                typeId,
                content,
                authorId
            }
        });

        const commentDoc = {
            ...comment,
            $id: comment.id,
            $createdAt: comment.createdAt.toISOString(),
            $updatedAt: comment.updatedAt.toISOString(),
            $collectionId: "comments",
            $databaseId: "main-stackflow"
        };

        return { success: true, comment: commentDoc };
    } catch (error: any) {
        console.error("Error creating comment:", error);
        return { success: false, error: error.message };
    }
}

export async function getComments(type: "question" | "answer", typeId: string) {
    try {
        const comments = await prisma.comment.findMany({
            where: {
                type,
                typeId
            },
            orderBy: { createdAt: 'desc' },
            include: { author: true }
        });

        const documents = comments.map(c => ({
            ...c,
            $id: c.id,
            $createdAt: c.createdAt.toISOString(),
            $updatedAt: c.updatedAt.toISOString(),
            $collectionId: "comments",
            $databaseId: "main-stackflow",
            author: { ...c.author, $id: c.author.id, $createdAt: c.author.createdAt.toISOString() }
        }));

        return { success: true, documents, total: comments.length };
    } catch (error: any) {
        console.error("Error getting comments:", error);
        return { success: false, error: error.message };
    }
}

