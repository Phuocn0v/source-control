import mongoose from "mongoose";
import toJson from "./plugins/toJson";

export interface Repository {
    _id: string;
    name: string;
    description: string;
    userId: string;
    isPublic: boolean;
}

const repositorySchema = new mongoose.Schema<Repository>({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    description: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    userId: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        required: true,
        default: false
    }
})

repositorySchema.plugin(toJson);

export default mongoose.model<Repository>("Repository", repositorySchema);
