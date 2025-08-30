"use client"

import { z } from "zod"
import { Eye, EyeClosed, Twitter } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Spinner } from "@/components/ui/kibo-ui/spinner"

const formSchema = z.object({
  email: z.email(),
  password: z.string(),
  rememberMe: z.boolean()
})


export function SignInForm({}) {
  const [seePassword, setSeePassword] = useState<boolean>(false)
  const [isLoading, setIsloading] = useState<boolean>(false)

  const router = useRouter()

   // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      email,
      password,
      rememberMe
    } = values
    try {
      setIsloading(true)

      const {error} = await authClient.signIn.email({
        email,
        password,
        rememberMe
      });
      if(error) throw new Error(error.message)
      router.push("/dashboard")
    } catch (error) {
      toast((error as Error).message)
    } finally {
      setIsloading(false)
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
              <span className="sr-only">Threat Track</span>
            </div>
            <h1 className="text-xl font-bold">Bem-vindo ao <span className="text-orange-400">Threat Track</span></h1>
            <div className="text-center text-sm">
              Não possui uma conta?{" "}
              <Link href="/sign-up" className="underline underline-offset-4">
                Inscrever-se
              </Link>
            </div>
          </div>
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
                <FormLabel>Senha</FormLabel>
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
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    Remember me?
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit" className="w-full cursor-pointer">
            {isLoading && <Spinner variant="infinite"/>}
            Sign-in
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
