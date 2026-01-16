import { GoogleGenerativeAI } from "@google/generative-ai";
import { users } from "@/models/server/config"; // Import your server-side users client
import { ID, Query } from "node-appwrite";

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
    const BOT_PASSWORD = "gemini_secure_password_123"; // You might not need to ever sign in, but it's required.

    try {
        // 1. Try to find the user
        const response = await users.list([
            Query.equal("email", BOT_EMAIL)
        ]);

        if (response.total > 0) {
            return response.users[0].$id;
        }

        // 2. Create if not exists
        const user = await users.create(ID.unique(), BOT_EMAIL, undefined, BOT_PASSWORD, BOT_NAME);
        return user.$id;
    } catch (error) {
        console.error("Error managing Bot user:", error);
        return null;
    }
}
