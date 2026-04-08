const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ✅ pass the Response object, not res.json()
const handleResponse = async (res: Response) => {
  if (res.status === 401 || res.status === 403) {
    removeToken();
    window.location.href = "/login";
    return null;
  }
  return await res.json(); // ✅ parse json here
};

export const getApi = async (endpoint: string) => {
  const token = getToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return await handleResponse(res); // ✅ pass res not res.json()
};

export const postApi = async (endpoint: string, body: any) => {
  const token = getToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(body),
  });
  return await handleResponse(res); // ✅ pass res not res.json()
};

export const putApi = async (endpoint: string, body: any) => {
  const token = getToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(body),
  });
  return await handleResponse(res); // ✅ pass res not res.json()
};

export const deleteApi = async (endpoint: string) => {
  const token = getToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  return await handleResponse(res); // ✅ pass res not res.json()
};

export const uploadApi = async (endpoint: string, formData: FormData) => {
  const token = getToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      // ✅ no Content-Type for FormData
    },
    body: formData,
  });
  return await handleResponse(res); // ✅ pass res not res.json()
};

// TOKEN HANDLING
export const setToken = (token: string) => {
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
};

export const getToken = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(^| )token=([^;]+)/);
  return match ? match[2] : null;
};

export const removeToken = () => {
  document.cookie = "token=; path=/; max-age=0";
};

export const isAuthenticated = () => {
  return !!getToken();
};