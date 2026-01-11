import "dotenv/config";
import getOrCreateDB from "@/models/server/dbSetup";

async function main() {
    console.log("Running DB Setup...");
    await getOrCreateDB();
    console.log("DB Setup Complete");
}

main();
