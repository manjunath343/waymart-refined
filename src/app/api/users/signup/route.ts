import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import {NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request:NextRequest) {
    try {
       const reqBody= await request.json();
       const {username,email,password,phone}=reqBody;
       console.log(reqBody);

       if(!username || !email || !password || !phone){
        return NextResponse.json({message:"Please fill all the fields"},{status:400})
       }

       const user=await User.findOne({email});
       if(user){
        return NextResponse.json({message:"User already exists"},{status:400})
       }

       const salt=await bcryptjs.genSalt(10);
       const hashedPassword=await bcryptjs.hash(password,salt);

       const newUser=new User({
        username,
        email,
        password:hashedPassword,
        phone
       })

       const savedUser=await newUser.save();
       console.log(savedUser);

       return NextResponse.json({
        message:"User created successfully",
        success:true,
        savedUser
       },{status:201});
       }
    catch (error) {
        console.log(error);
        return NextResponse.json({message:"Database Error"},{status:500})
        
    }

}
