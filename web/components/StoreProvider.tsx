import { StoresContext } from "../contexts";
import { PaperStore, UIStore } from "../stores";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let papers = new PaperStore();
  let ui = new UIStore();

  return (
    <StoresContext.Provider value={{ ui, papers }}>
      {children}
    </StoresContext.Provider>
  );
}
