import makeStyles from "@material-ui/core/styles/makeStyles";

export const useStyles = makeStyles(theme => ({
    searchField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    searchButton: {
        paddingTop: 5,
        paddingBottom: 5
    },
    searchBar: {
        float: 'right'
    },
    toolbar: {},
    articleShort: {
        padding: theme.spacing(1),
        backgroundColor: "#333",
        color: "#fff",
        [theme.breakpoints.down("sm")]: {
            width: "100%",
        },
        [theme.breakpoints.up("md")]: {
            width: "90%",
            height: "90%",
            minHeight: "200px"
        }
    },
    app: {
        backgroundColor: "#212121",
    },
    cardText: {
        color: "#ddd"
    },
    root: {
        flexGrow: 1,
        backgroundColor: "#212121",
        color: "#fff"
    },
    navlink: {
        textDecoration: "inherit",
        color: "inherit"
    },
    cardCaption: {
        color: "#fff",
    },
    loadingCard: {
        backgroundColor: "#333",
        color: "#fff",
        width: "280px",
        height: "90%"
    },
    button: {
        color: "#fff",
        AddIcon: {
            fontSize: "large",
        },
    },
    textField: {
        color: "#ddd",
        backgroundColor: "#333"
    },
    input: {
        color: "#ddd",
    },
    grid: {
        [theme.breakpoints.up("md")]: {
            justifyContent: "row-begin",
        },
        [theme.breakpoints.only("sm")]: {
            justifyContent: "space-around",
        }
    },
    image: {
        maxWidth: "300px",
    },
    submitButton: {
        color: "#fff",
        backgroundColor: "#333",
        "&:hover": {
            backgroundColor: "#111"
        }
    },
    marqueeButton: {
        color: "#fff",
        "&:hover": {
            backgroundColor: "#111"
        }
    },
    commentText: {
        paddingLeft: "20px"
    }
}));