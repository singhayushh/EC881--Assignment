import { Model, Schema, model } from "mongoose";
import { PredictionSchemaDto } from "./dto";

const predictionSchema: Schema<PredictionSchemaDto> = new Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female"],
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        leftEyeImage: {
            type: String,
            required: true,
        },
        rightEyeImage: {
            type: String,
            required: true,
        },
        leftEyeDRLevel: {
            type: Number,
            required: true,
            enum: [0, 1, 2, 3 ,4]
        },
        rightEyeDRLevel: {
            type: Number,
            required: true,
            enum: [0, 1, 2, 3 ,4]
        },
        leftEyePredictions: [Number],
        rightEyePredictions: [Number],
        smsNotification: {
            type: String,
            default: "off",
            enum: ["on", "off"]
        },
        emailNotification: {
            type: String,
            default: "off",
            enum: ["on", "off"]
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        executionTime: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Prediction: Model<PredictionSchemaDto> = model("Prediction", predictionSchema);

export { Prediction };