import { useState } from "react";
import { api } from "@/lib/axiosConfig";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignupForm = () => {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const isSignupDisabled = !Object.values(signupData).every(Boolean);
  const router = useRouter();

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const registerPromise = api.post("/register", signupData);
      toast.promise(registerPromise, {
        loading: "Loading...",
        success: "Registration was successful",
        error: "Failed to register. Try again",
      });

      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return { signupData, setSignupData, isSignupDisabled, handleSignupSubmit };
};
