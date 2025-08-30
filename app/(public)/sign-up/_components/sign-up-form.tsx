/* eslint-disable @next/next/no-img-element */
"use client"

import { z } from "zod"
import { Eye, EyeClosed, ShieldAlert, User } from "lucide-react"
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
import { useEffect, useState } from "react"
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
    mode: "onChange",
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
      fields: ["name", "email"],
      content: (
        <>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
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
                  <Input placeholder="ex@examplo.com" type="email" {...field} />
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
      fields: ["password"],
      content: (
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
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
              <FormDescription>Senha deve ter no mínimo 6 caracteres.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      ),
    },
    {
      key: "step-3",
      fields: ["image"],
      content: (
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da imagem de perfil (Opcional)</FormLabel>
              <div className="flex flex-col items-center gap-4">
                <div className="flex-1 w-full">
                  <FormControl className="w-full">
                    <Input
                      type="url"
                      className="w-full"
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
                <div className="w-32 h-32 rounded-full border border-primary/40 overflow-hidden flex items-center justify-center">
                  {imagePreview && !imageError ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                      onLoad={() => setImageError(false)}
                    />
                  ) : (
                    <User className="w-9 h-9 text-muted-foreground" />
                  )}
                </div>
              </div>
            </FormItem>
          )}
        />
      ),
    },
  ]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (step < steps.length - 1 && isStepValid()) {
          event.preventDefault()
          setStep((s) => s + 1)
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  })
  const isStepValid = () => {
    const currentFields = steps[step].fields as (keyof FormValues)[]
    return currentFields.every((f: keyof FormValues) => !form.formState.errors[f] && form.getValues(f))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2">
        <ShieldAlert className="size-9 fill-primary" />
        <h1 className="text-xl text-primary font-extrabold">Threat Track</h1>
        <p className="text-sm">
          Já tem uma conta? <Link href="/sign-in" className="underline">Entrar</Link>
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative w-full overflow-hidden"
        >
          <div className="flex items-center justify-center">
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

          <div className="mt-8 flex flex-col gap-2 w-full">
            {step > 0 && (
              <Button type="button" variant="outline" className="w-full" onClick={() => setStep(step - 1)}>
                Voltar
              </Button>
            )}

            {step < steps.length - 1 ? (
              <Button
                type="button"
                className="w-full"
                disabled={!isStepValid()}
                onClick={() => setStep(step + 1)}
              >
                Próximo
              </Button>
            ) : (
              <Button disabled={isLoading || !isStepValid()} type="submit" className="w-full">
                {isLoading && <Spinner variant="infinite" />}
                Criar
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
