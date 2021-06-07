import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Button, Paper, Tooltip, Box } from "@material-ui/core";

// import { dataGenerator } from "./generator";
import { useStores } from "../hooks/useStores";
import { observer } from "mobx-react-lite";
import { PaperStatus } from "../stores/PaperStore";

const chartStyles = makeStyles({
  container: {
    width: "1000px",
    height: "500px",
  },
  selectedCitationContainer: {
    width: "50%",
    minHeight: "10%",
    margin: "10px",
  },
  addedCitationsContainer: {
    width: "50%",
    height: "30%",
    overflowY: "scroll",
    margin: "10px",
    padding: "10px",
  },
  citationContainer: {
    margin: "10px",
    padding: "10px",
  },
  buttonContainer: {
    margin: "10px",
  },
});

const PaperDetail = observer(function PaperDetail() {
  const styles = chartStyles();
  // const data = dataGenerator(100);
  const { ui, papers } = useStores();

  return (
    <div>
      <Box p={2}>
        <Paper className={styles.selectedCitationContainer}>
          {papers.selectedPaper === ""
            ? ""
            :
            <div className={styles.citationContainer}>
              <b>Arxiv ID:</b>&nbsp;
                <a style={{ color: "#0000EE", textDecoration: "underline" }}
                   href={"https://arxiv.org/abs/" + papers.paperById(papers.selectedPaper)?.pid}
                   target="_blank">
                     {papers.paperById(papers.selectedPaper)?.pid}
                </a>
              <br />
              <b>Title:</b> {papers.paperById(papers.selectedPaper)?.name}
              <br />
              <b>Authors:</b> {papers.paperById(papers.selectedPaper)?.authors}
              <br />
              <b>Categories:</b> {papers.paperById(papers.selectedPaper)?.categories}
              <br />
              <b>Update Date:</b> {papers.paperById(papers.selectedPaper)?.date}
              <br />
              <b>Abstract:</b> {papers.paperById(papers.selectedPaper)?.abstract}
            </div>
          }
          {papers.selectedPaper === "" ? (
            ""
          ) : (
            <div className={styles.buttonContainer}>
              <Tooltip
                enterDelay={700}
                title={
                  papers.paperById(papers.selectedPaper)?.status ==
                  PaperStatus.Added
                    ? "Remove from citation list"
                    : "Add to citation list"
                }
                arrow
              >
                <Button
                  color="primary"
                  onClick={() => papers.togglePaper(papers.selectedPaper)}
                >
                  {papers.paperById(papers.selectedPaper)?.status ==
                  PaperStatus.Added
                    ? "Remove"
                    : "Add"}
                </Button>
              </Tooltip>
              <Tooltip
                enterDelay={700}
                title="Mark as irrelevant: This paper will show up last on your recommendation list"
                arrow
              >
                <Button
                  color="secondary"
                  onClick={() =>
                    papers.changeStatus(
                      papers.selectedPaper,
                      PaperStatus.Blacklisted
                    )
                  }
                >
                  Irrelevant
                </Button>
              </Tooltip>
            </div>
          )}
        </Paper>
      </Box>
      <br />
        {papers.allAddedPapers.length > 0
          ?
          <Box p={2}>
            <Paper className={styles.addedCitationsContainer}>
              {papers.allAddedPapers.map((paper) => {
                return <p><Box>{`${paper.authors}. ${paper.name}, ${paper.date.substring(0,4)}.`}</Box></p>;
              })}
            </Paper>
            <Button color="primary">SAVE</Button>
          </Box>
          :
          ""
        }
    </div>
  );
});

export default PaperDetail;
