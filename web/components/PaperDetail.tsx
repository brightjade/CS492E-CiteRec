import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Button, Paper, Tooltip, Box } from "@material-ui/core";

// import { dataGenerator } from "./generator";
import { useStores } from "../hooks/useStores";
import { observer } from "mobx-react-lite";
import { PaperStatus } from "../stores/PaperStore";

const chartStyles = makeStyles({
  selectedCitationContainer: {
    minHeight: "10%",
  },
  citationContainer: {
    margin: "10px",
    padding: "10px",
  },
  buttonContainer: {
    margin: "10px",
    paddingBottom: "8px",
  },
});

const PaperDetail = observer(function PaperDetail() {
  const styles = chartStyles();
  // const data = dataGenerator(100);
  const { ui, papers } = useStores();
  const selectedPaper = papers.paperById(papers.selectedPaper);

  return (
    <Box p={2}>
      <Paper className={styles.selectedCitationContainer}>
        {papers.selectedPaper === "" ? (
          ""
        ) : (
          <div className={styles.citationContainer}>
            <b>Arxiv ID:</b>&nbsp;
            <a
              style={{ color: "#0000EE", textDecoration: "underline" }}
              href={"https://arxiv.org/abs/" + selectedPaper?.pid}
              target="_blank"
            >
              {selectedPaper?.pid}
            </a>
            <br />
            <b>Title:</b> {selectedPaper?.name}
            <br />
            <b>Authors:</b> {selectedPaper?.authors}
            <br />
            <b>Categories:</b> {selectedPaper?.categories}
            <br />
            <b>Update Date:</b> {selectedPaper?.date}
            <br />
            <b>Abstract:</b> {selectedPaper?.abstract}
          </div>
        )}
        {papers.selectedPaper === "" ? (
          ""
        ) : selectedPaper?.status == PaperStatus.Blacklisted ? (
          <Box
            className={styles.buttonContainer}
            component="span"
            display="block"
          >
            <Tooltip
              enterDelay={700}
              title={
                "Not irrelevant: This paper will re-appear in your recommendation list"
              }
              arrow
            >
              <Button
                color="secondary"
                onClick={() =>
                  papers.changeStatus(
                    papers.selectedPaper,
                    PaperStatus.Recommended
                  )
                }
              >
                {"Not Irrelevant"}
              </Button>
            </Tooltip>
          </Box>
        ) : (
          <Box
            className={styles.buttonContainer}
            component="span"
            display="block"
          >
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
                {selectedPaper?.status == PaperStatus.Added ? "Remove" : "Add"}
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
          </Box>
        )}
      </Paper>
    </Box>
  );
});

export default PaperDetail;
