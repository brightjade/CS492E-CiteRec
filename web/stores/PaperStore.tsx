//@ts-check
import { observable, makeObservable, configure, computed, action } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import { v4 as uuidv4 } from "uuid";
// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(typeof window === "undefined");

configure({ enforceActions: "always" });

export class Paper {
  id: string;
  name: string;
  store: PaperStore;

  constructor(store: PaperStore, name: string, id = uuidv4()) {
    this.store = store;
    this.name = name;
    this.id = id;
    // makeObservable(this);
  }
}

export class PaperStore {
  @observable papers: Paper[] = [
    new Paper(this, "first paper"),
    new Paper(this, "second paper"),
    new Paper(this, "third paper"),
    new Paper(this, "fourth paper"),
    new Paper(this, "fifth paper"),
    new Paper(this, "sixth paper"),
    new Paper(this, "seventh paper"),
    new Paper(this, "eigth paper"),
    new Paper(this, "ninth paper"),
    new Paper(this, "tenth paper"),
    new Paper(this, "eleventh paper"),
    new Paper(this, "twelveth paper"),
    new Paper(this, "thirteenth paper"),
    new Paper(this, "fourteenth paper"),
  ];

  constructor() {
    makeObservable(this);
  }

  papersOnPage(pageNum: number) {
    let pageSize = 10;
    let first = pageSize * (pageNum - 1);
    let last = pageSize * pageNum;
    return this.papers.slice(first, last);
  }
  @action addPaper(name: string) {
    this.papers.push(new Paper(this, name));
  }
}
