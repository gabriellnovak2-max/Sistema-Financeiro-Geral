import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/lib/ThemeContext";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/pages/Dashboard";
import Vendas from "@/pages/Vendas";
import Clientes from "@/pages/Clientes";
import Calendario from "@/pages/Calendario";
import Relatorios from "@/pages/Relatorios";
import Metas from "@/pages/Metas";
import Produtos from "@/pages/Produtos";
import Configuracoes from "@/pages/Configuracoes";
import NotFound from "@/pages/not-found";

function AppLayout() {
  return (
    <Router hook={useHashLocation}>
      <div className="flex h-screen overflow-hidden">
        <div className="bg-pattern" />
        <div className="grid-lines" />
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/vendas" component={Vendas} />
            <Route path="/clientes" component={Clientes} />
            <Route path="/calendario" component={Calendario} />
            <Route path="/relatorios" component={Relatorios} />
            <Route path="/metas" component={Metas} />
            <Route path="/produtos" component={Produtos} />
            <Route path="/configuracoes" component={Configuracoes} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppLayout />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
