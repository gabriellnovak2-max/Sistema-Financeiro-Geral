import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertVendaSchema, insertClienteSchema } from "@shared/schema";

const patchVendaSchema = insertVendaSchema.partial();
const patchClienteSchema = insertClienteSchema.partial();

export function registerRoutes(httpServer: Server, app: Express) {
  app.get("/api/vendas", async (_req, res) => {
    try { res.json(await storage.getVendas()); } catch (e) { res.status(500).json({ error: "Erro ao buscar vendas" }); }
  });
  app.post("/api/vendas", async (req, res) => {
    const parsed = insertVendaSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error });
    try { res.json(await storage.createVenda(parsed.data)); } catch (e) { res.status(500).json({ error: "Erro ao criar venda" }); }
  });
  app.patch("/api/vendas/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const parsed = patchVendaSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Dados inválidos", issues: parsed.error.issues });
    }
    try {
      const updated = await storage.updateVenda(id, parsed.data);
      if (!updated) return res.status(404).json({ error: "Venda n\u00e3o encontrada" });
      res.json(updated);
    } catch (e) { res.status(500).json({ error: "Erro ao atualizar venda" }); }
  });
  app.delete("/api/vendas/:id", async (req, res) => {
    await storage.deleteVenda(parseInt(req.params.id));
    res.json({ ok: true });
  });
  app.get("/api/clientes", async (_req, res) => {
    try { res.json(await storage.getClientes()); } catch (e) { res.status(500).json({ error: "Erro ao buscar clientes" }); }
  });
  app.post("/api/clientes", async (req, res) => {
    const parsed = insertClienteSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error });
    try { res.json(await storage.createCliente(parsed.data)); } catch (e) { res.status(500).json({ error: "Erro ao criar cliente" }); }
  });
  app.patch("/api/clientes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const parsed = patchClienteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Dados inválidos", issues: parsed.error.issues });
    }
    try {
      const updated = await storage.updateCliente(id, parsed.data);
      if (!updated) return res.status(404).json({ error: "Cliente n\u00e3o encontrado" });
      res.json(updated);
    } catch (e) { res.status(500).json({ error: "Erro ao atualizar cliente" }); }
  });
  app.delete("/api/clientes/:id", async (req, res) => {
    await storage.deleteCliente(parseInt(req.params.id));
    res.json({ ok: true });
  });
  app.get("/api/stats", async (_req, res) => {
    try { res.json(await storage.getStats()); } catch (e) { res.status(500).json({ error: "Erro ao buscar estat\u00edsticas" }); }
  });
  app.post("/api/seed", async (_req, res) => {
    try {
      const existentes = await storage.getVendas();
      if (existentes.length > 0) return res.json({ message: "Dados j\u00e1 existem", count: existentes.length });
      res.status(410).json({
        error: "Seed desativado",
        message: "Os dados antigos foram descartados de proposito. O sistema esta comecando limpo.",
      });
    } catch (e) { res.status(500).json({ error: "Erro no seed" }); }
  });
}
