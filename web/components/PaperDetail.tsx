import React, { useState } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { makeStyles } from "@material-ui/styles";
import { Button, Paper } from "@material-ui/core";

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
      <Paper className={styles.selectedCitationContainer}>
        {papers.selectedPaper === ""
          ? ""
          : papers.paperById(papers.selectedPaper)?.name}
        {papers.selectedPaper === "" ? (
          ""
        ) : (
          <div className={styles.buttonContainer}>
            <Button
              color="primary"
              onClick={() =>
                papers.changeStatus(papers.selectedPaper, PaperStatus.Added)
              }
            >
              Add Citation
            </Button>
            <Button
              color="secondary"
              onClick={() =>
                papers.changeStatus(
                  papers.selectedPaper,
                  PaperStatus.Blacklisted
                )
              }
            >
              Mark as Irrelevant
            </Button>
          </div>
        )}
      </Paper>
      <br />
      <Paper className={styles.addedCitationsContainer}>
        {papers.allAddedPapers.map((paper) => {
          // let citation = item;
          return <Paper>{paper.name}</Paper>;
        })}
      </Paper>
      <Button color="primary">SAVE</Button>
    </div>
  );
});
export default PaperDetail;
