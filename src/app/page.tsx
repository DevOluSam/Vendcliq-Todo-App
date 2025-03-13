"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/axiosConfig";
import { useDispatch } from "react-redux";
import { login } from "@/redux/authSlice";

function TabsDemo() {
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const isLoginDisabled = !Object.values(loginData).every(Boolean);
  const isSignupDisabled = !Object.values(signupData).every(Boolean);

  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(loginData);

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

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error("Login failed. Try again.");
      console.error("Login error:", error);
    }
  };

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

      // Wait for toast before navigating
      setTimeout(() => {
        router.push("/register"); // Redirect after showing the success toast
      }, 1500);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };
  return (
    <div className="flex justify-center h-screen items-center">
      <Tabs defaultValue="signup" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup" className="cursor-pointer">
            Signup
          </TabsTrigger>
          <TabsTrigger value="login" className="cursor-pointer">
            Login
          </TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Get started by setting up your account.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignupSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Pedro Duarte"
                    value={signupData.name}
                    onChange={(e) =>
                      setSignupData({ ...signupData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="Email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="peduarte@gmail.com"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={signupData.password_confirmation}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        password_confirmation: e.target.value,
                      })
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full cursor-pointer mt-6"
                  disabled={isSignupDisabled}
                >
                  Signup
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login to access your dashboard customized for you.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLoginSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="Email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="peduarte@gmail.com"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full cursor-pointer mt-6"
                  disabled={isLoginDisabled}
                >
                  Login
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default TabsDemo;
