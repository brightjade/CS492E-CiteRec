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
  // const styles = chartStyles();
  // const data = dataGenerator(100);
  const { ui, papers } = useStores();

  return (
    <ResponsiveContainer width="50%" height="50%">
      <ScatterChart>
        <XAxis type="number" dataKey="x" />
        <YAxis type="number" dataKey="y" />
        <Tooltip content={<CustomTooltip />} />
        <Scatter
          isAnimationActive={false}
          name="query"
          data={papers.query}
          fill="#d88884"
        />
        <Scatter
          isAnimationActive={false}
          name="recommended"
          data={papers.recommendedPapersOnPage}
          fill="#8884d8"
          onClick={(p) => {
            console.log(p.payload);
            papers.selectPaper(p.payload.id);
          }}
        />
        <Scatter
          isAnimationActive={false}
          name="selected"
          data={papers.selectedPapers}
          fill="#000000"
          onClick={(p) => {
            console.log(p.payload);
            papers.selectPaper(p.payload.id);
          }}
        />
        <Scatter
          isAnimationActive={false}
          name="added"
          data={papers.addedPapersOnPage}
          fill="#00FF00"
          onClick={(p) => {
            console.log(p.payload);
            papers.selectPaper(p.payload.id);
          }}
        />
        <Scatter
          isAnimationActive={false}
          name="blacklisted"
          data={papers.blacklistedPapersOnPage}
          fill="#ff0000"
          onClick={(p) => {
            console.log(p.payload);
            papers.selectPaper(p.payload.id);
          }}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
});

export default InteractiveChart;
