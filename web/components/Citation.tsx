import { Box, Paper, Button, Modal, Grid } from "@material-ui/core";
import { DoneAll } from "@material-ui/icons";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { useStores } from "../hooks/useStores";
import { observer } from "mobx-react-lite";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";

const chartStyles = makeStyles({
  addedCitationsContainer: {
    overflowY: "scroll",
    padding: "10px",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const Citation = observer(function Citation() {
  const styles = chartStyles();
  // const data = dataGenerator(100);
  const { ui, papers } = useStores();
  const [copied, setCopied] = useState(false);
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
                    papers.setPage(0);
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
          <Paper className={styles.addedCitationsContainer}>
            <Box p={1}>{papers.toText}</Box>
            <Box component="span" display="block">
              <CopyToClipboard
                text={papers.toText}
                onCopy={() => setCopied(true)}
              >
                <Button color="primary"> Copy To Clipboard </Button>
              </CopyToClipboard>
            </Box>
          </Paper>
        </Box>
      ) : (
        ""
      )}
    </Box>
  );
});

export default Citation;
