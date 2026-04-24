import Groq from "groq-sdk";
import { prisma } from "@/models/server/config";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
});

export async function generateAIComment(questionTitle: string, questionContent: string) {
    try {
        const prompt = `
      You are a helpful developer assistant on Code-Query (a developer Q&A platform).
      A user just asked: "${questionTitle}"
      Context: "${questionContent}"
      
      Provide a short, encouraging, and helpful first comment. 
      If you know the answer, give a brief hint, but keep it concise (under 200 characters).
    `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
        });

        return chatCompletion.choices[0]?.message?.content || null;
    } catch (error) {
        console.error("Groq API Error:", error);
        return null;
    }
}

export async function getOrCreateBotUser() {
    const BOT_EMAIL = "groq-bot@codequery.dev";
    const BOT_NAME = "Groq AI Bot";

    try {
        // 1. Try to find the user
        const existingUser = await prisma.user.findUnique({
            where: { email: BOT_EMAIL }
        });

        if (existingUser) {
            return existingUser.id;
        }

        // 2. Create if not exists
        const user = await prisma.user.create({
            data: {
                name: BOT_NAME,
                email: BOT_EMAIL,
            }
        });
        return user.id;
    } catch (error) {
        console.error("Error managing Bot user:", error);
        return null;
    }
}
