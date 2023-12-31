import { Schema } from "mongoose";

export default function toJson<T>(schema: Schema<T>) {
    schema.set('toJSON', {
        transform: function (doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
        }
    });
}