import { pgTable, text, doublePrecision, integer, boolean, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clientes = pgTable("clientes", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  cpfCnpj: text("cpf_cnpj"),
  telefone: text("telefone"),
  endereco: text("endereco"),
});

export const vendas = pgTable("vendas", {
  id: serial("id").primaryKey(),
  data: text("data").notNull(),
  marca: text("marca").notNull(),
  tipoProduto: text("tipo_produto").notNull(),
  pesoPacote: text("peso_pacote").notNull(),
  quantidadeKg: doublePrecision("quantidade_kg").notNull(),
  precoKg: doublePrecision("preco_kg"),
  valorTotal: doublePrecision("valor_total"),
  formaPagamento: text("forma_pagamento"),
  statusPagamento: text("status_pagamento").notNull().default("pendente"),
  clienteNome: text("cliente_nome"),
  clienteId: integer("cliente_id"),
  emitirNota: boolean("emitir_nota").default(false),
  observacoes: text("observacoes"),
  parcelas: text("parcelas"),
});

export const insertClienteSchema = createInsertSchema(clientes).omit({ id: true });
export const insertVendaSchema = createInsertSchema(vendas).omit({ id: true });

export type Cliente = typeof clientes.$inferSelect;
export type InsertCliente = z.infer<typeof insertClienteSchema>;
export type Venda = typeof vendas.$inferSelect;
export type InsertVenda = z.infer<typeof insertVendaSchema>;
