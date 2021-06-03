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
  };
  const onRecommend = () => {
    // axios.post(`http://icarus-env.eba-ypad3uwi.us-east-2.elasticbeanstalk.com/api/recommend_papers`, {
    axios.post(`http://localhost:5000/api/recommend_papers`, {
      userInput: ui.selectedText,
      K: 20, // TODO: let user choose K
    }).then(res => {
      // ui.setLoading(true);

        // clear previous recommendations
        papers.clearRecommendations();

      // add query
      papers.addQuery(
        "0",  // reserve ID#0 for query vector
        res.data[0].text,
        parseFloat(res.data[0].x),
        parseFloat(res.data[0].y),
        res.data[0].embedding,
      );

      // add recommended papers to the list
      res.data.slice(1).map((dict, idx) => {
        papers.recommendPaper(
          (idx+1).toString(),
          dict.pid,
          dict.authors,
          dict.title,
          dict.categories,
          dict.date,
          parseFloat(dict.x),
          parseFloat(dict.y),
          dict.embedding,
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Grid container>
      <Grid item xs={4}>
        <Input />
        <Box m={2}>
          <Grid container justify="flex-end">
            <Button variant="contained" color="primary" onClick={onRecommend}>
              Recommend
            </Button>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box>
          <PaperList />
        </Box>
        <Pagination
          page={papers.pageNum}
          count={10}
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
