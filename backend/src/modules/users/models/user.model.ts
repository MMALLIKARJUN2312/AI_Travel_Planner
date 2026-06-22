import mongoose from "mongoose";
import { UserRole } from "../types/user-role.enum.js";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        minlength : 2,
        maxlength : 50,
    },
    email : {
        type : String,
        required : true,
        trim : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    role : {
        type : String,
        enum : Object.values(UserRole),
        default : UserRole.USER
    },
    refreshTokens : [{
        token : String,
        expiresAt : Date
    }]
    },
{
    timestamps : true,
    versionKey : false
}
)

userSchema.index(
    {email : 1},
    {unique : true}
)

export const UserModel = mongoose.model("User", userSchema);