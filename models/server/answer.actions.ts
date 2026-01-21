"use server";

import { prisma } from "./config";
import { revalidatePath } from "next/cache";

export async function createAnswer(
    questionId: string,
    content: string,
    authorId: string
) {
    try {
        const answer = await prisma.answer.create({
            data: {
                questionId,
                content,
                authorId
            }
        });

        const answerDoc = {
            ...answer,
            $id: answer.id,
            $createdAt: answer.createdAt.toISOString(),
            $updatedAt: answer.updatedAt.toISOString(),
            $collectionId: "answers",
            $databaseId: "main-stackflow"
        };

        return { success: true, answer: answerDoc };
    } catch (error: any) {
        console.error("Error creating answer:", error);
        return { success: false, error: error.message };
    }
}

export async function getAnswers(questionId: string) {
    try {
        const answers = await prisma.answer.findMany({
            where: { questionId },
            orderBy: { createdAt: 'desc' },
            include: { author: true }
        });

        const documents = answers.map(a => ({
            ...a,
            $id: a.id,
            $createdAt: a.createdAt.toISOString(),
            $updatedAt: a.updatedAt.toISOString(),
            $collectionId: "answers",
            $databaseId: "main-stackflow",
            author: { ...a.author, $id: a.author.id, $createdAt: a.author.createdAt.toISOString() }
        }));

        return { success: true, documents, total: answers.length };
    } catch (error: any) {
        console.error("Error getting answers:", error);
        return { success: false, error: error.message };
    }
}
