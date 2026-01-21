import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/models/server/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateAIComment(questionTitle: string, questionContent: string) {
    try {
        const prompt = `
      You are a helpful developer assistant on Codeforces Duel (a competitive coding platform).
      A user just asked: "${questionTitle}"
      Context: "${questionContent}"
      
      Provide a short, encouraging, and helpful first comment. 
      If you know the answer, give a brief hint, but keep it concise (under 200 characters).
    `;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return null;
    }
}

export async function getOrCreateBotUser() {
    const BOT_EMAIL = "gemini@stackflow.com";
    const BOT_NAME = "Gemini Bot";
    // const BOT_PASSWORD = "gemini_secure_password_123"; // Not needed for Prisma User model if we just want a record

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
                // password: ... // If using credentials provider, you might want to hash a password, but for a bot user referenced by ID, it might not be needed depending on auth setup.
            }
        });
        return user.id;
    } catch (error) {
        console.error("Error managing Bot user:", error);
        return null;
    }
}

