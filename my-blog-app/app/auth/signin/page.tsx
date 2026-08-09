"use client"

import{signIn} from "next-auth/react"
import React, { useState } from "react"
import Link from "next/link"
import {useRouter} from "next/navigation"

export default function SignIn(){
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error,setError] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const handleSubmit = async(e: any)=>{
        e.preventDefault()
        setError("")
        setLoading(true)

        try{
            const result = await signIn("credentials",{
                email,
                password,
                redirect:false,
            })
            if(result?.error){
                setError("invalid email or password")
            }else{
                router.push("/dashboard")
                router.refresh()
            }
        }catch(error){
            setError("Something went wrong")
        }finally{
            setLoading(false)
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <input 
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                />
            </div>
            <div>
                <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                />
            </div>
            {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
        </div>
        </div>
    )
}