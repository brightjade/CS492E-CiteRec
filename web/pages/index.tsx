import { Box, Button, Grid, makeStyles } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { observer } from "mobx-react-lite";
import { useStores } from "../hooks/useStores";
import { Input, PaperList, InteractiveChart, PaperDetail } from "../components";
import axios from "axios";

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

const Home = observer(function Home() {
  const { ui, papers } = useStores();
  const styles = chartStyles();
  const onChange = (e, page: number) => {
    papers.setPage(page);
    if ((papers.extraPages + page) * papers.pageSize > ui.k) {
      const original = ui.k;
      ui.setK((papers.extraPages + papers.pageCount) * papers.pageSize);
      console.log(`exceeded: ${original}`);
      onRecommend(original);
    }
  };
  const onRecommend = (original) => {
    if (ui.selectedText === "") {
      alert("You must input text for recommendations.");
    } else if (ui.selectedText.length <= 10) {
      alert(
        "The query string is too short. Must be greater than 10 characters."
      );
    } else {
      ui.setLoading(true);
      axios
        // .post(`http://icarus-env.eba-ypad3uwi.us-east-2.elasticbeanstalk.com/api/recommend_papers`, {
        .post(`http://localhost:8080/api/recommend_papers`, {
          userInput: ui.selectedText,
          K: ui.k, // TODO: let user choose K
        })
        .then((res) => {
          ui.setLoading(false);

          // clear previous recommendations
          // papers.clearRecommendations();

          // add query
          if (original == 0) {
            papers.addQuery(
              "0", // reserve ID#0 for query vector
              res.data[0].text,
              parseFloat(res.data[0].x),
              parseFloat(res.data[0].y),
              res.data[0].embedding
            );
          }

          // add recommended papers to the list
          res.data.slice(original + 1).map((dict, idx) => {
            papers.recommendPaper(
              (idx + original + 1).toString(),
              dict.pid,
              dict.authors,
              dict.title,
              dict.categories,
              dict.date,
              parseFloat(dict.x),
              parseFloat(dict.y),
              dict.embedding
            );
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <Grid container>
      <Grid item xs={3}>
        <Input />
        <Box m={2}>
          <Grid container justify="flex-end">
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
                onClick={() => onRecommend(0)}
              >
                Recommend
              </Button>
            )}
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
        <Box>
          <div className={styles.container}>
            <InteractiveChart />

            <PaperDetail />
          </div>
        </Box>
      </Grid>
    </Grid>
  );
});

export default Home;
