import { Model, Schema, model } from "mongoose";
import { UserSchemaDto } from "./dto";
import { genSaltSync, hashSync } from "bcrypt";

const userSchema: Schema<UserSchemaDto> = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: "/img/avatar.svg"
        }
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", function (next) {
    if (!this.isModified("password") || !this.isNew) {
        next();
    } else {
        this.isModified("password");
    }

    if (this.isModified("password") && this.password) {
        const salt = genSaltSync(10);
        this.password = hashSync(this.password.toString(), salt);
    }
    next();
});

const User: Model<UserSchemaDto> = model("User", userSchema);

export { User };