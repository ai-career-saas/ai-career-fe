import axios, { AxiosInstance } from "axios";

const NEST_URL =
  process.env.NEXT_PUBLIC_NEST_API_URL || "http://localhost:4000";

let refreshing = false;
let refreshPromise: Promise<string> | null = null;

export function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: NEST_URL,
    timeout: 300_000, // 5 min for AI calls
    withCredentials: true
  });

  client.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ai-career-auth");
      if (stored) {
        const { state } = JSON.parse(stored);
        if (state?.accessToken) {
          config.headers.Authorization = `Bearer ${state.accessToken}`;
        }
      }
    }
    return config;
  });

  client.interceptors.response.use(
    (r) => r,
    async (error) => {
      const original = error.config;
      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;

        if (!refreshing) {
          refreshing = true;
          refreshPromise = (async () => {
            const stored = localStorage.getItem("ai-career-auth");
            if (!stored) throw new Error("No stored auth");
            const { state } = JSON.parse(stored);
            const { data } = await axios.post(`${NEST_URL}/auth/refresh`, {
              refresh_token: state.refreshToken,
            });

            // Update store
            const parsed = JSON.parse(stored);
            parsed.state.accessToken = data.access_token;
            parsed.state.refreshToken = data.refresh_token;
            localStorage.setItem("ai-career-auth", JSON.stringify(parsed));

            refreshing = false;
            return data.access_token;
          })();
        }

        const newToken = await refreshPromise!;
        original.headers.Authorization = `Bearer ${newToken}`;
        return client(original);
      }
      return Promise.reject(error);
    }
  );

  return client;
}

export const api = createApiClient();

// ── Auth ─────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; name: string; password: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

// ── Plans ─────────────────────────────────────────────────────────────────
export const plansApi = {
  getAll: () => api.get("/plans"),
};

// ── Billing ───────────────────────────────────────────────────────────────
export const billingApi = {
  subscribe: (planId: string) => api.post("/billing/subscribe", { planId }),
  getSubscription: () => api.get("/billing/subscription"),
  cancel: () => api.delete("/billing/subscription"),
};

// ── AI (proxied through NestJS) ───────────────────────────────────────────
export const aiApi = {
  analyze: (formData: FormData) =>
    api.post("/ai/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  generateInterview: (formData: FormData) =>
    api.post("/ai/interview/generate", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  scoreAts: (formData: FormData) =>
    api.post("/ai/ats/score", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  skillUpgrade: (selectedCareer: string) =>
    api.post("/ai/skill-upgrade", { selected_career: selectedCareer }),
};

// ── User usage ────────────────────────────────────────────────────────────
export const usageApi = {
  getAll: () => api.get("/users/usage"),
};
