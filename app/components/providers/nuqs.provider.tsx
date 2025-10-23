import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import type React from "react";

type NuqsProviderProps = {
  children: React.ReactNode;
};

export const NuqsProvider: React.FC<NuqsProviderProps> = ({ children }) => (
  <NuqsAdapter>{children}</NuqsAdapter>
);

export default NuqsProvider;
