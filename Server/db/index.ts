import mongoose, { ConnectOptions } from 'mongoose';
import 'dotenv/config';

const connectDB = async (): Promise<void> => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL as string, );

        console.log("Connected Successfully to MongoDB Atlas! Host: " + connectionInstance.connection.host);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit the process with failure
    }
};

export default connectDB;
