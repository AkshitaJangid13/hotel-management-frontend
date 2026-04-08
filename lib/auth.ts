export const setUser = (user: any) => {
  document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/`;
};

export const fetchUser = () => {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(^| )user=([^;]+)/);

  if (!match) return null; // ✅ prevent crash

  try {
    return JSON.parse(decodeURIComponent(match[2]));
  } catch {
    return null;
  }
};
