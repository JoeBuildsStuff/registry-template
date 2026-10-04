"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Code block component for syntax highlighting
interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language = "tsx" }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }
  
  return (
    <div className="relative">
      <button
        onClick={copyToClipboard}
        className="absolute right-4 top-4 z-10 h-8 w-8 rounded-md border bg-background p-0 text-xs hover:bg-muted"
        title="Copy code"
      >
        {copied ? (
          <svg className="h-4 w-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-4 w-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
      <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm min-h-[400px]">
        <code className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  )
}

// Component preview wrapper
interface ComponentPreviewProps {
  name: string
  children: React.ReactNode
  code: string
}

export function ComponentPreview({ name, children, code }: ComponentPreviewProps) {
  return (
    <Tabs defaultValue="preview" className="w-full">
      <div className="flex items-center justify-between">
        <TabsList className="grid w-[200px] grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <div className="text-sm text-muted-foreground">
          {name}
        </div>
      </div>
      
      <TabsContent value="preview" className="border rounded-lg p-4 min-h-[400px]">
        <div className="flex items-center justify-center min-h-[350px]">
          {children}
        </div>
      </TabsContent>
      
      <TabsContent value="code" className="">
          <CodeBlock code={code} />
      </TabsContent>
    </Tabs>
  )
}