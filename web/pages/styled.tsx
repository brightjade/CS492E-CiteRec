import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Box } from "@material-ui/core/";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "100%",
    height: "100vh",
  },
  inputColumn: {
    backgroundColor: "#a87936",
  },
  paperColumn: {
    backgroundColor: "#182946",
  },
  infoColumn: {
    backgroundColor: "#267827",
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  paperList: {
    backgroundColor: "#00f326",
    overflow: "scroll",
  },
  citation: {
    backgroundColor: "#003746",
  },
  graph: {
    backgroundColor: "#234566",
  },
  detail: {
    backgroundColor: "#f238f1",
  },
}));

export default function ComplexGrid() {
  const classes = useStyles();

  return (
    <Grid
      container
      spacing={4}
      // justify="center"
      // alignItems="center"
      className={classes.paper}
    >
      <Grid
        item
        xs={3}
        container
        className={classes.inputColumn}
        direction="column"
      >
        {/* <Grid item xs container > */}
        <Grid item xs className={classes.paperList}></Grid>
        <Grid item xs className={classes.citation}></Grid>
        {/* </Grid> */}
      </Grid>
      <Grid
        item
        xs={4}
        className={classes.paperColumn}
        container
        direction="column"
      >
        {/* <Grid item xs container direction="column"> */}
        <Grid item xs className={classes.paperList}>
          <Box height={700} className={classes.detail}></Box>
        </Grid>
        <Grid item xs className={classes.citation}></Grid>
        {/* </Grid> */}
      </Grid>
      <Grid item xs={5} className={classes.infoColumn} container>
        <Grid item xs container direction="column">
          <Grid item xs className={classes.graph}></Grid>
          <Grid item xs className={classes.detail}></Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
