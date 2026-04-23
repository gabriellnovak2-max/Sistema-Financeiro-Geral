import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { SELO_SRC } from "@/components/Sidebar";

export default function Login() {
  const [, setLocation] = useLocation();
  const { user, signIn, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      setLocation("/");
    }
  }, [loading, setLocation, user]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEntrando(true);
    setErro("");

    const { error } = await signIn(email.trim(), senha);
    if (error) {
      setErro("E-mail ou senha inválidos");
      setEntrando(false);
      return;
    }

    setLocation("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-pattern" />
      <div className="grid-lines" />
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto" style={{ width: 72, height: 72 }}>
            <img src={SELO_SRC} alt="Patrocínio Café" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <CardTitle style={{ color: "hsl(158,84%,75%)" }}>Sistema Financeiro Geral</CardTitle>
          <CardDescription>Entre para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="senha" className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
                Senha
              </label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {erro ? (
              <p className="text-sm" style={{ color: "#f87171" }}>
                {erro}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={entrando}>
              {entrando ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
