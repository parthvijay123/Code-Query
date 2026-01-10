import { db } from "../name";
import createQuestionCollection from "./question.collection";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createVoteCollection from "./vote.collection";

import { databases } from "./config";

export default async function getOrCreateDB() {
    try {
        await databases.get(db);
        console.log("Database connection success");
    } catch (error) {
        try {
            await databases.create(db, db);
            console.log("Database created");
        } catch (err) {
            console.log("Error creating databases", err);
            return; // Stop execution if database creation fails
        }
    }

    return Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createCommentCollection(),
        createVoteCollection(),
    ]);
}
