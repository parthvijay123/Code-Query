import { Permission } from "node-appwrite";

import { db, commentCollection } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
    // Create Collection
    try {
        await databases.createCollection(db, commentCollection, commentCollection, [
            Permission.read("any"),
            Permission.read("users"),
            Permission.create("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ]);
        console.log("Comment Collection Created");
    } catch (error: any) {
        if (error.code !== 409) {
            throw error;
        }
        console.log("Comment Collection Already Exists");
    }

    // Create Attributes
    try {
        await databases.createStringAttribute(db, commentCollection, "content", 1000, true);
        console.log("Created content");
    } catch (err: any) { console.log("Error creating content:", err.message); }

    try {
        await databases.createEnumAttribute(db, commentCollection, "type", ["question", "answer"], true);
        console.log("Created type");
    } catch (err: any) { console.log("Error creating type:", err.message); }

    try {
        await databases.createStringAttribute(db, commentCollection, "typeId", 50, true);
        console.log("Created typeId");
    } catch (err: any) { console.log("Error creating typeId:", err.message); }

    try {
        await databases.createStringAttribute(db, commentCollection, "authorId", 50, true);
        console.log("Created authorId");
    } catch (err: any) { console.log("Error creating authorId:", err.message); }

    console.log("Comment Attributes Created");
}
