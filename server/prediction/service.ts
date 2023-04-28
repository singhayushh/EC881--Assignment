import { Types } from "mongoose";
import { PredictionUpdateDto, PredictionDto, PredictionSchemaDto } from "./dto";
import { Prediction } from "./model";

const Create = async (createPredictionDto: PredictionDto): Promise<PredictionSchemaDto> => {
    return Prediction.create(createPredictionDto);
};

const FetchAll = async (): Promise<PredictionSchemaDto[]> => {
    return Prediction.find();
}

const FetchById = async (
    id: string
): Promise<PredictionSchemaDto | null> => {
    return Prediction.findOne({ id });
};

const Update = async (
    id: Types.ObjectId,
    dto: PredictionUpdateDto
): Promise<PredictionSchemaDto | null> => {
    return Prediction.findOneAndUpdate({ _id: id }, dto, { new: true }).select({
        password: 0,
    });
};

export { Create, FetchAll, FetchById, Update };