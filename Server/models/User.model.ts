import mongoose, { Schema } from 'mongoose';
import { UserInterface } from '../interfaces/User.interface';


const userSchema: Schema = new Schema(
    {
        Username: { type: String, required: true, unique: true },
        Email: { type: String, required: true, unique: true },
        Contact: { type: Number, required: true },
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


export const User = mongoose.model<UserInterface>('User', userSchema);
