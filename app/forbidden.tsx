"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="max-w-md w-full shadow-lg border">
        <CardHeader>
          <CardTitle className="text-3xl text-red-500 font-extrabold">403 Não autorizado</CardTitle>
          <CardDescription>
            Você não tem autorização para acessar essa página
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Link href="/sign-in" className="w-full">
            <Button variant="outline" size={'lg'} className="w-full">Entrar</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
