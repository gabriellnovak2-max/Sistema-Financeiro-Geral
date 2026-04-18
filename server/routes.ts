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
    const vendasIniciais = [
      // FEVEREIRO 2026
      { data: "2026-02-02", marca: "JFull", tipoProduto: "Transparente 500g", pesoPacote: "500g", quantidadeKg: 50, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Maria Serva", observacoes: "Entregue no local distribuidora" },
      { data: "2026-02-02", marca: "JFoff", tipoProduto: "JFoff 500g", pesoPacote: "500g", quantidadeKg: 6, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Sr. Sergio RT" },
      { data: "2026-02-02", marca: "JFoff", tipoProduto: "JFoff 250g", pesoPacote: "250g", quantidadeKg: 5, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Sr. Sergio RT" },
      { data: "2026-02-02", marca: "Moído no Lara", tipoProduto: "Moído no Lara", pesoPacote: "1kg", quantidadeKg: 1, precoKg: 48, valorTotal: 48, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Ana Lucia Cardoso" },
      { data: "2026-02-02", marca: "Moído no Lara", tipoProduto: "Moído no Lara", pesoPacote: "1kg", quantidadeKg: 1, precoKg: 48, valorTotal: 48, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Lucimilde Maria da Silva" },
      { data: "2026-02-03", marca: "Fireh", tipoProduto: "Fireh 250g", pesoPacote: "250g", quantidadeKg: 5, precoKg: 52, valorTotal: 260, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Furian / Oavi" },
      { data: "2026-02-03", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 15, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Ticon Giornio / Obbaly" },
      { data: "2026-02-03", marca: "Transparente", tipoProduto: "Transparente 500g", pesoPacote: "500g", quantidadeKg: 11, precoKg: null, valorTotal: 46, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Cleiton Neapolis" },
      { data: "2026-02-03", marca: "Unido Claro", tipoProduto: "Unido no Lucro", pesoPacote: "500g", quantidadeKg: 0.5, precoKg: 48, valorTotal: 24, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Ijodaro" },
      { data: "2026-02-04", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 21, precoKg: null, valorTotal: 5200, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Restaurante Soba Caseiro" },
      { data: "2026-02-05", marca: "Transparente", tipoProduto: "Transparente 500g", pesoPacote: "500g", quantidadeKg: 5, precoKg: 45, valorTotal: 225, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Marcos Assunção" },
      { data: "2026-02-05", marca: "Transparente", tipoProduto: "Transparente 500g", pesoPacote: "500g", quantidadeKg: 10, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Cliente via Gabriel" },
      { data: "2026-02-06", marca: "JFull", tipoProduto: "JFull 500g", pesoPacote: "500g", quantidadeKg: 10, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Arthur Freitas" },
      { data: "2026-02-06", marca: "JFull", tipoProduto: "JFull 500g", pesoPacote: "500g", quantidadeKg: 5, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Davi e Vitor - Avulso" },
      { data: "2026-02-10", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 81, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Cibelly/Junior - Avulso" },
      { data: "2026-02-10", marca: "Transparente", tipoProduto: "Transparente 500g", pesoPacote: "500g", quantidadeKg: 4.5, precoKg: null, valorTotal: 302.50, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Cleiton Versales" },
      { data: "2026-02-11", marca: "Transparente", tipoProduto: "Transparente 500g", pesoPacote: "500g", quantidadeKg: 5, precoKg: null, valorTotal: 3550, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Marcos Assunção", observacoes: "Pagamento 7 dias" },
      { data: "2026-02-11", marca: "Unido Claro", tipoProduto: "Unido no Claro", pesoPacote: "1kg", quantidadeKg: 1, precoKg: 60, valorTotal: 60, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "T. Norte Transportadora" },
      { data: "2026-02-12", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 15, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Brasil Fit" },
      { data: "2026-02-13", marca: "Fireh", tipoProduto: "Grão Torrado 14+", pesoPacote: "1kg", quantidadeKg: 7, precoKg: null, valorTotal: 380, formaPagamento: "dinheiro", statusPagamento: "pago", clienteNome: "Cleiton Vendedor" },
      { data: "2026-02-13", marca: "Fireh", tipoProduto: "Fireh 250g", pesoPacote: "250g", quantidadeKg: 31, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Cleiton Vendedor" },
      { data: "2026-02-13", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 30, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Cleiton Vendedor" },
      { data: "2026-02-13", marca: "Fireh", tipoProduto: "Grão Torrado 14+", pesoPacote: "1kg", quantidadeKg: 45, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Cleiton Vendedor" },
      { data: "2026-02-13", marca: "Fireh", tipoProduto: "Torrado 500g", pesoPacote: "500g", quantidadeKg: 5, precoKg: null, valorTotal: 50, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Vivicos Especiais" },
      { data: "2026-02-13", marca: "Fireh", tipoProduto: "Fireh 250g", pesoPacote: "250g", quantidadeKg: 1, precoKg: null, valorTotal: 50, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Vivicos Especiais" },
      { data: "2026-02-18", marca: "Fireh", tipoProduto: "Fireh 250g", pesoPacote: "250g", quantidadeKg: 5, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Davi e Victor - Avulso" },
      { data: "2026-02-18", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 10, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Davi e Victor - Avulso" },
      { data: "2026-02-18", marca: "Fireh", tipoProduto: "Fireh 250g", pesoPacote: "250g", quantidadeKg: 1, precoKg: 45, valorTotal: 45, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Marcos Assunção" },
      { data: "2026-02-19", marca: "Transparente", tipoProduto: "Transparente 500g", pesoPacote: "500g", quantidadeKg: 3, precoKg: 45, valorTotal: 135, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Marco Assunção" },
      { data: "2026-02-19", marca: "Fireh", tipoProduto: "Fireh 250g", pesoPacote: "250g", quantidadeKg: 0.5, precoKg: 50, valorTotal: 25, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Rogério Santiago" },
      { data: "2026-02-20", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 10, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Parque Tinsol / Cibelly" },
      { data: "2026-02-20", marca: "Fireh", tipoProduto: "Fireh 250g", pesoPacote: "250g", quantidadeKg: 1, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Davi e Victor - Avulso" },
      { data: "2026-02-23", marca: "Fireh", tipoProduto: "Torrado 900", pesoPacote: "1kg", quantidadeKg: 5, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Mercado Farminalis", observacoes: "Troca de produto" },
      { data: "2026-02-23", marca: "Fireh", tipoProduto: "Fireh 250g", pesoPacote: "250g", quantidadeKg: 0.5, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Cleiton Vendedor - Amostra" },
      { data: "2026-02-23", marca: "Unido Claro", tipoProduto: "Unido no Claro", pesoPacote: "500g", quantidadeKg: 0.5, precoKg: 48, valorTotal: 24, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Gonçalves" },
      { data: "2026-02-23", marca: "Unido Claro", tipoProduto: "Unido no Claro", pesoPacote: "1kg", quantidadeKg: 1, precoKg: 48, valorTotal: 48, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Zetta" },
      { data: "2026-02-24", marca: "T. Norte", tipoProduto: "Moído no Hora", pesoPacote: "500g", quantidadeKg: 0.5, precoKg: 60, valorTotal: 30, formaPagamento: "dinheiro", statusPagamento: "pago", clienteNome: "T. Norte Transportadora" },
      { data: "2026-02-24", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 15, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Isbis T-Shirt" },
      { data: "2026-02-24", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 10, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Talledo Sports" },
      { data: "2026-02-24", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 15, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Teccon S/A Construção" },
      { data: "2026-02-25", marca: "Transparente", tipoProduto: "Transparente 500g", pesoPacote: "500g", quantidadeKg: 4, precoKg: 45, valorTotal: 180, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Marco Assunção" },
      { data: "2026-02-25", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 20, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Licitação Prefeitura Cabaceira" },
      { data: "2026-02-25", marca: "Fireh", tipoProduto: "Fireh 250g - Amostra", pesoPacote: "250g", quantidadeKg: 0.75, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Sergio - Licitação Amostra" },
      { data: "2026-02-25", marca: "Fireh", tipoProduto: "Fireh 250g", pesoPacote: "250g", quantidadeKg: 5, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Davi - Avulso" },
      { data: "2026-02-26", marca: "Fireh", tipoProduto: "Fireh 250g", pesoPacote: "250g", quantidadeKg: 15, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Cleyton" },
      { data: "2026-02-26", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 15, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Cleyton" },
      { data: "2026-02-26", marca: "Transparente", tipoProduto: "Transparente 500g", pesoPacote: "500g", quantidadeKg: 5, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Euliso Torrador" },
      { data: "2026-02-27", marca: "Fireh", tipoProduto: "Fireh 250g", pesoPacote: "250g", quantidadeKg: 30, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Davi e Cibelly - Avulso" },
      { data: "2026-02-27", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 6.5, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Davi e Cibelly - Avulso" },
      { data: "2026-02-27", marca: "Moído", tipoProduto: "Moído no Hora", pesoPacote: "1kg", quantidadeKg: 2, precoKg: 48, valorTotal: 96, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Valter Metrópolis" },
      { data: "2026-02-27", marca: "Fireh", tipoProduto: "Fireh 250g", pesoPacote: "250g", quantidadeKg: 5, precoKg: 50, valorTotal: 250, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Davi - Avulso" },
      { data: "2026-02-27", marca: "Fireh", tipoProduto: "Fireh 250g", pesoPacote: "250g", quantidadeKg: 0.5, precoKg: 48, valorTotal: 24, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Valter Metrópolis" },
      { data: "2026-02-27", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 2, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Davi - Avulso" },
      // MARÇO 2026
      { data: "2026-03-02", marca: "Fireh", tipoProduto: "Fireh 250g", pesoPacote: "250g", quantidadeKg: 5, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Davi e Victor - Avulso" },
      { data: "2026-03-02", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 10, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Davi e Victor - Avulso" },
      { data: "2026-03-02", marca: "Moído", tipoProduto: "Moído no Hora", pesoPacote: "1kg", quantidadeKg: 1, precoKg: 60, valorTotal: 60, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "T. Norte Transportadora" },
      { data: "2026-03-02", marca: "Moído", tipoProduto: "Moído no Hora", pesoPacote: "1kg", quantidadeKg: 1, precoKg: 48, valorTotal: 48, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Izodoro Valter" },
      { data: "2026-03-02", marca: "Moído", tipoProduto: "Moído no Hora", pesoPacote: "500g", quantidadeKg: 0.5, precoKg: 48, valorTotal: 24, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Izodoro Valter" },
      { data: "2026-03-02", marca: "Moído", tipoProduto: "Moído no Hora", pesoPacote: "1kg", quantidadeKg: 1, precoKg: 48, valorTotal: 48, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Valter" },
      { data: "2026-03-02", marca: "Grão Torrado", tipoProduto: "Grão Torrado 14+", pesoPacote: "1kg", quantidadeKg: 1, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Salvador", observacoes: "Doação pelo Gabriel" },
      { data: "2026-03-03", marca: "Moído", tipoProduto: "Moído no Hora", pesoPacote: "500g", quantidadeKg: 0.5, precoKg: 48, valorTotal: 24, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Izodoro Valter" },
      { data: "2026-03-04", marca: "Fireh", tipoProduto: "Fireh 250g", pesoPacote: "250g", quantidadeKg: 10, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Cleiton Vindel" },
      { data: "2026-03-04", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 10, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Cleiton Vindel" },
      { data: "2026-03-05", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 40, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Gustavo - Transportadora Cibelly" },
      { data: "2026-03-05", marca: "Fireh", tipoProduto: "Fireh 250g", pesoPacote: "250g", quantidadeKg: 20, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Caliu Filho / Sr. Alexandre" },
      { data: "2026-03-05", marca: "Transparente", tipoProduto: "Transparente 500g", pesoPacote: "500g", quantidadeKg: 10, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Euliso Torrador" },
      { data: "2026-03-05", marca: "Fireh", tipoProduto: "Fireh 250g", pesoPacote: "250g", quantidadeKg: 10, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Cleiton" },
      { data: "2026-03-05", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 10, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Cleiton" },
      { data: "2026-03-06", marca: "Torrado Moído 14+", tipoProduto: "Torrado e Moído 14+", pesoPacote: "1kg", quantidadeKg: 10, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Euliso Torrador" },
      { data: "2026-03-15", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 15, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Texcon Construtora" },
      { data: "2026-03-15", marca: "Moído", tipoProduto: "Moído 14+ Claro", pesoPacote: "500g", quantidadeKg: 0.5, precoKg: 48, valorTotal: 24, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Marcelo Neópolis" },
      { data: "2026-03-15", marca: "Moído", tipoProduto: "Moído 14+ Claro", pesoPacote: "1kg", quantidadeKg: 1, precoKg: 48, valorTotal: 48, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Cliente Neópolis" },
      { data: "2026-03-15", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 6, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Davi - Avulso" },
      { data: "2026-03-17", marca: "Grão Torrado", tipoProduto: "Grão Torrado 14+", pesoPacote: "1kg", quantidadeKg: 5, precoKg: 500, valorTotal: 2500, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "João Luiz" },
      { data: "2026-03-17", marca: "Moído Claro", tipoProduto: "Moído no Claro", pesoPacote: "500g", quantidadeKg: 0.5, precoKg: 48, valorTotal: 24, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Marcelo" },
      { data: "2026-03-17", marca: "Moído Claro", tipoProduto: "Moído no Claro", pesoPacote: "1kg", quantidadeKg: 11, precoKg: null, valorTotal: 48, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Lucineide" },
      { data: "2026-03-17", marca: "Frut", tipoProduto: "Frut 250g", pesoPacote: "250g", quantidadeKg: 5, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Davi - Avulso" },
      { data: "2026-03-18", marca: "Grão Torrado", tipoProduto: "Grão Torrado 14+", pesoPacote: "1kg", quantidadeKg: 25, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Fabio / Cibelly" },
      { data: "2026-03-18", marca: "Frut", tipoProduto: "Frut 250g", pesoPacote: "250g", quantidadeKg: 33, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Toacilo / Integra" },
      { data: "2026-03-18", marca: "Moído Claro", tipoProduto: "Moído no Claro", pesoPacote: "500g", quantidadeKg: 0.5, precoKg: 48, valorTotal: 24, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Roberto Valle" },
      { data: "2026-03-18", marca: "Moído Claro", tipoProduto: "Moído no Claro", pesoPacote: "1kg", quantidadeKg: 2, precoKg: 48, valorTotal: 96, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Valle" },
      { data: "2026-03-19", marca: "Frut", tipoProduto: "Frut 250g", pesoPacote: "250g", quantidadeKg: 7, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Firmiápolis", observacoes: "Troca produto fora de padrão" },
      { data: "2026-03-19", marca: "Moído Claro", tipoProduto: "Moído no Claro", pesoPacote: "500g", quantidadeKg: 0.5, precoKg: 48, valorTotal: 24, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Valle" },
      { data: "2026-03-20", marca: "Frut", tipoProduto: "Frut 500g", pesoPacote: "500g", quantidadeKg: 10, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Odontologia / Ebelly" },
      { data: "2026-03-20", marca: "Frut", tipoProduto: "Frut 250g", pesoPacote: "250g", quantidadeKg: 2.5, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Ebelly" },
      { data: "2026-03-20", marca: "Frut", tipoProduto: "Frut 250g", pesoPacote: "250g", quantidadeKg: 10, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Ebelly" },
      { data: "2026-03-20", marca: "Frut", tipoProduto: "Frut 500g", pesoPacote: "500g", quantidadeKg: 30, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Brasil Fil" },
      { data: "2026-03-20", marca: "Frut", tipoProduto: "Frut 500g", pesoPacote: "500g", quantidadeKg: 10, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Itelalo Wert" },
      { data: "2026-03-20", marca: "Frut", tipoProduto: "Frut 500g", pesoPacote: "500g", quantidadeKg: 2, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Inebiano Fred Romar" },
      { data: "2026-03-20", marca: "Moído Claro", tipoProduto: "Moído no Claro", pesoPacote: "1kg", quantidadeKg: 11, precoKg: null, valorTotal: 48, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Izadora Valle" },
      { data: "2026-03-20", marca: "Grão Torrado", tipoProduto: "Grão Torrado 14+", pesoPacote: "1kg", quantidadeKg: 50, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Cleiton / Cbelly" },
      { data: "2026-03-20", marca: "Pergamon", tipoProduto: "Pergamon Rimian", pesoPacote: "1kg", quantidadeKg: 10, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Cliente" },
      { data: "2026-03-20", marca: "Frut", tipoProduto: "Frut 500g", pesoPacote: "500g", quantidadeKg: 2.5, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Vitória Brasília / Cbelly" },
      { data: "2026-03-24", marca: "Frut", tipoProduto: "Frut 250g", pesoPacote: "250g", quantidadeKg: 11.5, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Vendas Avulso" },
      { data: "2026-03-24", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 15, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Vendas Avulso" },
      { data: "2026-03-24", marca: "Transparente", tipoProduto: "Transparente 500g", pesoPacote: "500g", quantidadeKg: 1.5, precoKg: 45, valorTotal: 67.50, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Cels Neópolis" },
      { data: "2026-03-24", marca: "Moído", tipoProduto: "Moído 14+ Claro", pesoPacote: "1kg", quantidadeKg: 1, precoKg: 48, valorTotal: 48, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Valta" },
      { data: "2026-03-26", marca: "Fireh", tipoProduto: "Fireh 500g", pesoPacote: "500g", quantidadeKg: 9, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Davi e Vitor - Avulso" },
      { data: "2026-03-26", marca: "Moído", tipoProduto: "Moído 14+ Claro", pesoPacote: "1kg", quantidadeKg: 1, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Izadora Neópolis" },
      { data: "2026-03-27", marca: "Moído", tipoProduto: "Moído 14+ Claro", pesoPacote: "1kg", quantidadeKg: 1, precoKg: 46, valorTotal: 46, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Cliente" },
      { data: "2026-03-27", marca: "Moído", tipoProduto: "Moído 14+ Claro", pesoPacote: "500g", quantidadeKg: 0.5, precoKg: 48, valorTotal: 24, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Izadora" },
      { data: "2026-03-27", marca: "Frut", tipoProduto: "Frut 250g", pesoPacote: "250g", quantidadeKg: 20, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Restaurante Tropical Ale" },
      { data: "2026-03-27", marca: "Frut", tipoProduto: "Frut 250g", pesoPacote: "250g", quantidadeKg: 24, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Vendas Avulso" },
      { data: "2026-03-27", marca: "Transparente", tipoProduto: "Transparente 500g", pesoPacote: "500g", quantidadeKg: 5, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Julio Torrados" },
      { data: "2026-03-30", marca: "Moído", tipoProduto: "Moído no Claro", pesoPacote: "500g", quantidadeKg: 0.5, precoKg: 48, valorTotal: 24, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Izadora Neópolis" },
      { data: "2026-03-30", marca: "Transparente", tipoProduto: "Transparente 500g", pesoPacote: "500g", quantidadeKg: 13.5, precoKg: null, valorTotal: 600, formaPagamento: "dinheiro", statusPagamento: "pago", clienteNome: "Salvador" },
      { data: "2026-03-31", marca: "Moído", tipoProduto: "Moído no Claro", pesoPacote: "1kg", quantidadeKg: 1, precoKg: 48, valorTotal: 48, formaPagamento: "pix", statusPagamento: "pago", clienteNome: "Izadora Neópolis" },
      // ABRIL 2026
      { data: "2026-04-01", marca: "Fiot", tipoProduto: "Fiot 500g", pesoPacote: "500g", quantidadeKg: 25, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Vendas Avulso" },
      { data: "2026-04-01", marca: "Fiot", tipoProduto: "Fiot 250g", pesoPacote: "250g", quantidadeKg: 5, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Vendas Avulso" },
      { data: "2026-04-01", marca: "Transparente", tipoProduto: "Transparente 500g", pesoPacote: "500g", quantidadeKg: 0.5, precoKg: null, valorTotal: 54, formaPagamento: "dinheiro", statusPagamento: "pago", clienteNome: "Cliente - Pote" },
      { data: "2026-04-02", marca: "Transparente", tipoProduto: "Transparente 500g", pesoPacote: "500g", quantidadeKg: 5, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Torrados" },
      { data: "2026-04-02", marca: "Fiot", tipoProduto: "Fiot 500g", pesoPacote: "500g", quantidadeKg: 20, precoKg: null, valorTotal: null, formaPagamento: null, statusPagamento: "pendente", clienteNome: "Vendas Avulso" },
    ];

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
