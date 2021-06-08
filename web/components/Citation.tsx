import { Box, Paper, Button, Modal, Grid } from "@material-ui/core";
import { DoneAll } from "@material-ui/icons";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { useStores } from "../hooks/useStores";
import { observer } from "mobx-react-lite";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";

const chartStyles = makeStyles({
  addedCitationsContainer: {
    maxHeight: "200px",
    overflow: "auto",
    padding: "0px 10px",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const Citation = observer(function Citation() {
  const styles = chartStyles();
  const { ui, papers } = useStores();
  const [copied, setCopied] = useState(false);

  // handles further recommendation button (API CALL)
  const onFurtherRecommend = () => {
    // console.log("recommending");
    if (papers.allAddedPapers.length < 2) {
      alert("You must have at least two added papers for further recommendation.");
    } else {
      ui.setLoading(true);
      papers.getMorePapers(ui);
    }
  };

  return (
    <Box>
      <Modal
        open={copied}
        className={styles.modal}
        onClose={() => setCopied(false)}
      >
        {
          <Paper>
            <Box p={2}>
              <DoneAll fontSize="large" />
              <Box component="span" display="block" p={2}>
                Copied to Clipboard! Would you like to start over?
              </Box>
              <Grid container justify="center">
                <Box pr={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setCopied(false)}
                  >
                    Continue
                  </Button>
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    papers.drop();
                    setCopied(false);
                    ui.setSelectedText("");
                    ui.setLoading(false);
                    ui.setK(30);
                    papers.selectPaper("");
                    papers.setPage(1);
                  }}
                >
                  Start Over
                </Button>
              </Grid>
            </Box>
          </Paper>
        }
      </Modal>
      {papers.allAddedPapers.length > 0 ? (
        <Box p={2}>
          <h3 style={{ padding: "0px 10px" }}>References</h3>
          <Paper className={styles.addedCitationsContainer}>
            <Box p={1}>
              {papers.allAddedPapers.map((paper) => {
                return (
                  <p>{paper.authors}. <b>{paper.name}</b>, {paper.date.substring(0, 4)}.</p>
                );
              })}
            </Box>
          </Paper>
          <Box component="span" display="block" style={{ margin: "10px 0px" }}>
              <CopyToClipboard
                text={papers.toText}
                onCopy={() => setCopied(true)}
              >
                <Button color="primary"> Copy To Clipboard </Button>
              </CopyToClipboard>
              {ui.loading ? (
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: "10px" }}
                  disabled
                  onClick={onFurtherRecommend}
                >
                  Recommending...
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    ui.setK(30);
                    onFurtherRecommend();
                  }}
                >
                  Further Recommend
                </Button>
              )}
          </Box>
        </Box>
      ) : (
        ""
      )}
    </Box>
  );
});

export default Citation;
