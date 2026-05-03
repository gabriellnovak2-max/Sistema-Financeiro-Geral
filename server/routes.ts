import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertVendaSchema, insertClienteSchema } from "@shared/schema";
import type { AuthenticatedRequest } from "./middleware/requireAuth";

const patchVendaSchema = insertVendaSchema.partial();
const patchClienteSchema = insertClienteSchema.partial();

export function registerRoutes(httpServer: Server, app: Express) {
  app.get("/api/vendas", async (req: AuthenticatedRequest, res) => {
    if (!req.user?.id) return res.status(401).json({ error: "Usuário não autenticado" });
    try {
      res.json(await storage.getVendas({ userId: req.user.id, empresaId: req.user.empresaId }));
    } catch (e) {
      res.status(500).json({ error: "Erro ao buscar vendas" });
    }
  });
  app.post("/api/vendas", async (req: AuthenticatedRequest, res) => {
    if (!req.user?.id) return res.status(401).json({ error: "Usuário não autenticado" });
    const parsed = insertVendaSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error });
    try {
      res.json(await storage.createVenda({ userId: req.user.id, empresaId: req.user.empresaId }, parsed.data));
    } catch (e) {
      res.status(500).json({ error: "Erro ao criar venda" });
    }
  });
  app.patch("/api/vendas/:id", async (req: AuthenticatedRequest, res) => {
    if (!req.user?.id) return res.status(401).json({ error: "Usuário não autenticado" });
    const rawId = req.params.id;
    const id = parseInt(Array.isArray(rawId) ? rawId[0] : rawId, 10);
    const parsed = patchVendaSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Dados inválidos", issues: parsed.error.issues });
    }
    try {
      const updated = await storage.updateVenda({ userId: req.user.id, empresaId: req.user.empresaId }, id, parsed.data);
      if (!updated) return res.status(404).json({ error: "Venda n\u00e3o encontrada" });
      res.json(updated);
    } catch (e) { res.status(500).json({ error: "Erro ao atualizar venda" }); }
  });
  app.delete("/api/vendas/:id", async (req: AuthenticatedRequest, res) => {
    if (!req.user?.id) return res.status(401).json({ error: "Usuário não autenticado" });
    const rawId = req.params.id;
    const id = parseInt(Array.isArray(rawId) ? rawId[0] : rawId, 10);
    await storage.deleteVenda({ userId: req.user.id, empresaId: req.user.empresaId }, id);
    res.json({ ok: true });
  });
  app.get("/api/clientes", async (req: AuthenticatedRequest, res) => {
    if (!req.user?.id) return res.status(401).json({ error: "Usuário não autenticado" });
    try {
      res.json(await storage.getClientes({ userId: req.user.id, empresaId: req.user.empresaId }));
    } catch (e) {
      res.status(500).json({ error: "Erro ao buscar clientes" });
    }
  });
  app.post("/api/clientes", async (req: AuthenticatedRequest, res) => {
    if (!req.user?.id) return res.status(401).json({ error: "Usuário não autenticado" });
    const parsed = insertClienteSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error });
    try {
      res.json(await storage.createCliente({ userId: req.user.id, empresaId: req.user.empresaId }, parsed.data));
    } catch (e) {
      res.status(500).json({ error: "Erro ao criar cliente" });
    }
  });
  app.patch("/api/clientes/:id", async (req: AuthenticatedRequest, res) => {
    if (!req.user?.id) return res.status(401).json({ error: "Usuário não autenticado" });
    const rawId = req.params.id;
    const id = parseInt(Array.isArray(rawId) ? rawId[0] : rawId, 10);
    const parsed = patchClienteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Dados inválidos", issues: parsed.error.issues });
    }
    try {
      const updated = await storage.updateCliente({ userId: req.user.id, empresaId: req.user.empresaId }, id, parsed.data);
      if (!updated) return res.status(404).json({ error: "Cliente n\u00e3o encontrado" });
      res.json(updated);
    } catch (e) { res.status(500).json({ error: "Erro ao atualizar cliente" }); }
  });
  app.delete("/api/clientes/:id", async (req: AuthenticatedRequest, res) => {
    if (!req.user?.id) return res.status(401).json({ error: "Usuário não autenticado" });
    const rawId = req.params.id;
    const id = parseInt(Array.isArray(rawId) ? rawId[0] : rawId, 10);
    await storage.deleteCliente({ userId: req.user.id, empresaId: req.user.empresaId }, id);
    res.json({ ok: true });
  });
  app.get("/api/stats", async (req: AuthenticatedRequest, res) => {
    if (!req.user?.id) return res.status(401).json({ error: "Usuário não autenticado" });
    try {
      res.json(await storage.getStats({ userId: req.user.id, empresaId: req.user.empresaId }));
    } catch (e) {
      res.status(500).json({ error: "Erro ao buscar estat\u00edsticas" });
    }
  });
  app.post("/api/seed", async (req: AuthenticatedRequest, res) => {
    if (!req.user?.id) return res.status(401).json({ error: "Usuário não autenticado" });
    try {
      const existentes = await storage.getVendas({ userId: req.user.id, empresaId: req.user.empresaId });
      if (existentes.length > 0) return res.json({ message: "Dados j\u00e1 existem", count: existentes.length });
      res.status(410).json({
        error: "Seed desativado",
        message: "Os dados antigos foram descartados de proposito. O sistema esta comecando limpo.",
      });
    } catch (e) { res.status(500).json({ error: "Erro no seed" }); }
  });
}
