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
  @observable pageNum: number = 1;
  @observable selectedPaper: string = "";
  constructor() {
    makeObservable(this);
  }

  @action setSelectedText(selection: string) {
    this.selectedText = selection;
  }

  @action selectPaper(selectionId: string) {
    this.selectedPaper = selectionId;
  }

  @action setPage(pageNum: number) {
    this.pageNum = pageNum;
  }
}
