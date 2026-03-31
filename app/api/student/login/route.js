import { User } from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ConnectDb } from "@/helper/db";

ConnectDb();

export async function POST(request) {
    const { email, password } = await request.json();

    console.log(email, password);

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, {
                status: 404
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return NextResponse.json({
                message: "Invalid password",
                success: false
            }, {
                status: 401
            });
        }

        const token = jwt.sign({
            _id: user.id,
            name: user.name,
        }, process.env.JWT_KEY); // Provide the JWT_KEY for signing the token

        console.log(token);
        
        const response=NextResponse.json({
            message:"login success",
            success:true,
            user:user,
        })

        response.cookies.set("authToken ", token  , {
            expiresIn:"1d",
            httpOnly:true,
        } )

        return response 

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: error.message,
            success: false
        }, {
            status: 500
        });
    }
}
