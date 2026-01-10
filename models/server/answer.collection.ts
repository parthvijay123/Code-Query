import { Permission } from "node-appwrite";

import { db, answerCollection } from "../name";
import { databases } from "./config";

export default async function createAnswerCollection() {
    // Create Collection
    try {
        await databases.createCollection(db, answerCollection, answerCollection, [
            Permission.read("any"),
            Permission.read("users"),
            Permission.create("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ]);
        console.log("Answer Collection Created");
    } catch (error: any) {
        if (error.code !== 409) {
            throw error;
        }
        console.log("Answer Collection Already Exists");
    }

    // Create Attributes
    try {
        await databases.createStringAttribute(db, answerCollection, "content", 10000, true);
        console.log("Created content");
    } catch (err: any) { console.log("Error creating content:", err.message); }

    try {
        await databases.createStringAttribute(db, answerCollection, "questionId", 50, true);
        console.log("Created questionId");
    } catch (err: any) { console.log("Error creating questionId:", err.message); }

    try {
        await databases.createStringAttribute(db, answerCollection, "authorId", 50, true);
        console.log("Created authorId");
    } catch (err: any) { console.log("Error creating authorId:", err.message); }

    console.log("Answer Attributes Created");
}
