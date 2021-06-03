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

const tooltipStyles = makeStyles({
  container: {
    backgroundColor: "white",
    border: "solid black 1px",
    textAlign: "center",
  },
  label: {},
  desc: {
    color: "gray",
  },
});

const CustomTooltip = ({ active, payload, label }) => {
  const styles = tooltipStyles();

  if (active && payload && payload.length) {
    return (
      <div className={styles.container}>
        <p className={styles.label}>{`${label} : ${payload[0].value}`}</p>
        <p className={styles.desc}>{payload[1].value}</p>
      </div>
    );
  }
  return null;
};

const InteractiveChart = observer(function InteractiveChart() {
  const styles = chartStyles();
  // const data = dataGenerator(100);
  const { ui, papers } = useStores();

  return (
    <div className={styles.container}>
      <ResponsiveContainer width="50%" height="50%">
        <ScatterChart>
          <XAxis type="number" dataKey="x" />
          <YAxis type="number" dataKey="y" />
          <Tooltip content={<CustomTooltip />} />
          <Scatter 
            name="query"
            data={papers.query}
            fill="#d88884"
          />
          <Scatter
            name="citation"
            data={papers.recommendedPapers}
            fill="#8884d8"
            onClick={(p) => {
              console.log(p.payload);
              ui.selectPaper(p.payload.id);
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <Paper className={styles.selectedCitationContainer}>
        {ui.selectedPaper === ""
          ? ""
          : papers.paperById(ui.selectedPaper)?.name}
        {ui.selectedPaper === "" ? (
          ""
        ) : (
          <div className={styles.buttonContainer}>
            <Button
              color="primary"
              onClick={() => papers.addPaper(ui.selectedPaper)}
            >
              ADD
            </Button>
            <Button color="secondary">BLACKLIST</Button>
          </div>
        )}
      </Paper>
      <br />
      <Paper className={styles.addedCitationsContainer}>
        {papers.addedPapers.map((paper) => {
          // let citation = item;
          return <Paper>{paper.name}</Paper>;
        })}
      </Paper>
      <Button color="primary">SAVE</Button>
    </div>
  );
});

export default InteractiveChart;
