import {NextResponse} from "next/server"
import {prisma} from "@/lib/prisma"
import  bcrypt from "bcryptjs"

export async function POST(request:Request){
    try{
    const {name,email,password} = await request.json()

    //validation
    if(!email || !name || !password){
        return NextResponse.json(
            {error:"Missing required fields"},
            {status: 400}
        )
    }

    if(password.length<8){
        return NextResponse.json(
            {error: "Password must be at least 8 characters"},
            {status: 400}
        )
    }

    const existingUser = await prisma.user.findUnique({
        where:{email}
    })
    if(existingUser){
        return NextResponse.json(
            {error:"User already exists"},
            {status:400}
        )
    }

    const hashedPassword = await bcrypt.hash(password,12)

    const user = await prisma.user.create({
        data:{
            name,
            email,
            password:hashedPassword
        },
        select:{
            id:true,
            name:true,
            email:true,
            createdAt:true
        }
    })

    return NextResponse.json(
        {
            message: "User created successfully",
            user
        },
        {status: 201}
    )
}catch(error){
    console.error("Registration error:", error)
    return NextResponse.json(
        {error: "Something went wrong"},
        {status: 500}
    )
}
}