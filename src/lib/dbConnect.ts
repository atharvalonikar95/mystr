import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number
}

const  connection : ConnectionObject={}


export default async function dbConnect(): Promise<void>{

    if(connection.isConnected){
        console.log('Already connected to database');
        return
    }

    try {
       const db = await mongoose.connect(process.env.MONGODB_URI || '',{})
       connection.isConnected=db.connections[0].readyState

       console.log("DB Connected Successfully");
       console.log(db);
        
    } catch (error) {
        console.log("DB connection Failed",error);
        process.exit(1);
    }
}