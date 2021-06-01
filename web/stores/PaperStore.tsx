//@ts-check
import { observable, makeObservable, configure, computed, action } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import { v4 as uuidv4 } from "uuid";
import { normalDistribution } from "./generator";
// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(typeof window === "undefined");

configure({ enforceActions: "always" });

export enum PaperStatus {
  Added,
  Blacklisted,
  Recommended,
  None,
}

export class Paper {
  id: string;
  @observable name: string;
  store: PaperStore;
  @observable status: PaperStatus;
  x: number;
  y: number;

  constructor(
    store: PaperStore,
    name: string,
    status: PaperStatus,
    id = uuidv4(),
    x = normalDistribution(),
    y = normalDistribution()
  ) {
    this.store = store;
    this.status = status;
    this.name = name;
    this.id = id;
    this.x = x;
    this.y = y;

    makeObservable(this);
  }
}

export class PaperStore {
  @observable papers: Paper[] = [
    new Paper(this, "first paper", PaperStatus.Recommended),
    new Paper(this, "second paper", PaperStatus.Recommended),
    new Paper(this, "third paper", PaperStatus.Recommended),
    new Paper(this, "fourth paper", PaperStatus.Recommended),
    new Paper(this, "fifth paper", PaperStatus.Recommended),
    new Paper(this, "sixth paper", PaperStatus.Recommended),
    new Paper(this, "seventh paper", PaperStatus.Recommended),
    new Paper(this, "eigth paper", PaperStatus.Recommended),
    new Paper(this, "ninth paper", PaperStatus.Recommended),
    new Paper(this, "tenth paper", PaperStatus.Recommended),
    new Paper(this, "eleventh paper", PaperStatus.Recommended),
    new Paper(this, "twelveth paper", PaperStatus.Recommended),
    new Paper(this, "thirteenth paper", PaperStatus.Recommended),
    new Paper(this, "fourteenth paper", PaperStatus.Recommended),
    new Paper(this, "fifteenth paper", PaperStatus.None),
    new Paper(this, "sixteenth paper", PaperStatus.None),
    new Paper(this, "seventeenth paper", PaperStatus.None),
    new Paper(this, "eigteenth paper", PaperStatus.None),
    new Paper(this, "nineteenth paper", PaperStatus.None),
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

  // @action addPaper(name: string) {
  //   this.papers.push(new Paper(this, name));
  // }

  @computed get addedPapers() {
    return this.papers.filter((paper) => paper.status == PaperStatus.Added);
  }

  @computed get recommendedPapers() {
    return this.papers.filter(
      (paper) => paper.status == PaperStatus.Recommended
    );
  }

  @computed get blacklistedPapers() {
    return this.papers.filter(
      (paper) => paper.status == PaperStatus.Blacklisted
    );
  }
}
