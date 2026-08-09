"use client"

import Link from 'next/link'
import {useSession,signOut} from "next-auth/react"
import {useRouter} from "next/navigation"

export default function Header() {
  const {data:session,status} = useSession()
  const isAuthenticated = status === "authenticated"
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({
      redirect: false  // Don't redirect automatically
    })
    // Manually redirect to home
    router.push("/")

  }

 return (
    <header className="border-b">
      <nav className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-blue-600">
          My Blog
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link href="/blog" className="hover:text-blue-600">
            Blog
          </Link>
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">
                {session?.user?.name || session?.user?.email}
              </span>
              <Link href="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-red-600 hover:text-red-800"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="hover:text-blue-600">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}