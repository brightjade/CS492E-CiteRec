import {
  Box,
  Button,
  Grid,
  makeStyles,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  Tooltip,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { observer } from "mobx-react-lite";
import { useStores } from "../hooks/useStores";
import {
  CategorySelection,
  Input,
  PaperList,
  InteractiveChart,
  PaperDetail,
  Citation,
} from "../components";
import { AddBox } from "@material-ui/icons";

// const chartStyles = makeStyles({
//   container: {
//     width: "100%",
//     height: "100%",
//   },
//   selectedCitationContainer: {
//     height: "35%",
//     // minHeight: "fit-content",
//     // maxHeight: "380px",
//     overflow: "auto",
//     margin: "10pt",
//   },
//   addedCitationsContainer: {
//     height: "30%",
//     overflowY: "scroll",
//   },
//   buttonContainer: {
//     margin: "10px",
//   },
//   title: {
//     flexGrow: 1,
//   },
//   content: { width: "100%", height: "100%" },
// });

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "100%",
    height: "92vh",
  },
  inputColumn: {
    // backgroundColor: "#a87936",
  },
  paperColumn: {
    // backgroundColor: "#182946",
  },
  infoColumn: {
    // backgroundColor: "#267827",
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  paperList: {
    marginTop: "10px",
    minHeight: "400px",
    // backgroundColor: "#00f326",
    overflow: "scroll",
  },
  citation: {
    // maxHeight: "400px",
    // overflow: "scroll",
    // backgroundColor: "#003746",
  },
  detail: {
    marginTop: "10px",
    // backgroundColor: "#f238f1",
  },
  title: {
    flexGrow: 1,
  },
}));

const Home = observer(function Home() {
  const { ui, papers } = useStores();
  const classes = useStyles();

  // handles page change (pagination)
  const onChange = (e, page: number) => {
    papers.setPage(page);
    // if ((papers.extraPages + page) * papers.pageSize > ui.k) {
    //   const original = ui.k;
    //   ui.setK((papers.extraPages + papers.pageCount) * papers.pageSize);
    //   console.log(`exceeded: ${original}`);
    //   onRecommend();
    // }
  };

  // handles recommendation button (API CALL)
  const onRecommend = () => {
    // console.log("recommending");
    if (ui.selectedText === "") {
      alert("You must input text for recommendations.");
    } else if (ui.selectedText.length <= 10) {
      alert(
        "The query string is too short. Must be greater than 10 characters."
      );
    } else {
      ui.setLoading(true);
      papers.getPapers(ui);
    }
  };

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Box height="8vh">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              ICARUS: Interactive CitAtion Recommender with User-centered System
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
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
          {/* Textarea to fetch user query */}
          <Input />
          {/* Radio buttons for choosing category */}
          <CategorySelection />
          <Box component="span" display="block" m={2}>
            <Grid container direction="row" justify="space-between">
              <Box component="div" display="inline" pr={2}>
                <Tooltip
                  enterDelay={700}
                  title={"Clear results, but keep added and blacklisted papers"}
                  arrow
                >
                  <Button
                    onClick={() => papers.clearDeselected()}
                    color="secondary"
                    variant="outlined"
                  >
                    Clear Results
                  </Button>
                </Tooltip>
              </Box>
              <Box component="div" display="inline">
                <Tooltip enterDelay={700} title={"Start from scratch"} arrow>
                  <Button
                    onClick={() => {
                      papers.drop();
                      ui.setSelectedText("");
                      ui.setLoading(false);
                      ui.setK(30);
                      papers.selectPaper("");
                      papers.setPage(1);
                    }}
                    variant="outlined"
                    color="secondary"
                  >
                    Start Over
                  </Button>
                </Tooltip>
              </Box>
            </Grid>
            <Grid container justify="flex-end">
              <Box pt={2}>
                {ui.loading ? (
                  <Button
                    variant="contained"
                    color="primary"
                    disabled
                    onClick={onRecommend}
                  >
                    Loading Results...
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      ui.setK(30);
                      onRecommend();
                    }}
                  >
                    Search
                  </Button>
                )}
              </Box>
            </Grid>
          </Box>
        </Grid>
        <Grid
          item
          xs={5}
          className={classes.paperColumn}
          container
          direction="column"
        >
          <Grid item xs className={classes.paperList}>
            {/* <Paper className={styles.selectedCitationContainer}> */}
            <PaperList />
            {/* </Paper> */}
          </Grid>

          <Grid item container justify="center">
            <Box marginY={1}>
              {papers.papers.length == 0 ? (
                <Box></Box>
              ) : (
                <Pagination
                  page={papers.pageNum}
                  count={papers.pageCount}
                  onChange={onChange}
                  variant="outlined"
                  color="primary"
                />
              )}
            </Box>
          </Grid>
          <Grid item xs className={classes.citation}>
            {/* <Box style={{ maxHeight: "300px", overflow: "scroll" }}> */}
            <Citation />
            {/* </Box> */}
          </Grid>
        </Grid>
        <Grid
          item
          xs={4}
          className={classes.infoColumn}
          container
          direction="column"
        >
          {papers.papers.length == 0 ? (
            <Box></Box>
          ) : (
            <Box>
              <Grid item xs>
                <InteractiveChart />
              </Grid>

              {papers.selectedPaper == "" ? (
                <Box></Box>
              ) : (
                <Grid item xs className={classes.detail}>
                  <Paper>
                    <PaperDetail />
                  </Paper>
                </Grid>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
});

export default Home;
