"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Create a client only if the URL is available, otherwise use a mock
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convexClient = convexUrl 
  ? new ConvexReactClient(convexUrl)
  : undefined;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // If we don't have a Convex client, just render the children without the provider
  if (!convexClient) {
    console.warn("Convex URL not found, using mock provider");
    return <>{children}</>;
  }
  
  return <ConvexProvider client={convexClient}>{children}</ConvexProvider>;
}
