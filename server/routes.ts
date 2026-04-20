import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertVendaSchema, insertClienteSchema } from "@shared/schema";

export function registerRoutes(httpServer: Server, app: Express) {
  // --- VENDAS ---
  app.get("/api/vendas", async (_req, res) => {
    try {
      res.json(await storage.getVendas());
    } catch (e) {
      res.status(500).json({ error: "Erro ao buscar vendas" });
    }
  });

  app.post("/api/vendas", async (req, res) => {
    const parsed = insertVendaSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error });
    try {
      res.json(await storage.createVenda(parsed.data));
    } catch (e) {
      res.status(500).json({ error: "Erro ao criar venda" });
    }
  });

  app.patch("/api/vendas/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const updated = await storage.updateVenda(id, req.body);
      if (!updated) return res.status(404).json({ error: "Venda n\u00e3o encontrada" });
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: "Erro ao atualizar venda" });
    }
  });

  app.delete("/api/vendas/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteVenda(id);
    res.json({ ok: true });
  });

  // --- CLIENTES ---
  app.get("/api/clientes", async (_req, res) => {
    try {
      res.json(await storage.getClientes());
    } catch (e) {
      res.status(500).json({ error: "Erro ao buscar clientes" });
    }
  });

  app.post("/api/clientes", async (req, res) => {
    const parsed = insertClienteSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error });
    try {
      res.json(await storage.createCliente(parsed.data));
    } catch (e) {
      res.status(500).json({ error: "Erro ao criar cliente" });
    }
  });

  app.patch("/api/clientes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const updated = await storage.updateCliente(id, req.body);
      if (!updated) return res.status(404).json({ error: "Cliente n\u00e3o encontrado" });
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: "Erro ao atualizar cliente" });
    }
  });

  app.delete("/api/clientes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteCliente(id);
    res.json({ ok: true });
  });

  // --- STATS / DASHBOARD ---
  app.get("/api/stats", async (_req, res) => {
    try {
      res.json(await storage.getStats());
    } catch (e) {
      res.status(500).json({ error: "Erro ao buscar estat\u00edsticas" });
    }
  });

  // --- SEED ---
  app.post("/api/seed", async (_req, res) => {
    const vendasIniciais: any[] = [];
    try {
      const existentes = await storage.getVendas();
      if (existentes.length > 0) {
        return res.json({ message: "Dados j\u00e1 existem", count: existentes.length });
      }
      let count = 0;
      for (const v of vendasIniciais) {
        try {
          await storage.createVenda(v as any);
          count++;
        } catch (e) {
          // continua
        }
      }
      res.json({ message: `${count} vendas importadas com sucesso!` });
    } catch (e) {
      res.status(500).json({ error: "Erro no seed" });
    }
  });
}
