import React, { useState } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Legend,
  Tooltip,
  ReferenceDot,
} from "recharts";
import { makeStyles } from "@material-ui/styles";
import { Button, Paper } from "@material-ui/core";

// import { dataGenerator } from "./generator";
import { useStores } from "../hooks/useStores";
import { observer } from "mobx-react-lite";
import { LocalConvenienceStoreOutlined } from "@material-ui/icons";
import { red, green, blue } from "@material-ui/core/colors";

const tooltipStyles = makeStyles({
  container: {
    backgroundColor: "white",
    border: "solid gray 1px",
    borderRadius: "5px",
    padding: "10px",
    textAlign: "center",
    width: "200px",
  },
  label: {
    color: "gray",
  },
  desc: {
    color: "gray",
  },
});

const CustomTooltip = ({ active, payload, label }) => {
  const styles = tooltipStyles();
  if (active && payload && payload.length) {
    return (
      <div className={styles.container}>
        <p className={styles.label}>{payload[2].value}</p>
        <p className={styles.desc}>{}</p>
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
        <XAxis type="number" dataKey="x" tick={false} />
        <YAxis type="number" dataKey="y" tick={false} />
        <ZAxis type="string" dataKey="name" />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="bottom" height={36} />
        {/* <Scatter
          isAnimationActive={false}
          name="query"
          data={papers.query}
          fill="#000000"
        /> */}
        <ReferenceDot
          x={papers.query[0].x}
          y={papers.query[0].y}
          fill={blue[300]}
          stroke="none"
        />
        <Scatter
          isAnimationActive={false}
          name="citation"
          data={papers.recommendedPapersOnOtherPages}
          fill="#dbdbdb"
          onClick={(p) => {
            console.log(p.payload);
            papers.selectPaper(p.payload.id);
          }}
        />
        <Scatter
          isAnimationActive={false}
          name="recommended"
          data={papers.recommendedPapersOnPage}
          fill="#9c9c9c"
          onClick={(p) => {
            console.log(p.payload);
            papers.selectPaper(p.payload.id);
          }}
        />
        <Scatter
          isAnimationActive={false}
          name="selected"
          data={papers.selectedPapers}
          fill="#1b22e0"
          onClick={(p) => {
            console.log(p.payload);
            papers.selectPaper(p.payload.id);
          }}
        />
        <Scatter
          isAnimationActive={false}
          name="added"
          data={papers.addedPapers}
          fill={green[400]}
          onClick={(p) => {
            console.log(p.payload);
            papers.selectPaper(p.payload.id);
          }}
        />
        <Scatter
          isAnimationActive={false}
          name="irrelevant"
          data={papers.blacklistedPapers}
          fill={red[400]}
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
