import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

const DEFAULT_AUTHORIZED_USER_EMAILS = ["gabriellnovak2@gmail.com"];

function getSupabaseUrl() {
  const supabaseUrl = process.env.SUPABASE_URL?.trim();

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL não definida no .env");
  }

  return supabaseUrl.replace(/\/+$/, "");
}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks() {
  if (!jwks) {
    // JWKS remoto do Supabase (chaves publicas para validar assinatura)
    jwks = createRemoteJWKSet(
      new URL(`${getSupabaseUrl()}/auth/v1/.well-known/jwks.json`),
    );
  }

  return jwks;
}

type SupabaseAccessTokenPayload = JWTPayload & {
  email?: string;
  role?: string;
};

export function getAuthorizedUserEmails(
  rawValue = process.env.AUTHORIZED_USER_EMAILS,
) {
  const source = rawValue?.trim()
    ? rawValue
    : DEFAULT_AUTHORIZED_USER_EMAILS.join(",");

  return new Set(
    source
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAuthorizedUserEmail(
  email: string | undefined,
  authorizedEmails = getAuthorizedUserEmails(),
) {
  if (!email) return false;
  return authorizedEmails.has(email.trim().toLowerCase());
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

type VerifyTokenFn = (token: string) => Promise<SupabaseAccessTokenPayload>;

async function verifySupabaseAccessToken(
  token: string,
): Promise<SupabaseAccessTokenPayload> {
  const supabaseUrl = getSupabaseUrl();
  const { payload } = await jwtVerify(token, getJwks(), {
    issuer: `${supabaseUrl}/auth/v1`,
    audience: "authenticated",
    algorithms: ["ES256"],
  });

  return payload as SupabaseAccessTokenPayload;
}

function buildAuthenticatedUser(payload: SupabaseAccessTokenPayload) {
  return {
    id: payload.sub as string,
    email: payload.email,
    role: payload.role,
  };
}

type CreateRequireAuthOptions = {
  verifyToken?: VerifyTokenFn;
  authorizedEmails?: Set<string>;
};

export function createRequireAuth({
  verifyToken = verifySupabaseAccessToken,
  authorizedEmails = getAuthorizedUserEmails(),
}: CreateRequireAuthOptions = {}) {
  return async function requireAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token ausente" });
      }

      const token = authHeader.substring(7);
      const user = buildAuthenticatedUser(await verifyToken(token));

      // Projeto monousuario: enquanto o multi-tenant nao existe,
      // a API com service role so pode aceitar o login do dono.
      if (!isAuthorizedUserEmail(user.email, authorizedEmails)) {
        console.warn(
          `[requireAuth] Usuario sem permissao: ${user.email ?? "sem email"}`,
        );
        return res
          .status(403)
          .json({ error: "Usuario sem permissao para acessar esta API" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("[requireAuth] Token inválido:", (error as Error).message);
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }
  };
}

export const requireAuth = createRequireAuth();
