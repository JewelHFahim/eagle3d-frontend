"use client";

import { Provider } from "react-redux";
import { AuthInitializer } from "./AuthInitializer";
import { store } from "../lib/redux/store";

type Props = {
  children: React.ReactNode;
};

export function AppProviders({ children }: Props) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
}
