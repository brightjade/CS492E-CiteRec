//@ts-check
import { observer } from "mobx-react-lite";
import { useStores } from "../hooks/useStores";
import { TextField, Box, Typography } from "@material-ui/core";

const Input = observer(function Input(props) {
  const { ui } = useStores();
  const onChange = (e) => {
    ui.setSelectedText(e.target.value);
  };
  console.log(`: ${ui.selectedText}`);
  return (
    <Box m={2}>
      <TextField
        id="outlined-multiline-static"
        label="Multiline"
        multiline
        fullWidth
        onChange={onChange}
        rows={8}
        defaultValue="Default Value"
        variant="outlined"
      />
      {/* <Typography>{ui.selectedText}</Typography> */}
    </Box>
  );
});

export default Input;
