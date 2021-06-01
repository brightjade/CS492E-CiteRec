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
import { useStores } from "../../hooks/useStores";

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
        <p className={styles.desc}>Citation will be displayed here.</p>
      </div>
    );
  }
  return null;
};

export default function InteractiveChart() {
  const [selectedCitation, selectCitation] = useState("");
  const [addedCitations, addCitation] = useState([]);
  const styles = chartStyles();
  // const data = dataGenerator(100);
  const { papers } = useStores();

  return (
    <div className={styles.container}>
      <ResponsiveContainer width="50%" height="50%">
        <ScatterChart>
          <XAxis type="number" dataKey="x" />
          <YAxis type="number" dataKey="y" />
          <Tooltip content={<CustomTooltip />} />
          <Scatter
            name="citation"
            data={papers.recommendedPapers}
            fill="#8884d8"
            onClick={(p) => selectCitation(p.payload.name)}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <Paper className={styles.selectedCitationContainer}>
        {selectedCitation}
        {selectedCitation === "" ? (
          ""
        ) : (
          <div className={styles.buttonContainer}>
            <Button
              color="primary"
              onClick={() => addCitation([...addedCitations, selectedCitation])}
            >
              ADD
            </Button>
            <Button color="secondary">BLACKLIST</Button>
          </div>
        )}
      </Paper>
      <br />
      <Paper className={styles.addedCitationsContainer}>
        {addedCitations.map((item) => {
          let citation = item;
          return <Paper>{citation}</Paper>;
        })}
      </Paper>
      <Button color="primary">SAVE</Button>
    </div>
  );
}
