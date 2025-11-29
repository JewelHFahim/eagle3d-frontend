"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import { useLoginMutation } from "@/src/lib/redux/services/authApi";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { setUser } from "@/src/lib/redux/features/authSlice";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
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
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const redirect = searchParams.get("redirect") || "/products";

  useEffect(() => {
    if (data?.user) {
      dispatch(setUser(data.user));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isAuthenticated || isSuccess) {
      router.replace(redirect);
    }
  }, [isAuthenticated, isSuccess, redirect, router]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values).unwrap();
    } catch (error) {
      console.log("Something went wrong: ", error);
    }
  };

  const apiError =
    error && "data" in error && (error as any).data?.message
      ? (error as any).data.message
      : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white shadow-sm rounded-xl p-8 border border-slate-200">
        <h1 className="text-2xl font-semibold mb-2 text-slate-900">
          Login
        </h1>
        <p className="text-sm text-slate-500 mb-6">
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
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">
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
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {apiError && (
            <p className="text-xs text-red-600 mt-1">{apiError}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p className="text-xs text-slate-400 mt-3">
            Demo: demo@example.com / password123
          </p>
        </form>
      </div>
    </div>
  );
}
