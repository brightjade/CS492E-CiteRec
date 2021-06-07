import { Box, Button, Grid, makeStyles } from "@material-ui/core";
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

const chartStyles = makeStyles({
  container: {
    width: "100%",
    height: "100%",
  },
  selectedCitationContainer: {
    minHeight: "10%",
  },
  addedCitationsContainer: {
    height: "30%",
    overflowY: "scroll",
  },
  buttonContainer: {
    margin: "10px",
  },
});

const Home = observer(function Home() {
  const { ui, papers } = useStores();
  const styles = chartStyles();

  // handles page change (pagination)
  const onChange = (e, page: number) => {
    papers.setPage(page);
    if ((papers.extraPages + page) * papers.pageSize > ui.k) {
      const original = ui.k;
      ui.setK((papers.extraPages + papers.pageCount) * papers.pageSize);
      console.log(`exceeded: ${original}`);
      onRecommend();
    }
  };

  // handles recommendation button (API CALL)
  const onRecommend = () => {
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
    <Grid container>
      <Grid item xs={3}>
        {/* Textarea to fetch user query */}
        <Input />

        {/* Radio buttons for choosing category */}
        <CategorySelection />

        <Box component="span" display="block" m={2}>
          <Grid container direction="row" justify="space-between">
            <Box component="div" display="inline" pr={2}>
              <Button
                onClick={() => papers.clearDeselected()}
                color="secondary"
                variant="outlined"
              >
                Clear Non-Added
              </Button>
            </Box>
            <Box component="div" display="inline">
              <Button
                onClick={() => papers.drop()}
                variant="outlined"
                color="secondary"
              >
                Start Over
              </Button>
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
                  Recommending...
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onRecommend}
                >
                  Recommend
                </Button>
              )}
            </Box>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={5}>
        <Box height={700}>
          <PaperList />
        </Box>
        <Pagination
          page={papers.pageNum}
          count={papers.pageCount}
          onChange={onChange}
          variant="outlined"
          color="primary"
        />
      </Grid>
      <Grid item xs={4}>
        <Box
          p={2}
          className={styles.container}
          component="span"
          display="block"
        >
          {/* {papers.papers.length == 0 ? (
          <Box></Box>
        ) : ( */}
          <InteractiveChart />

          <PaperDetail />

          <Citation />
        </Box>
        {/* )} */}
      </Grid>
    </Grid>
  );
});

export default Home;
