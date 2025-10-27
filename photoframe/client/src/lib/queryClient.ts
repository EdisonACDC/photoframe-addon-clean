import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Convert absolute API paths to relative paths for Home Assistant Ingress compatibility
function normalizeApiUrl(url: string): string {
  // If it's already a relative URL or full URL, return as-is
  if (!url.startsWith('/')) {
    return url;
  }
  
  // Remove leading slash and make it relative
  // This ensures it works with Home Assistant Ingress paths like /api/hassio_ingress/<token>/
  return '.' + url;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options?: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
  }
): Promise<Response> {
  const { method = "GET", body, headers = {} } = options || {};
  
  const isFormData = body instanceof FormData;
  const fetchHeaders = isFormData 
    ? headers 
    : body 
    ? { "Content-Type": "application/json", ...headers }
    : headers;

  const normalizedUrl = normalizeApiUrl(url);

  const res = await fetch(normalizedUrl, {
    method,
    headers: fetchHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    const normalizedUrl = normalizeApiUrl(url);
    
    const res = await fetch(normalizedUrl, {
      credentials: "include",
    });

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
