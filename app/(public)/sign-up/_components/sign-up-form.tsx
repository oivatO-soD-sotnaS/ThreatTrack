/* eslint-disable @next/next/no-img-element */
"use client"

import { z } from "zod"
import { Eye, EyeClosed, Twitter, User } from "lucide-react"
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
import { motion, AnimatePresence } from "framer-motion"

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  image: z.string().url().optional().or(z.literal("")),
})

type FormValues = z.infer<typeof formSchema>

export function SignUpForm() {
  const [seePassword, setSeePassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState("")
  const [imageError, setImageError] = useState(false)
  const [step, setStep] = useState(0)

  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      image: "",
    },
  })

  // Validate and preview image
  const handleImagePreview = (url: string) => {
    if (!url) {
      setImagePreview("")
      setImageError(false)
      return
    }
    try {
      new URL(url)
      setImagePreview(url)
      setImageError(false)
    } catch {
      setImageError(true)
      setImagePreview("")
    }
  }

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true)
      const { error } = await authClient.signUp.email(values)
      if (error) throw new Error(error.message)
      router.push("/dashboard")
    } catch (error) {
      toast((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    {
      key: "step-1",
      content: (
        <>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormDescription>Your display name on Twitter 2.</FormDescription>
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
                  <Input placeholder="ex@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ),
    },
    {
      key: "step-2",
      content: (
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    type={seePassword ? "text" : "password"}
                    placeholder="******"
                    {...field}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setSeePassword((p) => !p)}
                  >
                    {seePassword ? <Eye /> : <EyeClosed />}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>Password must be at least 6 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      key: "step-3",
      content: (
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
                  <FormMessage />
                </div>
                <div className="w-16 h-16 rounded-full border overflow-hidden flex items-center justify-center">
                  {imagePreview && !imageError ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                      onLoad={() => setImageError(false)}
                    />
                  ) : (
                    <User className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
              </div>
            </FormItem>
          )}
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2">
        <Twitter className="size-6 fill-primary" />
        <h1 className="text-xl font-bold">Join Twitter 2.</h1>
        <p className="text-sm">
          Already have an account? <Link href="/sign-in">Sign in</Link>
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative w-full overflow-hidden"
        >
          <div className="h-72 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={steps[step].key}
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -200, opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full space-y-6"
              >
                {steps[step].content}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-between">
            {step > 0 && (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}

            {step < steps.length - 1 ? (
              <Button type="button" onClick={() => setStep(step + 1)}>
                Next
              </Button>
            ) : (
              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && <Spinner variant="infinite" />}
                Create Account
              </Button>
            )}
          </div>
        </form>
      </Form>

      <p className="text-xs text-center text-muted-foreground">
        By clicking continue, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
      </p>
    </div>
  )
}
