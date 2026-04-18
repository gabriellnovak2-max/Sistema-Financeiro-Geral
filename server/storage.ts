import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, desc, between, like } from "drizzle-orm";
import { clientes, vendas, type Cliente, type InsertCliente, type Venda, type InsertVenda } from "@shared/schema";

const sqlite = new Database("valtim.db");
const db = drizzle(sqlite);

// Cria tabelas se não existirem e aplica migrations seguras
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cpf_cnpj TEXT,
    telefone TEXT,
    endereco TEXT
  );

  CREATE TABLE IF NOT EXISTS vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    marca TEXT NOT NULL,
    tipo_produto TEXT NOT NULL,
    peso_pacote TEXT NOT NULL,
    quantidade_kg REAL NOT NULL,
    preco_kg REAL,
    valor_total REAL,
    forma_pagamento TEXT,
    status_pagamento TEXT NOT NULL DEFAULT 'pendente',
    cliente_nome TEXT,
    cliente_id INTEGER,
    emitir_nota INTEGER DEFAULT 0,
    observacoes TEXT,
    parcelas TEXT
  );
`);

// Migration segura: adiciona coluna parcelas se não existir
try {
  sqlite.exec(`ALTER TABLE vendas ADD COLUMN parcelas TEXT`);
} catch (_) { /* coluna já existe */ }

export interface IStorage {
  // Vendas
  getVendas(): Venda[];
  getVenda(id: number): Venda | undefined;
  createVenda(venda: InsertVenda): Venda;
  updateVenda(id: number, venda: Partial<InsertVenda>): Venda | undefined;
  deleteVenda(id: number): void;
  // Clientes
  getClientes(): Cliente[];
  getCliente(id: number): Cliente | undefined;
  createCliente(cliente: InsertCliente): Cliente;
  updateCliente(id: number, cliente: Partial<InsertCliente>): Cliente | undefined;
  deleteCliente(id: number): void;
  // Stats
  getStats(): {
    totalVendas: number;
    totalKg: number;
    totalValor: number;
    totalPago: number;
    totalPendente: number;
    vendasPorDia: { data: string; valor: number; kg: number }[];
    vendasPorMarca: { marca: string; kg: number; valor: number }[];
    vendasPorPagamento: { forma: string; count: number; valor: number }[];
  };
}

export const storage: IStorage = {
  getVendas() {
    return db.select().from(vendas).orderBy(desc(vendas.data)).all();
  },
  getVenda(id) {
    return db.select().from(vendas).where(eq(vendas.id, id)).get();
  },
  createVenda(venda) {
    return db.insert(vendas).values(venda).returning().get();
  },
  updateVenda(id, venda) {
    return db.update(vendas).set(venda).where(eq(vendas.id, id)).returning().get();
  },
  deleteVenda(id) {
    db.delete(vendas).where(eq(vendas.id, id)).run();
  },
  getClientes() {
    return db.select().from(clientes).all();
  },
  getCliente(id) {
    return db.select().from(clientes).where(eq(clientes.id, id)).get();
  },
  createCliente(cliente) {
    return db.insert(clientes).values(cliente).returning().get();
  },
  updateCliente(id, cliente) {
    return db.update(clientes).set(cliente).where(eq(clientes.id, id)).returning().get();
  },
  deleteCliente(id) {
    db.delete(clientes).where(eq(clientes.id, id)).run();
  },
  getStats() {
    const todasVendas = db.select().from(vendas).all();
    const totalVendas = todasVendas.length;
    const totalKg = todasVendas.reduce((s, v) => s + (v.quantidadeKg || 0), 0);
    const totalValor = todasVendas.reduce((s, v) => s + (v.valorTotal || 0), 0);
    const totalPago = todasVendas.filter(v => v.statusPagamento === "pago").reduce((s, v) => s + (v.valorTotal || 0), 0);
    const totalPendente = todasVendas.filter(v => v.statusPagamento === "pendente").reduce((s, v) => s + (v.valorTotal || 0), 0);

    // Por dia
    const porDiaMap = new Map<string, { valor: number; kg: number }>();
    todasVendas.forEach(v => {
      const d = v.data.substring(0, 10);
      const cur = porDiaMap.get(d) || { valor: 0, kg: 0 };
      porDiaMap.set(d, { valor: cur.valor + (v.valorTotal || 0), kg: cur.kg + (v.quantidadeKg || 0) });
    });
    const vendasPorDia = Array.from(porDiaMap.entries())
      .map(([data, vals]) => ({ data, ...vals }))
      .sort((a, b) => a.data.localeCompare(b.data));

    // Por marca
    const porMarcaMap = new Map<string, { kg: number; valor: number }>();
    todasVendas.forEach(v => {
      const cur = porMarcaMap.get(v.marca) || { kg: 0, valor: 0 };
      porMarcaMap.set(v.marca, { kg: cur.kg + (v.quantidadeKg || 0), valor: cur.valor + (v.valorTotal || 0) });
    });
    const vendasPorMarca = Array.from(porMarcaMap.entries()).map(([marca, vals]) => ({ marca, ...vals }));

    // Por pagamento
    const porPagMap = new Map<string, { count: number; valor: number }>();
    todasVendas.forEach(v => {
      const forma = v.formaPagamento || "Não informado";
      const cur = porPagMap.get(forma) || { count: 0, valor: 0 };
      porPagMap.set(forma, { count: cur.count + 1, valor: cur.valor + (v.valorTotal || 0) });
    });
    const vendasPorPagamento = Array.from(porPagMap.entries()).map(([forma, vals]) => ({ forma, ...vals }));

    return { totalVendas, totalKg, totalValor, totalPago, totalPendente, vendasPorDia, vendasPorMarca, vendasPorPagamento };
  }
};
