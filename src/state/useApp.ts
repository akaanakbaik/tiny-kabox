import { useAppContext } from "./AppProvider"

export function useApp() {
  return useAppContext()
}