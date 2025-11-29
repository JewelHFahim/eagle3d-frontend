"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/src/lib/redux/services/authApi";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { setUser } from "@/src/lib/redux/features/authSlice";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPageClient({ redirect }: { redirect: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "demo@example.com",
      password: "password123",
    },
  });

  const [login, { isLoading, error, isSuccess, data }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (data?.user) {
      dispatch(setUser(data.user));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isAuthenticated || isSuccess) {
      router.replace(redirect || "/products");
    }
  }, [isAuthenticated, isSuccess, redirect, router]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values).unwrap();
    } catch(error) {
      console.log("Something went wrong: ", error)
    }
  };

  const apiError =
    error && "data" in error && (error as any).data?.message
      ? (error as any).data.message
      : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Login</h1>
        <p className="mb-6 text-sm text-slate-500">
          Use the demo credentials to access the dashboard.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {apiError && (
            <p className="text-xs text-red-600">
              {apiError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-3 text-xs text-slate-400">
            Demo: demo@example.com / password123
          </p>
        </form>
      </div>
    </div>
  );
}
