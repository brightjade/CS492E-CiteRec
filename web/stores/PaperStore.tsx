//@ts-check
import { observable, makeObservable, configure, computed, action } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import axios from "axios";
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
  simscore: number;
  pid: string;
  authors: string;
  date: string;
  categories: string;
  abstract: string;
  embedding;

  constructor(
    store: PaperStore,
    name: string,
    status: PaperStatus,
    id: string,
    x: number,
    y: number,
    simscore: number,
    pid: string,
    authors: string,
    date: string,
    categories: string,
    abstract: string,
    embedding
  ) {
    this.store = store;
    this.status = status;
    this.name = name;
    this.id = id;
    this.x = x;
    this.y = y;
    this.simscore = simscore;
    this.pid = pid;
    this.authors = authors;
    this.date = date;
    this.categories = categories;
    this.abstract = abstract;
    this.embedding = embedding;

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
    return Math.floor((this.papers.length - 2) / this.pageSize) + 1;
  }

  constructor() {
    makeObservable(this);
  }

  @action getPapers(ui: UIStore) {
    axios
      // .post(`http://icarus-env.eba-ypad3uwi.us-east-2.elasticbeanstalk.com/api/recommend_papers`, {
      .post(`http://localhost:8080/api/recommend_papers`, {
        userInput: ui.selectedText,
        category: ui.category,
        K: ui.k,
      })
      .then((res) => {
        ui.setLoading(false);

        // add query
        if (this.query === undefined) {
          this.addQuery(
            "0", // reserve ID#0 for query vector
            res.data[0].text,
            parseFloat(res.data[0].x),
            parseFloat(res.data[0].y),
            res.data[0].embedding
          );
        }

        // add recommended papers to the list
        res.data.slice(1).forEach((dict) => {
          this.recommendPaper(
            uuidv4(),
            dict.pid,
            dict.authors,
            dict.title,
            dict.categories,
            dict.date,
            parseFloat(dict.x),
            parseFloat(dict.y),
            parseFloat(dict.simscore),
            dict.embedding,
            dict.abstract
          );
        });
        // console.log(this.papers);
      })
      .catch((err) => {
        console.log(err);
        ui.setLoading(false);
      });
  }

  @action getMorePapers(ui: UIStore) {
    this.clearDeselected();
    axios
      // .post(`http://icarus-env.eba-ypad3uwi.us-east-2.elasticbeanstalk.com/api/recommend_papers`, {
      .post(`http://localhost:8080/api/further_recommend_papers`, {
        addedVectors: this.allAddedPapers.map((paper) => paper.embedding),
        category: ui.category,
        K: ui.k,
      })
      .then((res) => {
        ui.setLoading(false);

        let queryIndex = this.papers.findIndex(
          (paper) => paper.status == PaperStatus.Query
        );
        // add query
        if (queryIndex != -1) {
          this.papers[queryIndex] = new Paper(
            this,
            res.data[0].text,
            PaperStatus.Query,
            "0",
            parseFloat(res.data[0].x),
            parseFloat(res.data[0].y),
            null,
            null,
            null,
            null,
            null,
            null,
            res.data[0].embedding
          );
        }

        // add recommended papers to the list
        res.data.slice(1).forEach((dict) => {
          this.recommendPaper(
            uuidv4(),
            dict.pid,
            dict.authors,
            dict.title,
            dict.categories,
            dict.date,
            parseFloat(dict.x),
            parseFloat(dict.y),
            parseFloat(dict.simscore),
            dict.embedding,
            dict.abstract
          );
        });
      })
      .catch((err) => {
        console.log(err);
        ui.setLoading(false);
      });
  }

  @action selectPaper(selectionId: string) {
    this.selectedPaper = selectionId;
  }

  @action setPage(pageNum: number) {
    this.pageNum = pageNum;
  }

  @action drop() {
    this.papers = [];
    this.selectedPaper = "";
  }

  @computed get toText() {
    return this.allAddedPapers
      .map((paper) => {
        return `${paper.authors}. ${paper.name}, ${paper.date.substring(
          0,
          4
        )}.`;
      })
      .reduce((v1, v2) => {
        return v1 + "\n\n" + v2;
      });
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

  @computed get allRecommendedPapers() {
    return this.paperList.filter(
      (paper) => paper.status == PaperStatus.Recommended
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
    let queryArray = this.papers.filter(
      (paper) => paper.status == PaperStatus.Query
    );
    if (queryArray.length == 0) return undefined;
    else return queryArray[0];
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
      paper.simscore,
      paper.pid,
      paper.authors,
      paper.date,
      paper.categories,
      paper.abstract,
      paper.embedding
    );
  }

  @action clearDeselected() {
    let selected = this.papers.filter(
      (paper) =>
        paper.status == PaperStatus.Added ||
        paper.status == PaperStatus.Query ||
        paper.status == PaperStatus.Blacklisted
    );
    this.setPage(1);
    console.log(selected);
    this.papers = selected;
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
        paper.simscore,
        paper.pid,
        paper.authors,
        paper.date,
        paper.categories,
        paper.abstract,
        paper.embedding
      );
    } else if (paper.status == PaperStatus.Recommended) {
      this.papers[paperIndex] = new Paper(
        this,
        paper.name,
        PaperStatus.Added,
        paper.id,
        paper.x,
        paper.y,
        paper.simscore,
        paper.pid,
        paper.authors,
        paper.date,
        paper.categories,
        paper.abstract,
        paper.embedding
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
    simscore: number,
    embedding,
    abstract
  ) {
    if (this.papers.findIndex((paper) => paper.pid === pid) == -1)
      this.papers.push(
        new Paper(
          this,
          title,
          PaperStatus.Recommended,
          id,
          x,
          y,
          simscore,
          pid,
          authors,
          date,
          categories,
          abstract,
          embedding
        )
      );
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
        null,
        null,
        null,
        embedding
      ),
    ];
  }
}
