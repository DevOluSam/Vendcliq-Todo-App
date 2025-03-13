"use client";

import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { api } from "@/lib/axiosConfig";
import { useSelector } from "react-redux";
import { RootState } from "./store";

function TokenHandler() {
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  return null; // This component doesn't render anything
}

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TokenHandler /> {/* Ensure this is wrapped inside the Provider */}
        {children}
      </PersistGate>
    </Provider>
  );
}
