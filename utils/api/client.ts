import createClient, { Middleware } from "openapi-fetch";
import type { paths } from "./schema";

const myMiddleware: Middleware = {
  async onRequest({ request }) {
    const requestWithCredentials = new Request(request, {
      credentials: "include",
    });

    const stored = localStorage.getItem("ai-career-auth");

    if (stored) {
      const { state } = JSON.parse(stored);
      if (state?.accessToken) {
        requestWithCredentials.headers.set(
          "Authorization",
          `Bearer ${state.accessToken}`,
        );
      } else {
        console.log("No access token found in stored auth state");
      }
    }

    return requestWithCredentials;
  },
  async onResponse({ request, response, options }) {
    return response;
  },
  async onError({ error }) {
    // wrap errors thrown by fetch
    return new Error("Oops, fetch failed", { cause: error });
  },
};

export const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_NEST_API_URL!
});

client.use(myMiddleware);
