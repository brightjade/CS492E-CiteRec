import { observer } from "mobx-react-lite";
import { useStores } from "../hooks/useStores";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from "@material-ui/core";
// import {  } from "@material-ui/icons";
import { RemoveCircle } from "@material-ui/icons";
import { PaperStatus } from "../stores/PaperStore";
import { green, red } from "@material-ui/core/colors";

const PaperList = observer(function PaperList(props) {
  const { ui, papers } = useStores();
  return (
    <List>
      {papers.papersOnPage.map((paper, index) => {
        return (
          <ListItem
            key={index}
            dense
            button
            selected={paper.id === papers.selectedPaper}
            onClick={() => {
              papers.selectPaper(paper.id);
            }}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={paper.status == PaperStatus.Added}
                tabIndex={-1}
                disableRipple
                onClick={() => {
                  papers.togglePaper(paper.id);
                }}
              />
            </ListItemIcon>
            <ListItemText
              disableTypography
              primary={
                <Typography
                  type="body2"
                  style={{
                    color: `${
                      paper.status == PaperStatus.Added
                        ? green[700]
                        : paper.status == PaperStatus.Blacklisted
                        ? red[700]
                        : "#000000"
                    }`,
                  }}
                >
                  {paper.name}
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                onClick={() => {
                  papers.changeStatus(paper.id, PaperStatus.Blacklisted);
                }}
                edge="end"
                aria-label="blacklist"
              >
                <RemoveCircle />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
});

export default PaperList;
