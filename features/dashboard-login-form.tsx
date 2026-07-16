"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

import { loginAdmin } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginValues = z.infer<typeof loginSchema>;

export function DashboardLoginForm() {
  const router = useRouter();
  const setAdmin = useAuthStore((state) => state.setAdmin);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    try {
      const response = await loginAdmin(values);
      setAdmin(response.admin);
      toast.success("Login successful");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Unable to sign in");
    }
  }

  return (
    <form
      onSubmit={(event) => {
        void form.handleSubmit(onSubmit)(event);
      }}
      className="card-surface grid gap-4 p-6"
    >
      <input
        {...form.register("email")}
        placeholder="admin@example.com"
        className="rounded-xl border border-slate-200 px-4 py-3"
      />
      <input
        {...form.register("password")}
        type="password"
        placeholder="Password"
        className="rounded-xl border border-slate-200 px-4 py-3"
      />
      <button type="submit" className="btn-primary">
        Sign in to dashboard
      </button>
    </form>
  );
}
