import { QueryClient, QueryFunction } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.trim() || "";
const IS_LOCALHOST =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

function isLocalUrl(url: string) {
  return /https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(url.replace(/\/+$/, ""));
}

function getApiBase() {
  // If a remote page was built with a localhost API URL by mistake,
  // prefer same-origin so the app still finds its backend.
  if (API_BASE && !(isLocalUrl(API_BASE) && !IS_LOCALHOST)) {
    return API_BASE.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    return "";
  }

  if (API_BASE) return API_BASE.replace(/\/+$/, "");
  if (IS_LOCALHOST) return "";
  throw new Error(
    "VITE_API_BASE_URL is required in production. Set it to your deployed backend URL.",
  );
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const candidates = Array.from(new Set([getApiBase(), ""]));
  let lastError: unknown;
  let res: Response | null = null;

  for (const base of candidates) {
    try {
      res = await fetch(`${base}${url}`, {
        method,
        headers: data ? { "Content-Type": "application/json" } : {},
        body: data ? JSON.stringify(data) : undefined,
      });
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!res) {
    throw lastError instanceof Error ? lastError : new Error("Falha ao conectar com a API.");
  }

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const candidates = Array.from(new Set([getApiBase(), ""]));
    let lastError: unknown;
    let res: Response | null = null;

    for (const base of candidates) {
      try {
        res = await fetch(`${base}${queryKey.join("/")}`);
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!res) {
      throw lastError instanceof Error ? lastError : new Error("Falha ao conectar com a API.");
    }

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
