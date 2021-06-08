//@ts-check
import { action, observable, computed, makeObservable, configure } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import { Paper } from "./PaperStore";
// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(typeof window === "undefined");

configure({ enforceActions: "always" });

export class UIStore {
  @observable selectedText: string = "";
  @observable category: string = "AI";
  @observable k: number = 30;
  @observable loading: boolean = false;
  @observable queryChanged: boolean = false;

  constructor() {
    makeObservable(this);
  }

  @action setQueryChanged(queryChanged: boolean) {
    this.queryChanged = queryChanged;
  }
  @action setSelectedText(selection: string) {
    this.selectedText = selection;
  }
  @action setCategory(category: string) {
    this.category = category;
  }
  @action setK(k: number) {
    this.k = k;
  }
  @action setLoading(loading: boolean) {
    this.loading = loading;
  }
}
