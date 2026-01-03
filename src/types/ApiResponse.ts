import { Message } from "@/model/Message";
import { MessageDTO } from "./messageDTO";

export interface ApiResponse{
    success:boolean;
    message?:string;
    isAcceptingMessages?:boolean
    messages?:Array<MessageDTO>
}