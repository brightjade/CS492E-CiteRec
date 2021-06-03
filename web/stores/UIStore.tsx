//@ts-check
import { action, observable, computed, makeObservable, configure } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import { Paper } from "./PaperStore";
// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(typeof window === "undefined");

configure({ enforceActions: "always" });

export class UIStore {
  //selection
  @observable selectedText: string = "";
  //loading
  @observable k: number = 30;
  @observable loading: boolean = false;
  constructor() {
    makeObservable(this);
  }

  @action setK(k: number) {
    this.k = k;
  }
  @action setSelectedText(selection: string) {
    this.selectedText = selection;
  }

  @action setLoading(loading: boolean) {
    this.loading = loading;
  }
}
