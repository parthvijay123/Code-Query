import { IndexType, Permission } from "node-appwrite";

import { db, questionCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection() {
    // Create Collection
    try {
        await databases.createCollection(db, questionCollection, questionCollection, [
            Permission.read("any"),
            Permission.read("users"),
            Permission.create("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ]);
        console.log("Question Collection Created");
    } catch (error: any) {
        if (error.code !== 409) {
            throw error;
        }
        console.log("Question Collection Already Exists");
    }

    // Create Attributes
    try {
        await databases.createStringAttribute(db, questionCollection, "title", 100, true);
        console.log("Created title");
    } catch (err: any) { console.log("Error creating title:", err.message); }

    try {
        await databases.createStringAttribute(db, questionCollection, "content", 10000, true);
        console.log("Created content");
    } catch (err: any) { console.log("Error creating content:", err.message); }

    try {
        await databases.createStringAttribute(db, questionCollection, "authorId", 50, true);
        console.log("Created authorId");
    } catch (err: any) { console.log("Error creating authorId:", err.message); }

    try {
        await databases.createStringAttribute(db, questionCollection, "tags", 50, true, undefined, true);
        console.log("Created tags");
    } catch (err: any) { console.log("Error creating tags:", err.message); }

    try {
        await databases.createStringAttribute(db, questionCollection, "attachmentId", 50, false);
        console.log("Created attachmentId");
    } catch (err: any) { console.log("Error creating attachmentId:", err.message); }

    console.log("Question Attributes Created");

    // Create Indexes
    await Promise.all([
        databases.createIndex(
            db,
            questionCollection,
            "title",
            IndexType.Fulltext,
            ["title"],
            ['asc']
        ).catch(err => { if (err.code !== 409) throw err; }),
        databases.createIndex(
            db,
            questionCollection,
            "content",
            IndexType.Fulltext,
            ["content"],
            ['asc']
        ).catch(err => { if (err.code !== 409) throw err; }),
    ]);
    console.log("Question Indexes Created");
}
