//@ts-check
import { observable, makeObservable, configure, computed, action } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import { v4 as uuidv4 } from "uuid";
import { UIStore } from ".";
import { normalDistribution } from "./generator";
// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(typeof window === "undefined");

configure({ enforceActions: "always" });

export enum PaperStatus {
  Added,
  Blacklisted,
  Recommended,
  None,
  Query,
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
    y: number
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
  @observable papers: Paper[] = [
    new Paper(
      this,
      "first placeholder paper",
      PaperStatus.Recommended,
      "1",
      0.3,
      0.5
    ),
    new Paper(
      this,
      "second placeholder paper",
      PaperStatus.Recommended,
      "2",
      0.4,
      0.2
    ),
    new Paper(
      this,
      "third placeholder paper",
      PaperStatus.Recommended,
      "3",
      0.3,
      0.1
    ),
    new Paper(
      this,
      "fourth placeholder paper",
      PaperStatus.Recommended,
      "4",
      0.1,
      0.3
    ),
    new Paper(
      this,
      "fifth placeholder paper",
      PaperStatus.Recommended,
      "5",
      0.1,
      0.5
    ),
  ];
  @observable pageNum: number = 1;
  @observable selectedPaper: string = "";

  constructor(uistore: UIStore) {
    makeObservable(this);
  }

  @action selectPaper(selectionId: string) {
    this.selectedPaper = selectionId;
  }

  @action setPage(pageNum: number) {
    this.pageNum = pageNum;
  }

  @computed get papersOnPage() {
    let pageSize = 10;
    let first = pageSize * (pageNum - 1);
    let last = pageSize * pageNum;

    // slice(1) first to not display query on recommendation list
    return this.papers.slice(1).slice(first, last);
  }

  @computed get selectedPapers() {
    return this.papersOnPage.filter((paper) => paper.id === this.selectedPaper);
  }

  @computed get allAddedPapers() {
    return this.papers.filter((paper) => paper.status == PaperStatus.Added);
  }

  @computed get addedPapersOnPage() {
    return this.papersOnPage.filter(
      (paper) =>
        paper.status == PaperStatus.Added && paper.id !== this.selectedPaper
    );
  }

  @computed get recommendedPapersOnPage() {
    return this.papersOnPage.filter(
      (paper) =>
        paper.status == PaperStatus.Recommended &&
        paper.id !== this.selectedPaper
    );
  }

  @computed get blacklistedPapersOnPage() {
    return this.papersOnPage.filter(
      (paper) =>
        paper.status == PaperStatus.Blacklisted &&
        paper.id !== this.selectedPaper
    );
  }

  @computed get query() {
    return this.papers.filter((paper) => paper.status == PaperStatus.Query);
  }

  paperById(id: string) {
    return this.papers.find((value) => value.id == id);
  }

  @action changeStatus(id: string, status: PaperStatus) {
    let paperIndex = this.papers.findIndex((value) => value.id === id);
    let paper = this.papers[paperIndex];
    this.papers[paperIndex] = new Paper(
      this,
      paper.name,
      status,
      paper.id,
      paper.x,
      paper.y
    );
  }

  @action togglePaper(id: string) {
    let paperIndex = this.papers.findIndex((value) => value.id === id);
    // console.log(paperIndex);
    let paper = this.papers[paperIndex];
    // console.log(paper);
    if (paper.status == PaperStatus.Added) {
      this.papers[paperIndex] = new Paper(
        this,
        paper.name,
        PaperStatus.Recommended,
        paper.id,
        paper.x,
        paper.y
      );
    } else if (paper.status == PaperStatus.Recommended) {
      this.papers[paperIndex] = new Paper(
        this,
        paper.name,
        PaperStatus.Added,
        paper.id,
        paper.x,
        paper.y
      );
    }
  }

  @action clearRecommendations() {
    this.papers = [];
  }

  @action recommendPaper(
    id: string,
    pid: string,
    authors: string,
    title: string,
    categories: string,
    date: string,
    x: number,
    y: number,
    embedding
  ) {
    this.papers.push(new Paper(this, title, PaperStatus.Recommended, id, x, y));
  }

  @action addQuery(id: string, text: string, x: number, y: number, embedding) {
    this.papers.push(
      new Paper(
        this,
        text, // .slice(0, 10) + ...
        PaperStatus.Query,
        id,
        x,
        y
      )
    );
  }
}
