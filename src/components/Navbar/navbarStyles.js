import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: "30px 0",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 50px",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  toolbar: {
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "0px",
    },
  },
  margins: {
    marginRight: "10px",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "10px",
      marginRight: "0px",
    },
  },
  box: {
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "10px",
      flexDirection: "column",
    },
  },
}));
