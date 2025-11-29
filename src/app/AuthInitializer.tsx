"use client";

import { useEffect } from "react";
import { useLazyMeQuery } from "../lib/redux/services/authApi";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { resetAuth, setUser } from "../lib/redux/features/authSlice";

export function AuthInitializer() {
  const [triggerMe] = useLazyMeQuery();
  const dispatch = useAppDispatch();
  const initialized = useAppSelector((state) => state.auth.initialized);

  useEffect(() => {
    if (initialized) return;

    const run = async () => {
      try {
        const result = await triggerMe().unwrap();
        dispatch(setUser(result.user));
      } catch {
        dispatch(resetAuth());
      }
    };

    run();
  }, [initialized, triggerMe, dispatch]);

  return null;
}
