import { createContext, useContext, useEffect, useState } from "react"

interface ThemeContextValue {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeProviderContext = createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => "system",
});

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}:{
  children: React.ReactNode,
  defaultTheme?: string,
  storageKey?: string,
  props?: any
}) {
  const [theme, setTheme] = useState<string>(
    () => (localStorage.getItem(storageKey)) || defaultTheme
  )
 
  useEffect(() => {
    const root = window.document.documentElement
 
    root.classList.remove("light", "dark")
 
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: system)")
        .matches
        ? "dark"
        : "light"
 
      root.classList.add(systemTheme)
      return
    }
 
    root.classList.add(theme)
  }, [theme])
 
  const value = {
    theme,
    setTheme: (theme: string) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }
 
  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
 
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
 
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
 
  return context
}