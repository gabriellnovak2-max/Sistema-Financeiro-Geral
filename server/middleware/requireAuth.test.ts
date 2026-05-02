import test from "node:test";
import assert from "node:assert/strict";
import type { NextFunction, Response } from "express";
import {
  createRequireAuth,
  getAuthorizedUserEmails,
  isAuthorizedUserEmail,
  type AuthenticatedRequest,
} from "./requireAuth";

function createMockResponse() {
  let statusCode: number | undefined;
  let jsonBody: unknown;

  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(body: unknown) {
      jsonBody = body;
      return this;
    },
  } as Partial<Response>;

  return {
    res: res as Response,
    get statusCode() {
      return statusCode;
    },
    get jsonBody() {
      return jsonBody;
    },
  };
}

function createRequest(authorization?: string) {
  return {
    headers: authorization ? { authorization } : {},
  } as AuthenticatedRequest;
}

test("getAuthorizedUserEmails normalizes explicit env list", () => {
  const emails = getAuthorizedUserEmails(
    " GABRIELLNOVAK2@GMAIL.COM , financeiro@patrociniocafe.com.br ",
  );

  assert.deepEqual(Array.from(emails).sort(), [
    "financeiro@patrociniocafe.com.br",
    "gabriellnovak2@gmail.com",
  ]);
});

test("isAuthorizedUserEmail rejects missing emails", () => {
  assert.equal(
    isAuthorizedUserEmail(undefined, new Set(["gabriellnovak2@gmail.com"])),
    false,
  );
});

test("requireAuth returns 401 without bearer token", async () => {
  const requireAuth = createRequireAuth({
    verifyToken: async () => ({
      sub: "user-1",
      email: "gabriellnovak2@gmail.com",
      role: "authenticated",
    }),
    authorizedEmails: new Set(["gabriellnovak2@gmail.com"]),
  });
  const req = createRequest();
  const mock = createMockResponse();
  let nextCalled = false;

  await requireAuth(req, mock.res, (() => {
    nextCalled = true;
  }) as NextFunction);

  assert.equal(nextCalled, false);
  assert.equal(mock.statusCode, 401);
  assert.deepEqual(mock.jsonBody, { error: "Token ausente" });
});

test("requireAuth allows explicitly authorized owner email", async () => {
  const requireAuth = createRequireAuth({
    verifyToken: async () => ({
      sub: "user-1",
      email: "gabriellnovak2@gmail.com",
      role: "authenticated",
    }),
    authorizedEmails: new Set(["gabriellnovak2@gmail.com"]),
  });
  const req = createRequest("Bearer owner-token");
  const mock = createMockResponse();
  let nextCalled = false;

  await requireAuth(req, mock.res, (() => {
    nextCalled = true;
  }) as NextFunction);

  assert.equal(nextCalled, true);
  assert.equal(mock.statusCode, undefined);
  assert.equal(req.user?.id, "user-1");
  assert.equal(req.user?.email, "gabriellnovak2@gmail.com");
});

test("requireAuth blocks authenticated users outside allowlist", async () => {
  const requireAuth = createRequireAuth({
    verifyToken: async () => ({
      sub: "user-2",
      email: "outra-conta@exemplo.com",
      role: "authenticated",
    }),
    authorizedEmails: new Set(["gabriellnovak2@gmail.com"]),
  });
  const req = createRequest("Bearer other-user-token");
  const mock = createMockResponse();
  let nextCalled = false;

  await requireAuth(req, mock.res, (() => {
    nextCalled = true;
  }) as NextFunction);

  assert.equal(nextCalled, false);
  assert.equal(mock.statusCode, 403);
  assert.deepEqual(mock.jsonBody, {
    error: "Usuario sem permissao para acessar esta API",
  });
});
