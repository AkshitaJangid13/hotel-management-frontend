"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { postApi, setToken } from "@/lib/api";
import toast from "react-hot-toast";
import { setUser } from "@/lib/auth";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (): Promise<void> => {
    const res = await postApi("/auth/login", { email, password });
    console.log({ res });
    if (res?.data?.token?.length) {
      setToken(res.data.token);
      setUser(res.data.user);
      toast.success(res.message);
      window.location.href = "/dashboard";
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-[350px] shadow-lg">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-bold text-center">Login</h2>

          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={handleLogin}>
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
