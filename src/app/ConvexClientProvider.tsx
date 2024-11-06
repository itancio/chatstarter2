"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from 'convex/react-clerk' 
import { ReactNode } from "react";
import { useAuth } from '@clerk/nextjs';

// Define Convex client
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ 
    children, 
}: { 
    children: ReactNode 
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
    </ConvexProviderWithClerk>
  )
}