import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/lib/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";
import Vendas from "@/pages/Vendas";
import Clientes from "@/pages/Clientes";
import Calendario from "@/pages/Calendario";
import Relatorios from "@/pages/Relatorios";
import Metas from "@/pages/Metas";
import Produtos from "@/pages/Produtos";
import Configuracoes from "@/pages/Configuracoes";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

function PrivateLayout() {
  return (
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
  );
}

function AppLayout() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/login" component={Login} />
        <Route>
          <ProtectedRoute>
            <PrivateLayout />
          </ProtectedRoute>
        </Route>
      </Switch>
    </Router>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppLayout />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
