"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchUser } from "@/lib/auth";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const session = fetchUser();

    if (!session) {
      router.push("/login");
    } else {
      setUser(session);
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);