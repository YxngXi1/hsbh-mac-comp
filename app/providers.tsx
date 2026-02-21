"use client";

import type { ReactNode } from "react";
import { DiscoveryProvider } from "./discovery-context";

export function Providers({ children }: { children: ReactNode }) {
  return <DiscoveryProvider>{children}</DiscoveryProvider>;
}
