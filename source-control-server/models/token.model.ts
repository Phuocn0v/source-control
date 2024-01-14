import mongoose from "mongoose";
import toJson from "./plugins/toJson";
import tokenTypes from "../config/token";

export interface IToken {
    token: string;
    user: mongoose.Schema.Types.ObjectId;
    type: string;
    expires: Date;
    blacklisted: boolean;
}

export interface ITokenModel extends mongoose.Model<IToken> {

}

const tokenSchema = new mongoose.Schema<IToken>({
    token: {
        type: String,
        required: true,
        index: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: [tokenTypes.ACCESS, tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL]
    },
    expires: {
        type: Date,
        required: true
    },
    blacklisted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

tokenSchema.plugin(toJson);

const Token = mongoose.model<IToken, ITokenModel>('Token', tokenSchema);

export default Token;
