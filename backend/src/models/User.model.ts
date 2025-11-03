import mongoose, {Document,Model,Schema} from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    isActivated: boolean;
    profileImageUrl?: string;
}

const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false, required: true },
    isActivated: { type: Boolean, default: false },
    profileImageUrl: { type: String, required: false, default: '', },
})

const UserModel: Model<IUser> = mongoose.model("User", UserSchema);

export default UserModel;
