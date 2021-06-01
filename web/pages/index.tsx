import { Box, Button, Grid } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { observer } from "mobx-react-lite";
import { useStores } from "../hooks/useStores";
import { Input, PaperList, InteractiveChart } from "../components";

const Home = observer(function Home() {
  const { ui } = useStores();
  const onChange = (e, page: number) => {
    ui.setPage(page);
  };
  return (
    <Grid container>
      <Grid item xs={4}>
        <Input />
        <Box m={2}>
          <Grid container justify="flex-end">
            <Button variant="contained" color="primary">
              Recommend
            </Button>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box height={400}>
          <PaperList />
        </Box>
        <Pagination
          page={ui.pageNum}
          count={10}
          onChange={onChange}
          variant="outlined"
          color="primary"
        />
      </Grid>
      <Grid item xs={4}>
        <Box>
          <InteractiveChart />
        </Box>
      </Grid>
    </Grid>
  );
});

export default Home;
