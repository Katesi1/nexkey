"use client";

import { useStoreContext } from "@/store/StoreProvider";

export function useStore() {
  return useStoreContext();
}

