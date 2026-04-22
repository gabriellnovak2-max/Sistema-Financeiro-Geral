import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import * as db from "@/lib/db";
import type { Venda } from "@shared/schema";
import {
  ChevronLeft, ChevronRight, Package, CalendarDays,
  Clock, Flame, TrendingUp, Coffee, DollarSign, BarChart2, Grid, List
} from "lucide-react";

// PLACEHOLDER — conteúdo completo será enviado no próximo commit
export default function Calendario() {
  const { data: vendas = [] } = useQuery<Venda[]>({
    queryKey: ["/api/vendas"],
    queryFn: () => db.getVendas(),
  });
  return (
    <div className="p-6">
      <h1 style={{ color: "#34d399" }}>Calendário de Saídas</h1>
      <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Carregando visualizações... ({vendas.length} registros)</p>
    </div>
  );
}
