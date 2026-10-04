import * as React from "react"
import { OpenInV0Button } from "@/components/open-in-v0-button"
import { HelloWorld } from "@/registry/new-york/hello-world/hello-world"
import { ExampleForm } from "@/registry/new-york/example-form/example-form"
import PokemonPage from "@/registry/new-york/complex-component/page"
import { ComponentPreview } from "@/components/component-preview"

// Component code strings
const helloWorldCode = `export function HelloWorld() {
  return <h1 className="text-2xl font-bold">Hello World</h1>
}`

const exampleFormCode = `"use client"

import * as React from "react"
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"

const exampleFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
})

export function ExampleForm() {
  const [pending, setPending] = React.useState(false)
  const [state, setState] = React.useState({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    success: false,
    errors: {
      name: "",
      email: "",
      message: "",
    },
  })

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setPending(true)

      const formData = new FormData(e.target as HTMLFormElement)
      const data = Object.fromEntries(formData.entries())
      const result = exampleFormSchema.safeParse(data)

      if (!result.success) {
        setState({
          ...state,
          errors: Object.fromEntries(
            Object.entries(result.error.flatten().fieldErrors).map(
              ([key, value]) => [key, value?.[0] ?? ""]
            )
          ) as Record<keyof typeof state.errors, string>,
        })
        setPending(false)
        return
      }

      setPending(false)
    },
    [state]
  )

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>How can we help?</CardTitle>
        <CardDescription>
          Need help with your project? We&apos;re here to assist you.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-6">
          <div
            className="group/field grid gap-2"
            data-invalid={!!state.errors?.name}
          >
            <Label
              htmlFor="name"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Name <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Lee Robinson"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={pending}
              aria-invalid={!!state.errors?.name}
              aria-errormessage="error-name"
              defaultValue={state.defaultValues.name}
            />
            {state.errors?.name && (
              <p id="error-name" className="text-destructive text-sm">
                {state.errors.name}
              </p>
            )}
          </div>
          <div
            className="group/field grid gap-2"
            data-invalid={!!state.errors?.email}
          >
            <Label
              htmlFor="email"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Email <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="leerob@acme.com"
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={pending}
              aria-invalid={!!state.errors?.email}
              aria-errormessage="error-email"
              defaultValue={state.defaultValues.email}
            />
            {state.errors?.email && (
              <p id="error-email" className="text-destructive text-sm">
                {state.errors.email}
              </p>
            )}
          </div>
          <div
            className="group/field grid gap-2"
            data-invalid={!!state.errors?.message}
          >
            <Label
              htmlFor="message"
              className="group-data-[invalid=true]/field:text-destructive"
            >
              Message <span aria-hidden="true">*</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Type your message here..."
              className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
              disabled={pending}
              aria-invalid={!!state.errors?.message}
              aria-errormessage="error-message"
              defaultValue={state.defaultValues.message}
            />
            {state.errors?.message && (
              <p id="error-message" className="text-destructive text-sm">
                {state.errors.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Sending..." : "Send Message"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}`

const complexComponentCode = `// Complex component with multiple files:

// page.tsx
import { cache } from "react"
import { PokemonCard } from "@/registry/new-york/complex-component/components/pokemon-card"
import { getPokemonList } from "@/registry/new-york/complex-component/lib/pokemon"

const getCachedPokemonList = cache(getPokemonList)

export default async function Page() {
  const pokemons = await getCachedPokemonList({ limit: 12 })

  if (!pokemons) {
    return null
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4">
      <div className="grid grid-cols-2 gap-4 py-10 sm:grid-cols-3 md:grid-cols-4">
        {pokemons.results.map((p) => (
          <PokemonCard key={p.name} name={p.name} />
        ))}
      </div>
    </div>
  )
}

// components/pokemon-card.tsx
import { cache } from "react"
import { getPokemon } from "@/registry/new-york/complex-component/lib/pokemon"
import { Card, CardContent } from "@/components/ui/card"
import { PokemonImage } from "@/registry/new-york/complex-component/components/pokemon-image"

const cachedGetPokemon = cache(getPokemon)

export async function PokemonCard({ name }: { name: string }) {
  const pokemon = await cachedGetPokemon(name)

  if (!pokemon) {
    return null
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center p-2">
        <div>
          <PokemonImage name={pokemon.name} number={pokemon.id} />
        </div>
        <div className="text-center font-medium">{pokemon.name}</div>
      </CardContent>
    </Card>
  )
}

// lib/pokemon.ts
import { z } from "zod"

export async function getPokemonList({ limit = 10 }: { limit?: number }) {
  try {
    const response = await fetch(
      \`https://pokeapi.co/api/v2/pokemon?limit=\${limit}\`
    )
    return z
      .object({
        results: z.array(z.object({ name: z.string() })),
      })
      .parse(await response.json())
  } catch (error) {
    console.error(error)
    return null
  }
}`

// This page displays items from the custom registry.
// You are free to implement this with your own design as needed.

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Custom Registry</h1>
        <p className="text-muted-foreground">
          A custom registry for distributing code using shadcn.
        </p>
      </header>
      <main className="flex flex-col flex-1 gap-8">
        {/* Hello World Component */}
        <div className="flex flex-col gap-4 relative">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Hello World Component</h2>
            <OpenInV0Button name="hello-world" className="w-fit" />
          </div>
          <ComponentPreview 
            name="A simple hello world component" 
            code={helloWorldCode}
          >
            <HelloWorld />
          </ComponentPreview>
        </div>

        {/* Example Form */}
        <div className="flex flex-col gap-4 relative">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Example Form</h2>
            <OpenInV0Button name="example-form" className="w-fit" />
          </div>
          <ComponentPreview 
            name="A contact form with Zod validation" 
            code={exampleFormCode}
          >
            <ExampleForm />
          </ComponentPreview>
        </div>

        {/* Complex Component */}
        <div className="flex flex-col gap-4 relative">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Complex Component</h2>
            <OpenInV0Button name="complex-component" className="w-fit" />
          </div>
          <ComponentPreview 
            name="A complex component showing hooks, libs and components" 
            code={complexComponentCode}
          >
            <PokemonPage />
          </ComponentPreview>
        </div>
      </main>
    </div>
  )
}