import mongoose from "mongoose";

const ConnectDB = async (URI: string) => {
    const db = (await mongoose.connect(URI)).connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", () => {
        console.log("Connected successfully");
    });
};

export { ConnectDB };