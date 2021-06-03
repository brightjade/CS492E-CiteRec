import React, { useState } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
} from "recharts";
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
  },
  addedCitationsContainer: {
    width: "50%",
    height: "30%",
    overflowY: "scroll",
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
            : papers.paperById(papers.selectedPaper)?.name}
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
      <Box p={2}>
        <Paper className={styles.addedCitationsContainer}>
          {papers.allAddedPapers.map((paper) => {
            // let citation = item;
            return <Box>{paper.name}</Box>;
          })}
        </Paper>
        <Button color="primary">SAVE</Button>
      </Box>
    </div>
  );
});
export default PaperDetail;
