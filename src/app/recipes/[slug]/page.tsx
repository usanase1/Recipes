import fs from "fs/promises"
import path from "path"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Recipe } from "@/types/recipe"
import type { Metadata } from "next"

type RecipePageProps = {
  params: Promise<{
    slug: string
  }>
}


export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { slug } = await params
  const filePath = path.join(process.cwd(), "src", "data", "recipes.json")
  const data = await fs.readFile(filePath, "utf-8")
  const recipes: Recipe[] = JSON.parse(data)
  const recipe = recipes.find((r) => r.slug === slug)

  if (!recipe) {
    return { title: "Recipe Not Found" }
  }

  return { title: recipe.title }
}


export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "src", "data", "recipes.json")
  const data = await fs.readFile(filePath, "utf-8")
  const recipes: Recipe[] = JSON.parse(data)

  return recipes.map((recipe) => ({
    slug: recipe.slug,
  }))
}


export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params
  const filePath = path.join(process.cwd(), "src", "data", "recipes.json")
  const data = await fs.readFile(filePath, "utf-8")
  const recipes: Recipe[] = JSON.parse(data)

  const recipe = recipes.find((r) => r.slug === slug)

  if (!recipe) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-orange-50 pb-16">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link
          href="/"
          className="inline-block mb-6 bg-orange-900 text-white hover:bg-orange-700 font-bold py-2 px-5 rounded-md transition-colors duration-200"
        >
          ← Back to Recipes
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-80 w-full">
            <Image src={`/images/${recipe.image}`} alt={recipe.title} fill className="object-cover" priority />
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold text-orange-800 mb-6">{recipe.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-orange-100 p-6 rounded-lg hover:shadow-lg hover:scale-105 transition-transform duration-300">
                <h2 className="text-xl font-semibold text-orange-700 mb-4 border-b border-orange-700 pb-2">
                  Ingredients
                </h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="inline-block w-5 h-5 bg-orange-800 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                      <span className="text-gray-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-100 p-6 rounded-lg hover:scale-105 transition-transform duration-300">
                <h2 className="text-xl font-semibold text-orange-700 mb-4 border-b border-orange-700 pb-2">Steps</h2>
                <ol className="space-y-4">
                  {recipe.steps.map((step, i) => (
                    <li key={i} className="flex">
                      <span className="inline-block w-6 h-6 bg-orange-800 rounded-full mr-3 flex-shrink-0 text-white font-medium text-center">
                        {i + 1}
                      </span>
                      <span className="text-gray-800">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
