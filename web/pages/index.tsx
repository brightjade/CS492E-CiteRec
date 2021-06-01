import Input from "../components/Input";
import { Box, Button, Grid } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import PaperList from "../components/PaperList";
import { observer } from "mobx-react-lite";
import { useStores } from "../hooks/useStores";

const Home = observer(function Home() {
  const { ui } = useStores();
  const onChange = (e, page: number) => {
    ui.setPage(page);
  };
  return (
    <Box p={2} m={2} width={400}>
      <Input />
      <Box m={2}>
        <Grid container justify="flex-end">
          <Button variant="contained" color="primary">
            Recommend
          </Button>
        </Grid>
      </Box>
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
    </Box>
  );
});

export default Home;
