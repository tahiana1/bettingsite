import { createContext } from "react";

interface LayoutContextType {
  isDarkTheme: boolean;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType>({
  isDarkTheme: true,
  collapsed: true,
  setCollapsed: () => null,
});
export default LayoutContext;
