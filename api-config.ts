import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";

export function setupApiClient() {
  const apiBase = import.meta.env.VITE_API_URL ?? "";
  setBaseUrl(apiBase.replace(/\/+$/, ""));

  setAuthTokenGetter(() => {
    return localStorage.getItem("token");
  });
}
