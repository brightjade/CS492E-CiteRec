import { observer } from "mobx-react-lite";
import { useStores } from "../hooks/useStores";
import { List, ListItem } from "@material-ui/core";

const PaperList = observer(function PaperList(props) {
  const { ui, papers } = useStores();
  return (
    <List>
      {papers.papersOnPage(ui.pageNum).map((paper) => {
        return <ListItem>{paper.name}</ListItem>;
      })}
    </List>
  );
});

export default PaperList;
