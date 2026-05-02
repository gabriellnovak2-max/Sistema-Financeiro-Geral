import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

const SUPABASE_URL = process.env.SUPABASE_URL;

if (!SUPABASE_URL) {
  console.error(
    "[requireAuth] SUPABASE_URL ausente no boot. Rotas protegidas retornarão 503 até a env ser definida."
  );
}

const JWKS = SUPABASE_URL
  ? createRemoteJWKSet(new URL(`${SUPABASE_URL}/auth/v1/.well-known/jwks.json`))
  : null;

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!SUPABASE_URL || !JWKS) {
    return res.status(503).json({
      error: "Auth indisponível",
      detail: "SUPABASE_URL não configurada no servidor.",
    });
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token ausente" });
    }

    const token = authHeader.substring(7);

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `${SUPABASE_URL}/auth/v1`,
      audience: "authenticated",
      algorithms: ["ES256"],
    });

    req.user = {
      id: payload.sub as string,
      email: payload.email as string | undefined,
      role: payload.role as string | undefined,
    };

    next();
  } catch (error) {
    console.error("[requireAuth] Token inválido:", (error as Error).message);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
