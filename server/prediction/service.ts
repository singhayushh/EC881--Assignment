import { Types } from "mongoose";
import { PredictionUpdateDto, PredictionDto, PredictionSchemaDto, StatDto } from "./dto";
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

const FetchStats = (
    predictions: PredictionSchemaDto[]
): StatDto => {
    const dto: StatDto = {
        dr0: 0,
        dr1: 0,
        dr2: 0,
        dr3: 0,
        dr4: 0,
        scans: predictions.length,
        execTime: 0,
    };

    let totalExecTime = 0;
    for (const prediction of predictions) {
        totalExecTime += prediction.executionTime;
        switch (prediction.leftEyeDRLevel) {
            case 0:
                dto.dr0++;
                break;
            case 1:
                dto.dr1++;
                break;
            case 2:
                dto.dr2++;
                break;
            case 3:
                dto.dr3++;
                break;
            default:
                dto.dr4++;
                break;
        }
        switch (prediction.rightEyeDRLevel) {
            case 0:
                dto.dr0++;
                break;
            case 1:
                dto.dr1++;
                break;
            case 2:
                dto.dr2++;
                break;
            case 3:
                dto.dr3++;
                break;
            default:
                dto.dr4++;
                break;
        }
    }
    dto.execTime = totalExecTime / dto.scans;
    return dto;
};

const Update = async (
    id: Types.ObjectId,
    dto: PredictionUpdateDto
): Promise<PredictionSchemaDto | null> => {
    return Prediction.findOneAndUpdate({ _id: id }, dto, { new: true }).select({
        password: 0,
    });
};

export { Create, FetchAll, FetchById, FetchStats, Update };