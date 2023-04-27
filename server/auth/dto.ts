import { Document } from "mongoose";

type UserDto = {
    fullName: string;
    username: string;
    image: string;
    email: string;
    password: string;
};

type UserSchemaDto = UserDto & Document;
type UserUpdateDto = Partial<Omit<UserDto, "password">>;

export {
    UserDto,
    UserSchemaDto,
    UserUpdateDto,
};