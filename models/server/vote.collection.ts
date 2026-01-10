import { Permission } from "node-appwrite";

import { db, voteCollection } from "../name";
import { databases } from "./config";

export default async function createVoteCollection() {
    // Create Collection
    try {
        await databases.createCollection(db, voteCollection, voteCollection, [
            Permission.read("any"),
            Permission.read("users"),
            Permission.create("users"),
            Permission.update("users"),
            Permission.delete("users"),
        ]);
        console.log("Vote Collection Created");
    } catch (error: any) {
        if (error.code !== 409) {
            throw error;
        }
        console.log("Vote Collection Already Exists");
    }

    // Create Attributes
    // We try to create attributes one by one so if one fails (exists), others still try.
    // Or we can just use Promise.allSettled? Appwrite node SDK might not support it natively? 
    // Standard Promise.allSettled is available in Node.

    // Create Attributes
    try {
        await databases.createEnumAttribute(db, voteCollection, "type", ["question", "answer"], true);
        console.log("Created type");
    } catch (err: any) { console.log("Error creating type:", err.message); }

    try {
        await databases.createStringAttribute(db, voteCollection, "typeId", 50, true);
        console.log("Created typeId");
    } catch (err: any) { console.log("Error creating typeId:", err.message); }

    try {
        await databases.createEnumAttribute(db, voteCollection, "voteStatus", ["up", "down"], true);
        console.log("Created voteStatus");
    } catch (err: any) { console.log("Error creating voteStatus:", err.message); }

    try {
        await databases.createStringAttribute(db, voteCollection, "votedById", 50, true);
        console.log("Created votedById");
    } catch (err: any) { console.log("Error creating votedById:", err.message); }

    console.log("Vote Attributes Created");
}
