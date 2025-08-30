/* eslint-disable @next/next/no-img-element */
"use client"

import { z } from "zod"
import { Eye, EyeClosed, Twitter, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/kibo-ui/spinner"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

const formSchema = z.object({
  email: z.email(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  image: z.string().url().optional().or(z.literal("")),
})

export function SignUpForm({}) {
  const [seePassword, setSeePassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageError, setImageError] = useState<boolean>(false)

  const router = useRouter()

  // Function to validate and preview image
  const handleImagePreview = (url: string) => {
    if (!url) {
      setImagePreview("")
      setImageError(false)
      return
    }
    
    // Basic URL validation
    try {
      new URL(url)
      setImagePreview(url)
      setImageError(false)
    } catch {
      setImageError(true)
      setImagePreview("")
    }
  }

   // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      image: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      email,
      name,
      password,
      image,
    } = values
    try {
      setIsLoading(true)
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
        image,
      })
      if(error) throw new Error(error.message)
      router.push("/dashboard")
    } catch (error) {
      toast((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <Twitter className="size-6 fill-primary" />
              </div>
              <span className="sr-only">Twitter 2.</span>
            </div>
            <h1 className="text-xl font-bold">Join Twitter 2.</h1>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/sign-in" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>
                  This will be your display name on Twitter 2.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="ex@example.com" {...field} />
                </FormControl>
                <FormDescription>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input type={seePassword ? "text" : "password"} placeholder="******" {...field} />
                    <Button
                      className="cursor-pointer" 
                      type="button" 
                      size={'icon'} 
                      variant={'ghost'} 
                      onClick={() => setSeePassword(prev => !prev)}
                    >
                      {seePassword ? (
                        <Eye />
                      ) : (
                        <EyeClosed />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  Password must be at least 6 characters long.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image URL (Optional)</FormLabel>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <FormControl>
                      <Input 
                        type="url" 
                        placeholder="https://example.com/image.jpg" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleImagePreview(e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Add a profile picture by providing an image URL.
                    </FormDescription>
                    <FormMessage />
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-muted border-2 border-border overflow-hidden flex items-center justify-center">
                      {imagePreview && !imageError ? (
                        <img 
                          src={imagePreview} 
                          alt="Profile preview" 
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                          onLoad={() => setImageError(false)}
                        />
                      ) : (
                        <User className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit" className="w-full cursor-pointer">
            {isLoading && <Spinner variant="infinite"/>}
            Create Account
          </Button>
        </form>
      </Form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}