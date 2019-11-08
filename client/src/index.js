import React from 'react';
import {Component, sharedComponentData} from 'react-simplified';
import ReactDOM from 'react-dom';
import {
    Button,
    Typography,
    Box,
    AppBar,
    Tabs,
    Tab,
    TextField,
    MenuItem,
    Toolbar,
    IconButton,
    Menu,
    Card,
    CardActionArea,
    CardContent,
    CardActions,
    CardMedia,
    Grid
} from '@material-ui/core';
import {BrowserRouter, Route, NavLink, Switch} from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {ArticleStore, CategoryStore, User, Comment} from "./model.js";
import AddIcon from "@material-ui/icons/Add";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {useStyles} from "./styles.js";
import {green} from "@material-ui/core/colors";

let comments: Comment[];
let users: User[];
let currentUser: User;
let authorized: boolean = true;
let articleStore = sharedComponentData(new ArticleStore());
let categoryStore = sharedComponentData(new CategoryStore());
let categoryTab: number;

let setAuthorized = auth => {
    authorized = auth;
};

let setCategoryTab = tab => {
    categoryTab = tab;
};

users = [new User('Magnus', '#'), new User('Mikael', '#'), new User('Thomas', '#')];
comments = [new Comment(users[0], 'Hei'), new Comment(users[1], 'Jabbadabbadoo'), new Comment(users[2], 'SomeBODY ONCE TOLD ME'),];
currentUser = users[0];

class Tag extends Component<{ props: { text: string, linkTo: string } }>
{
    render()
    {
        return (<a href={this.props.linkTo}> <i className="fa fa-tag" aria-hidden="true"/> {this.props.text} </a>);
    }
}

function CommentField()
{
    const [values, setValues] = React.useState(currentUser);

    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value});
    };

    return (
        <form className='commentField'>
            <TextField
                id="outlined-full-width"
                label="Label"
                style={{margin: 8}}
                placeholder="Placeholder"
                helperText="Full width!"
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </form>
    );
}

function CommentList()
{
    return (
        <div>
            <ul>
                {comments.map(comment => (
                    <div>
                        <a href={comment.commenter.link}><h4>{comment.commenter.name}</h4></a>
                        <div>{comment.text}</div>
                    </div>
                ))}
            </ul>
            <CommentField/>
        </div>
    );
}

function TabList(props)
{
    const [isLoading, setIsLoading] = React.useState(true);
    const classes = useStyles();

    const handleChange = (event, newValue) => {
        articleStore.getArticlesByCategory(newValue).then(response => {
            props.setValue(newValue);
            articleStore.setArticles(response);
            setIsLoading(false);
        }).catch(error => console.error(error))
        setCategoryTab(newValue);
        setAuthorized(true);
    };

    React.useEffect(() => {
        categoryStore.getCategories().then(response => {
            categoryStore.setCategories(response);
            setIsLoading(false);
        }).catch(error => console.error(error))
    }, [categoryTab]);

    return (
        <Tabs value={categoryTab} onChange={handleChange} aria-label="top navbar">
            {isLoading && <p>Loading...</p>}
            {categoryStore.categories.map((tab) => {
                return <Tab
                    label={tab.categoryName}
                    {...tabProps(tab.categoryId)}
                    component={NavLink}
                    to={`/category/${tab.categoryId}`}
                />
            })}
        </Tabs>
    );
}

function tabProps(index)
{
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
        key: index
    };
}

function NavBar(props)
{
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const classes = useStyles();
    let p = props;

    const handleMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Button href="/" className={classes.button}>
                    <i className="fa fa-newspaper-o">StartSide</i>
                </Button>
                <TabList setValue={p.setValue}/>
                <div className={classes.searchBar}>
                    <Box display="flex" flexDirection="row">
                        <TextField
                            id="outlined-search"
                            label="Search field"
                            type="search"
                            className={classes.searchField}
                            margin="normal"
                            variant="outlined"
                        />
                        <IconButton
                            aria-label="search button"
                            aria-controls="outlined-search"
                            aria-haspopup="false"
                            color="inherit"
                            type="submit"
                            className={classes.searchButton}
                        >
                            <i className="fa fa-search"/></IconButton>
                    </Box>
                </div>
                {authorized && (
                    <div>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleClose}>My account</MenuItem>
                            <MenuItem onClick={handleClose}>Log out</MenuItem>
                        </Menu>
                    </div>
                    &&
                    <div>
                        <NavLink to="/new" className={classes.navlink}><Button className={classes.button}><AddIcon/>New
                            article</Button></NavLink>
                    </div>
                )}
            </Toolbar>
        </AppBar>
    )
}

function FrontPage(props)
{
    const [isLoading, setIsLoading] = React.useState(true);
    const [auth, setAuth] = React.useState(true);
    let classes = useStyles();
    let p = props;

    React.useEffect(() => {
        articleStore.getArticles().then(response => {
            articleStore.setArticles(response);
            setIsLoading(false);
        }).catch(error => console.error(error))
    }, [isLoading]);

    return (
        <div aria-label="main content" className={classes.root}>
            <Grid container direction="row" justify="row-begin" alignItems="stretch" id="grid" className={classes.grid}>
                {isLoading && <Card className={classes.loadingCard}><CardContent><Typography
                    varian="h5">Loading...</Typography></CardContent></Card>}
                {articleStore.articles.map((article) => {
                    return (
                        <Grid item xs={12} sm={5} md={4} lg={3} xl={2} key={`grid-item-${article.id}`}>
                            <ArticleCard props={article} key={article.id} id={`article-${article.id}`}/>
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
}

export function ArticleCard(props)
{
    let classes = useStyles();
    let p = props.props;

    return (
        <Card className={classes.articleShort}>
            <NavLink to={`/article/${p.id}`} className={classes.navlink}>
                <CardActionArea href={`/article/${p.id}`}>
                    {p.imageUrl ? (
                        <CardMedia
                            component="img"
                            alt={p.caption}
                            height="140"
                            image={p.imageUrl}
                            title={p.caption}
                        />) : (<></>)}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.cardCaption}>
                            {p.caption}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.cardText}>
                            {p.content.substring(0, 100) + (p.content.substring(0, 100).length < p.content.length ? '...' : '')}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </NavLink>
            <CardActions></CardActions>
        </Card>
    );
}

function CategoryView(props)
{
    const [isLoading, setIsLoading] = React.useState(true);
    let classes = useStyles();
    props.setValue(props.match.params.id);

    React.useEffect(() => {
        articleStore.getArticlesByCategory(props.match.params.id).then(response => {
            articleStore.setArticles(response);
            setIsLoading(false);
        }).catch(error => console.error(error))
    }, [isLoading]);

    return (
        <div aria-label="main content" className={classes.root}>
            <Grid container direction="row" justify="row-begin" alignItems="stretch" id="grid" className={classes.grid}>
                {isLoading && <Card className={classes.loadingCard}><CardContent><Typography
                    varian="h5">Loading...</Typography></CardContent></Card>}
                {articleStore.articles.map((article) => {
                    return (
                        <Grid item xs={12} sm={5} md={4} lg={3} xl={2}>
                            <ArticleCard props={article} key={article.id} id={`article-${article.id}`}/>
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
}

function ArticleView(props)
{
    const [isLoading, setIsLoading] = React.useState(true);
    let classes = useStyles();

    React.useEffect(() => {
        articleStore.getArticlesById(props.match.params.id).then(response => {
            articleStore.setArticles(response);
            setIsLoading(false);
        }).catch(error => console.error(error));
    }, [isLoading]);

    return (
        <div aria-label="main content" className={classes.root}>
            {isLoading && <Card className={classes.loadingCard}><CardContent><Typography
                varian="h5">Loading...</Typography></CardContent></Card>}
            {articleStore.articles.map(article => {
                return (
                    <div>
                        {article.imageUrl ?
                            <img src={article.imageUrl} alt={article.caption} title={article.caption}/> : <></>}
                        <h1>{article.caption}</h1>
                        <a href={`/user/${article.writerId}`}>{article.writerId}</a>
                        <div>{article.createdAt} {console.log(article.createdAt)}</div>
                        <div>{article.content}</div>
                    </div>
                );
            })}
        </div>
    );
}

const theme = createMuiTheme({
    palette: {
        primary: green,
    },
});

function NewArticleView()
{
    const classes = useStyles();
    const [caption, setCaption] = React.useState("");
    const [imgUrl, setImgUrl] = React.useState("");
    const [text, setText] = React.useState("");

    const handleSubmit = event => {
        articleStore.postArticle({
            caption: caption,
            imageUrl: imgUrl,
            content: text,
            categoryId: 0,
            priority: 0
        }).then(response => alert(response));
    };

    return (
        <form onSubmit={handleSubmit}>
            <ThemeProvider theme={theme}>
                <div>
                    <TextField
                        required
                        id="iptCaption"
                        label="Caption"
                        defaultValue=""
                        className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        InputProps={{className: classes.input}}
                        value={caption}
                        onChange={e => {
                            setCaption(e.target.value);
                            let img = document.getElementById("inputImage");
                            if (img)
                            {
                                img.alt = e.target.value;
                                img.title = e.target.value;
                            }
                        }}
                    />
                </div>
                <div>
                    <TextField
                        required
                        id="iptImage"
                        label="Image URL"
                        defaultValue=""
                        className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        InputProps={{className: classes.input}}
                        value={imgUrl}
                        onChange={e => {
                            setImgUrl(e.target.value);
                            let img = document.getElementById("inputImage");
                            if (img) img.src = e.target.value;
                        }}
                    />
                </div>
                <img src="" id="inputImage" alt="" title="" className={classes.image}/>
                <div>
                    <TextField
                        id="iptText"
                        label="Text"
                        className={classes.textField}
                        fullWidth
                        multiline
                        required
                        margin="normal"
                        InputLabelProps={{
                            color: "#fff"
                        }}
                        InputProps={{className: classes.input}}
                        variant="outlined"
                        value={text}
                        onChange={e => {
                            setText(e.target.value)
                        }}
                    />
                </div>
                <div>
                    <Button type="submit" label="Submit" className={classes.submitButton}>Submit</Button>
                </div>
            </ThemeProvider>
        </form>
    )
}

function App(props)
{
    let classes = useStyles();
    const [value, setValue] = React.useState(-1);
    return (
        <div className={classes.app}>
            <header className="topnav">
                <NavBar setValue={setValue}/>
            </header>
            <div id='mainContent'>
                <div style={{height: "10px"}}/>
                <Switch>
                    <Route exact path="/"><FrontPage value={value} setValue={setValue}/></Route>
                    <Route path="/category/:id"
                           render={(props) => <CategoryView {...props} value={value} setValue={setValue}/>}/>
                    <Route path="/article/:id" component={ArticleView}/>
                    <Route path="/new" component={NewArticleView}/>
                </Switch>
                {/*props.children*/}
            </div>

            <footer id='footer'>

            </footer>
        </div>
    );
}

const root = document.getElementById('app');
if (root)
{
    ReactDOM.render(
        <BrowserRouter>
            <App>

                {/*<HashRouter>
                <Route exact path="/" component={FrontPage}/>
                <Route path="/category/:id" component={CategoryView}/>
                <Route path="/article/:id" component={ArticleView}/>
            </HashRouter>*/}
            </App>
        </BrowserRouter>
        ,
        root
    );
}