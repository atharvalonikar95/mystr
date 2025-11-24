import mongoose,{Schema,Document} from "mongoose";
import { Message } from "./Message";


export interface  User extends Document{
    username:string;
    email:string;
    password:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isVerified:boolean;
    isAcceptingMessage:boolean;
    messages:Message[]

}


const Userschema:Schema<User> = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        trim:true,
        unique:true,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/.+\@.+\..+/,"please use vaild email"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    verifyCode:{
        type:String,
        required:[true,"Code is required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Code is required"],
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[]
    
})

export default mongoose.models.User as mongoose.Model<User> || mongoose.model<User>('User',Userschema);