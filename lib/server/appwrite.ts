import { Client, Databases, Users, Avatars, Storage } from "node-appwrite";
import { env } from "@/models/name";

export async function createAdminClient() {
    const client = new Client()
        .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
        .setProject(env.appwrite.projectId) // Your project ID
        .setKey(env.appwrite.apikey); // Your secret API key

    return {
        get account() {
            return new Users(client);
        },
        get databases() {
            return new Databases(client);
        },
        get storage() {
            return new Storage(client);
        },
        get avatars() {
            return new Avatars(client);
        },
    };
}
