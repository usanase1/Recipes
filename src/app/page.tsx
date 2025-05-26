import fs from "fs/promises"
import path from "path"
import Link from "next/link"
import Image from "next/image"
import { auth } from "@clerk/nextjs/server"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import type { Recipe } from "../types/recipe"

export default async function Home() {
  const { userId } = await auth()

  if (!userId) {
    return (
      <main className="min-h-screen px-6 py-10 bg-gradient-to-tr from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-3xl font-extrabold text-orange-800 mb-6 font-serif">Welcome to Recipe List</h1>
            <p className="text-gray-600 mb-8">Please sign in or create an account to access our delicious recipes.</p>
            <div className="space-y-4">
              <SignInButton mode="modal">
                <button className="w-full bg-orange-700 text-white hover:bg-orange-600 font-semibold py-3 px-6 rounded-md transition-colors duration-200">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full bg-amber-100 text-orange-800 hover:bg-amber-200 font-semibold py-3 px-6 rounded-md border border-orange-700 transition-colors duration-200">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const filePath = path.join(process.cwd(), "src", "data", "recipes.json")
  const data = await fs.readFile(filePath, "utf-8")
  const recipes: Recipe[] = JSON.parse(data)

  return (
    <main className="min-h-screen px-6 py-10 bg-gradient-to-tr from-orange-50 via-amber-50 to-yellow-50">
      <h1 className="mb-12 text-center text-5xl font-extrabold text-orange-800 tracking-wide font-serif">
        Recipe List
      </h1>
      <div className="max-w-7xl mx-auto">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {recipes.map((recipe) => (
            <li
              key={recipe.slug}
              className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-2 hover:scale-105 transition duration-300 bg-white"
            >
              <Link href={`/recipes/${recipe.slug}`} className="block h-full">
                <div className="relative h-64 w-full">
                  <Image src={`/images/${recipe.image}`} alt={recipe.title} fill className="object-cover" />
                </div>
                <div className="p-5 bg-amber-100 group-hover:bg-amber-200 transition-colors duration-300">
                  <h2 className="text-xl font-semibold mb-3 text-amber-900">{recipe.title}</h2>
                  <button className="mt-4 w-full rounded-md bg-orange-700 py-2 text-white font-semibold hover:bg-orange-600 transition-colors duration-200">
                    View Ingredients
                  </button>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
