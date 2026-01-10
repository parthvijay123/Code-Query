export const env = {
    appwrite: {
        endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL || "https://cloud.appwrite.io/v1"),
        projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "dummy-project"),
        apikey: String(process.env.APPWRITE_API_KEY || "dummy-key"),
    },
};

export const db = "main-stackflow";
export const questionCollection = "questions";
export const answerCollection = "answers";
export const commentCollection = "comments";
export const voteCollection = "votes";
export const questionAttachmentBucket = "question-attachments";

