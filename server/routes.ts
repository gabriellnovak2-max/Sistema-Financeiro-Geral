import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertVendaSchema, insertClienteSchema } from "@shared/schema";
import { z } from "zod";

export function registerRoutes(httpServer: Server, app: Express) {
  // --- VENDAS ---
  app.get("/api/vendas", (_req, res) => {
    const vendas = storage.getVendas();
    res.json(vendas);
  });

  app.post("/api/vendas", (req, res) => {
    const parsed = insertVendaSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error });
    const venda = storage.createVenda(parsed.data);
    res.json(venda);
  });

  app.patch("/api/vendas/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const updated = storage.updateVenda(id, req.body);
    if (!updated) return res.status(404).json({ error: "Venda não encontrada" });
    res.json(updated);
  });

  app.delete("/api/vendas/:id", (req, res) => {
    const id = parseInt(req.params.id);
    storage.deleteVenda(id);
    res.json({ ok: true });
  });

  // --- CLIENTES ---
  app.get("/api/clientes", (_req, res) => {
    res.json(storage.getClientes());
  });

  app.post("/api/clientes", (req, res) => {
    const parsed = insertClienteSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error });
    res.json(storage.createCliente(parsed.data));
  });

  app.patch("/api/clientes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const updated = storage.updateCliente(id, req.body);
    if (!updated) return res.status(404).json({ error: "Cliente não encontrado" });
    res.json(updated);
  });

  app.delete("/api/clientes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    storage.deleteCliente(id);
    res.json({ ok: true });
  });

  // --- STATS / DASHBOARD ---
  app.get("/api/stats", (_req, res) => {
    res.json(storage.getStats());
  });

  // --- SEED (popular com dados do relatório) ---
  app.post("/api/seed", (_req, res) => {
    const vendasIniciais: any[] = [];

    // Verifica se já tem dados
    const existentes = storage.getVendas();
    if (existentes.length > 0) {
      return res.json({ message: "Dados já existem", count: existentes.length });
    }

    let count = 0;
    for (const v of vendasIniciais) {
      try {
        storage.createVenda(v as any);
        count++;
      } catch (e) {
        // continua
      }
    }
    res.json({ message: `${count} vendas importadas com sucesso!` });
  });
}
