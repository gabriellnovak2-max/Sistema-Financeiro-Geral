import assert from "node:assert/strict";
import test from "node:test";

const originalConsoleError = console.error;
console.error = () => {};
const { buildScopeFilter } = await import("./storage.ts");
console.error = originalConsoleError;

test("mantem user_id mesmo quando empresa_id existe", () => {
  assert.equal(
    buildScopeFilter({
      userId: "user-123",
      empresaId: "empresa-456",
    }),
    "empresa_id.eq.empresa-456,user_id.eq.user-123,and(user_id.is.null,empresa_id.is.null)",
  );
});

test("faz fallback para user_id quando token nao tem empresa", () => {
  assert.equal(
    buildScopeFilter({
      userId: "user-123",
    }),
    "user_id.eq.user-123,and(user_id.is.null,empresa_id.is.null)",
  );
});
