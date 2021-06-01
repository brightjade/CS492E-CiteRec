import React from "react";
import { PaperStore, UIStore } from "../stores";

type Context = {
  papers: PaperStore;
  ui: UIStore;
};
export const StoresContext = React.createContext<Context>({
  papers: undefined,
  ui: undefined,
});
