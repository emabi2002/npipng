"use client";

import { useMemo } from "react";
import type { NavModule } from "@/components/nav/menuConfig";
import { withSubnav /*, NAV_MODULES */ } from "@/components/nav/menuConfig";

/**
 * Returns the modules visible to the current user.
 * For now we show everything + attach SUBNAV (so TopNav shows dropdowns).
 *
 * Later we’ll filter by permissions (e.g., Supabase RLS / RPC result)
 * and only keep modules the user can actually access.
 */
export function useMyModules(): NavModule[] {
  // Basic: all modules with their subnav items
  return useMemo(() => withSubnav(), []);

  /**
   * Example (future):
   *
   * const allowedKeys = new Set<string>(await fetchUserModuleKeys());
   * return withSubnav().filter((m) => allowedKeys.has(m.key));
   */
}
