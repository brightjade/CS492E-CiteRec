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
  pid: string;
  authors: string;
  date: string;
  categories: string;

  constructor(
    store: PaperStore,
    name: string,
    status: PaperStatus,
    id: string,
    x: number,
    y: number,
    pid: string,
    authors: string,
    date: string,
    categories: string,
  ) {
    this.store = store;
    this.status = status;
    this.name = name;
    this.id = id;
    this.x = x;
    this.y = y;
    this.pid = pid;
    this.authors = authors;
    this.date = date;
    this.categories = categories;

    makeObservable(this);
  }

  @action changeStatus(status: PaperStatus) {
    this.status = status;
  }
}

export class PaperStore {
  pageSize = 10;
  neighborSize = 3;
  extraPages = 2;
  @observable papers: Paper[] = [
    // new Paper(this, "query vector", PaperStatus.Query, "1", 0.3, 0.5),
    // new Paper(this, "first paper", PaperStatus.Recommended, "2", 0.4, 0.2),
    // new Paper(this, "second paper", PaperStatus.Recommended, "3", 0.3, 0.1),
    // new Paper(this, "third paper", PaperStatus.Recommended, "4", 0.1, 0.3),
    // new Paper(this, "fourth paper", PaperStatus.Recommended, "5", 0.1, 0.5),
    // new Paper(this, "paper 5", PaperStatus.Recommended, "6", -0.5, 0.2),
    // new Paper(this, "paper 6", PaperStatus.Recommended, "7", -0.4, 0.1),
    // new Paper(this, "paper 7", PaperStatus.Recommended, "8", 0.4, 0.5),
    // new Paper(this, "paper 8", PaperStatus.Recommended, "9", -0.3, 0.25),
    // new Paper(this, "paper 9", PaperStatus.Recommended, "10", -0.1, 0.2),
    // new Paper(this, "paper 10", PaperStatus.Recommended, "11", -0.15, 0.3),
    // new Paper(this, "paper 11", PaperStatus.Recommended, "12", 0.43, 0.27),
    // new Paper(this, "paper 12", PaperStatus.Recommended, "13", 0.05, 0.17),
    // new Paper(this, "paper 13", PaperStatus.Recommended, "14", 0.4, 0.03),
    // new Paper(this, "paper 14", PaperStatus.Recommended, "15", -0.5, -0.1),
  ];
  @observable pageNum: number = 1;
  @observable selectedPaper: string = "";

  @computed get pageCount() {
    return Math.floor(this.papers.length - 2 / this.pageSize) + 1;
  }

  constructor() {
    makeObservable(this);
  }

  @action selectPaper(selectionId: string) {
    this.selectedPaper = selectionId;
  }

  @action setPage(pageNum: number) {
    this.pageNum = pageNum;
  }

  @computed get first() {
    return this.pageSize * (this.pageNum - 1);
  }
  @computed get last() {
    return this.pageSize * this.pageNum;
  }

  @computed get paperList() {
    // slice(1) first to not display query on recommendation list
    let recOrAdd = this.papers.filter(
      (paper) =>
        paper.status == PaperStatus.Recommended ||
        paper.status == PaperStatus.Added
    );
    let blackList = this.papers.filter(
      (paper) => paper.status == PaperStatus.Blacklisted
    );
    return recOrAdd.concat(blackList);
  }

  @computed get papersOnPage() {
    return this.paperList.slice(this.first, this.last);
  }

  @computed get selectedPapers() {
    return this.papers.filter((paper) => paper.id === this.selectedPaper);
  }

  // @computed get neighboringPapers() {}

  @computed get allAddedPapers() {
    return this.paperList.filter((paper) => paper.status == PaperStatus.Added);
  }

  @computed get addedPapers() {
    return this.paperList.filter(
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

  @computed get recommendedPapersOnOtherPages() {
    return this.paperList
      .filter((paper, index) => index < this.first || index >= this.last)
      .filter(
        (paper) =>
          paper.status == PaperStatus.Recommended &&
          paper.id !== this.selectedPaper
      );
  }

  @computed get blacklistedPapers() {
    return this.paperList.filter(
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
      paper.y,
      paper.pid,
      paper.authors,
      paper.date,
      paper.categories,
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
        paper.y,
        paper.pid,
        paper.authors,
        paper.date,
        paper.categories,
      );
    } else if (paper.status == PaperStatus.Recommended) {
      this.papers[paperIndex] = new Paper(
        this,
        paper.name,
        PaperStatus.Added,
        paper.id,
        paper.x,
        paper.y,
        paper.pid,
        paper.authors,
        paper.date,
        paper.categories,
      );
    }
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
    this.papers.push(
      new Paper(
        this,
        title,
        PaperStatus.Recommended,
        id,
        x,
        y,
        pid,
        authors,
        date,
        categories,
      ));
  }

  @action addQuery(id: string, text: string, x: number, y: number, embedding) {
    this.papers = [
      new Paper(
        this,
        text, // .slice(0, 10) + ...
        PaperStatus.Query,
        id,
        x,
        y,
        null,
        null,
        null,
        null
      )
    ]
  }
}
