import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tabela de clientes
export const clientes = sqliteTable("clientes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  cpfCnpj: text("cpf_cnpj"),
  telefone: text("telefone"),
  endereco: text("endereco"),
});

// Tabela de vendas
export const vendas = sqliteTable("vendas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  data: text("data").notNull(), // ISO date string
  marca: text("marca").notNull(),
  tipoProduto: text("tipo_produto").notNull(), // ex: "Fireh 500g", "Moído no Hora"
  pesoPacote: text("peso_pacote").notNull(), // ex: "500g", "250g", "1kg"
  quantidadeKg: real("quantidade_kg").notNull(),
  precoKg: real("preco_kg"),
  valorTotal: real("valor_total"),
  formaPagamento: text("forma_pagamento"), // pix, dinheiro, cartao, boleto, pendente
  statusPagamento: text("status_pagamento").notNull().default("pendente"), // pago, pendente, parcial
  clienteNome: text("cliente_nome"),
  clienteId: integer("cliente_id"),
  emitirNota: integer("emitir_nota", { mode: "boolean" }).default(false),
  observacoes: text("observacoes"),
  parcelas: text("parcelas"), // JSON string: [{dias: number, valor: number, dataVenc: string}]
});

// Schemas de inserção
export const insertClienteSchema = createInsertSchema(clientes).omit({ id: true });
export const insertVendaSchema = createInsertSchema(vendas).omit({ id: true });

// Tipos
export type Cliente = typeof clientes.$inferSelect;
export type InsertCliente = z.infer<typeof insertClienteSchema>;
export type Venda = typeof vendas.$inferSelect;
export type InsertVenda = z.infer<typeof insertVendaSchema>;
