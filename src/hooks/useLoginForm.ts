import { useState } from "react";
import { api } from "@/lib/axiosConfig";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { login } from "@/redux/authSlice";

export const useLoginForm = () => {
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const isLoginDisabled = !Object.values(loginData).every(Boolean);
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", loginData);
      const token = response.data.token;

      if (!token) {
        toast.error("Access denied. Try again");
        return;
      }

      dispatch(login(token));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      toast.success("Login successful! Redirecting...");

      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error) {
      toast.error("Login failed. Try again.");
      console.error("Login error:", error);
    }
  };

  return { loginData, setLoginData, isLoginDisabled, handleLoginSubmit };
};
