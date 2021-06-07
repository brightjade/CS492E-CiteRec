//@ts-check
import { observer } from "mobx-react-lite";
import { useStores } from "../hooks/useStores";
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@material-ui/core";

const CategorySelection = observer(function Input(props) {
  const { ui } = useStores();
  const onChange = (e, category: string) => {
    ui.setCategory(category);
  };
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Categories</FormLabel>
      <RadioGroup row aria-label="categories" name="categories" value={ui.category} onChange={onChange}>
        <FormControlLabel value="AI" control={<Radio />} label="cs.AI(33664)" />
        <FormControlLabel value="CL" control={<Radio />} label="cs.CL(26933)" />
        <FormControlLabel value="CV" control={<Radio />} label="cs.CV(57363)" />
        <FormControlLabel value="HC" control={<Radio />} label="cs.HC(7796)" />
        <FormControlLabel value="IT" control={<Radio />} label="cs.IT(35588)" />
        <FormControlLabel value="LG" control={<Radio />} label="cs.LG(82367)" />
      </RadioGroup>
    </FormControl>
  );
});

export default CategorySelection;
