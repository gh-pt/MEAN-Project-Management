import mongoose, { Schema } from 'mongoose';
import { UserInterface } from '../interfaces/User.interface';

// Define the schema
const userSchema: Schema = new Schema(
    {
        Username: { type: String, required: true, unique: true },
        Email: { type: String, required: true, unique: true },
        Contact: { type: Number, required: true, },
        Password: { type: String, required: true },
        ConfirmPassword: { type: String, required: true },
        ProfileImage: {
            data: Buffer, // Store image data as Buffer
            contentType: String,
        },
        refreshToken: { type: String }
    },
    { timestamps: true }
);

// Create and export the User model
export const User = mongoose.model<UserInterface>('User', userSchema);
