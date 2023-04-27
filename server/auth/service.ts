import { Types } from "mongoose";
import { UserUpdateDto, UserDto, UserSchemaDto } from "./dto";
import { User } from "./model";

const Create = async (createUserDto: UserDto): Promise<UserSchemaDto> => {
    return User.create(createUserDto);
};

const FetchByEmail = async (
    email: string
): Promise<UserSchemaDto | null> => {
    return User.findOne({ email });
};

const FetchById = async (
    id: Types.ObjectId
): Promise<UserSchemaDto | null> => {
    return User.findById(id);
};

const Update = async (
    id: Types.ObjectId,
    dto: UserUpdateDto
): Promise<UserSchemaDto | null> => {
    return User.findOneAndUpdate({ _id: id }, dto, { new: true }).select({
        password: 0,
    });
};

export { Create, FetchByEmail, Update };