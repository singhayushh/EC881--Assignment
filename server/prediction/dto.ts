import { Document, Types } from "mongoose";

type PredictionDto = {
    id: string;
    name: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    executionTime: number; // milliseconds
    leftEyeImage: string;
    rightEyeImage: string;
    leftEyeDRLevel: number;
    rightEyeDRLevel: number;
    leftEyePredictions: number[];
    rightEyePredictions: number[];
    smsNotification?: string;
    emailNotification?: string;
    createdBy?: Types.ObjectId;
};

type PredictionSchemaDto = PredictionDto & Document;
type PredictionUpdateDto = Partial<Omit<PredictionDto, "password">>;

export {
    PredictionDto,
    PredictionSchemaDto,
    PredictionUpdateDto,
};