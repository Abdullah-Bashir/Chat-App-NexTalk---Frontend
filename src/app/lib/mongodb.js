import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
    console.error("❌ MONGODB_URI is missing in this context");
    console.error("ENV KEYS:", Object.keys(process.env));
    throw new Error("Please add your MongoDB URI to .env.local");
}


console.log("🚨 MONGODB_URI:", process.env.MONGODB_URI);

/**
 * In development mode, use a global variable so that the value
 * is preserved across module reloads caused by HMR.
 */

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;
