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
    id: string,
    x: number,
    y: number,
  ) {
    this.store = store;
    this.status = status;
    this.name = name;
    this.id = id;
    this.x = x;
    this.y = y;

    makeObservable(this);
  }

  @action changeStatus(status: PaperStatus) {
    this.status = status;
  }
}

export class PaperStore {
  @observable papers: Paper[] = [];

  constructor() {
    makeObservable(this);
  }

  papersOnPage(pageNum: number) {
    let pageSize = 10;
    let first = pageSize * (pageNum - 1);
    let last = pageSize * pageNum;
    return this.papers.slice(first, last);
  }

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

  paperById(id: string) {
    return this.papers.find((value) => value.id == id);
  }

  @action addPaper(id: string) {
    let paperIndex = this.papers.findIndex((value) => value.id === id);
    console.log(paperIndex);
    let paper = this.papers[paperIndex];
    console.log(paper);
    this.papers[paperIndex] = new Paper(
      this,
      paper.name,
      PaperStatus.Added,
      paper.id,
      paper.x,
      paper.y
    );
  }

  @action clearRecommendations() {
    this.papers = [];
  };

  @action recommendPaper(
    id: string,
    pid: string,
    authors: string,
    title: string,
    categories: string,
    date: string,
    x: number,
    y: number,
    ) {
    this.papers.push(
      new Paper(
        this,
        title,
        PaperStatus.Recommended,
        id,
        x,
        y,
    ));
  }
}
