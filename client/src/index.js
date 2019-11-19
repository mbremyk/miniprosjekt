// @flow

import React from 'react';
import {Component, sharedComponentData} from 'react-simplified';
import ReactDOM from 'react-dom';
import {
    AppBar,
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Tab,
    Tabs,
    TextField,
    Toolbar,
    Typography
} from '@material-ui/core';
import {BrowserRouter, NavLink, Route, Switch} from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {ArticleStore, CategoryStore, Comment, User} from "./model.js";
import AddIcon from "@material-ui/icons/Add";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {useStyles} from "./styles.js";
import {green} from "@material-ui/core/colors";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Marquee from 'grand-marquee-react';
import './Marquee.css';

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
        }).catch(error => console.error(error));
        setCategoryTab(newValue);
        setAuthorized(true);
    };

    React.useEffect(() => {
        categoryStore.getCategories().then(response => {
            categoryStore.setCategories(response);
            setIsLoading(false);
        }).catch(error => console.error(error))
    });

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
                <Button
                    label={<div><i className="fa fa-newspaper-o"/>StartSide</div>}
                    to="/"
                    component={NavLink}
                ><i className="fa fa-newspaper-o"/>StartSide</Button>
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
                            onChange={e => p.setSearch(e.target.value)}
                        />
                        <IconButton
                            aria-label="search button"
                            aria-controls="outlined-search"
                            aria-haspopup="false"
                            color="inherit"
                            type="submit"
                            className={classes.searchButton}
                            component={NavLink}
                            to={`/search/${p.search}`}
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
            <Grid container direction="row" justify="flex-start" alignItems="stretch" id="grid"
                  className={classes.grid}>
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

            <CardActionArea component={NavLink} to={`/article/${p.id}`}>
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
                        <Grid item xs={12} sm={5} md={4} lg={3} xl={2} key={article.id}>
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
            props.setValue(response[0]);
            setIsLoading(false);
        }).catch(error => console.error(error));
    }, [isLoading]);

    return (
        <div aria-label="main content" className={classes.root}>
            {isLoading && <Card className={classes.loadingCard}><CardContent><Typography
                varian="h5">Loading...</Typography></CardContent></Card>}
            {!isLoading && articleStore.articles.map(article => {
                return (
                    <div>
                        {article.imageUrl ?
                            <img src={article.imageUrl} alt={article.caption} title={article.caption}/> : <></>}
                        <h1>{article.caption}</h1>
                        <a href={`/user/${article.writerId}`}>{article.writerId}</a>
                        <div>{article.createdAt}</div>
                        <div>{article.content}</div>
                        {authorized &&
                        <Button to={`/edit/${article.id}`} component={NavLink}
                                className={classes.submitButton}>Edit</Button>}
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
    const [priority, setPriority] = React.useState(1);
    const [category, setCategory] = React.useState(1);
    const priorityLabel = React.useRef(1);
    const categoryLabel = React.useRef(0);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(priorityLabel.current.offsetWidth);
        setLabelWidth(categoryLabel.current.offsetWidth);
    }, []);

    const handleSubmit = event => {
        articleStore.postArticle({
            caption: caption,
            imageUrl: imgUrl,
            content: text,
            categoryId: category,
            priority: priority
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
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel ref={priorityLabel} id="priorityLabel">
                            Priority
                        </InputLabel>
                        <Select
                            labelId="priorityLabel"
                            id="priorityLabel"
                            value={priority}
                            onChange={e => setPriority(e.target.value)}
                            labelWidth={labelWidth}
                        >
                            <MenuItem value={0}>High</MenuItem>
                            <MenuItem value={1}>Low</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel ref={categoryLabel} id="categoryLabel">
                            Category
                        </InputLabel>
                        <Select
                            labelId="categoryLabel"
                            id="categoryLabel"
                            value={category}
                            onChange={e => {
                                setCategory(e.target.value);
                                console.log(e.target.value)
                            }}
                            labelWidth={labelWidth}
                        >
                            {categoryStore.categories.map(category => {
                                return <MenuItem value={category.categoryId}
                                                 key={`category-${category.categoryId}`}>{category.categoryName}</MenuItem>
                            })};
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <Button type="submit" label="Submit" className={classes.submitButton}>Submit</Button>
                </div>
            </ThemeProvider>
        </form>
    )
}

function EditArticleView(props)
{
    const classes = useStyles();
    const [isLoading, setIsLoading] = React.useState(true);
    const [caption, setCaption] = React.useState(props.value.caption);
    const [imgUrl, setImgUrl] = React.useState(props.value.imageUrl);
    const [text, setText] = React.useState(props.value.content);
    const [open, setOpen] = React.useState(false);
    const [priority, setPriority] = React.useState(props.value.priority);
    const inputLabel = React.useRef(1);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    React.useEffect(() => {
        articleStore.getArticlesById(props.value.id)
                    .then(response => {
                        articleStore.setArticles(response);
                        setIsLoading(false);
                        setCaption(response.caption);
                        setImgUrl(response.imageUrl);
                        setText(response.content);
                    })
                    .catch(error => console.error(error));
    }, []);

    const handleSubmit = event => {
        event.preventDefault();
        if (!caption) setCaption(articleStore.articles[0].caption);
        if (!imgUrl) setImgUrl(articleStore.articles[0].imageUrl);
        if (!text) setText(articleStore.articles[0].content);
        articleStore.articles[0].caption = caption;
        articleStore.articles[0].imageUrl = imgUrl;
        articleStore.articles[0].content = text;
        articleStore.articles[0].priority = priority;
        articleStore.updateArticle(articleStore.articles[0]).then(r => alert("Article updated"));
    };

    const handleClose = del => {
        setOpen(false);
        if (del)
        {
            articleStore.deleteArticle(props.value.id).then(r => alert("Article deleted"));
        }
    };

    const handleClick = () => {
        setOpen(true);
    };

    return (
        <div>
            {isLoading && <Card className={classes.loadingCard}><CardContent><Typography
                varian="h5">Loading...</Typography></CardContent></Card>}
            {!isLoading && articleStore.articles.map(article => {
                if (!caption) setCaption(articleStore.articles[0].caption);
                if (!imgUrl) setImgUrl(articleStore.articles[0].imageUrl);
                if (!text) setText(articleStore.articles[0].content);
                return (
                    <form onSubmit={handleSubmit}>
                        <ThemeProvider theme={theme}>
                            <div>
                                <TextField
                                    required
                                    id="iptCaption"
                                    label="Caption"
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
                            <img src={imgUrl} id="inputImage" alt="" title="" className={classes.image}/>
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
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel ref={inputLabel} id="inputLabel">
                                        Priority
                                    </InputLabel>
                                    <Select
                                        labelId="selectLabel"
                                        id="selectLabel"
                                        value={priority}
                                        onChange={e => setPriority(e.target.value)}
                                        labelWidth={labelWidth}
                                    >
                                        <MenuItem value={0}>High</MenuItem>
                                        <MenuItem value={1}>Low</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div>
                                <Button type="submit" label="Submit" className={classes.submitButton}
                                >Submit</Button>
                                <Button label="Delete"
                                        className={classes.submitButton}
                                        onClick={handleClick}
                                        aria-controls="confirmation-dialog"
                                        aria-haspopup="true"
                                >Delete</Button>
                            </div>
                            <ConfirmationDialog
                                id="confirmation-dialog"
                                keepMounted
                                open={open}
                                onClose={handleClose}
                                article={article}
                            />
                        </ThemeProvider>
                    </form>
                );
            })}
        </div>
    );
}

function ConfirmationDialog(props)
{
    const {onClose, open, article, ...other} = props;
    const handleCancel = () => {
        onClose(false);
    };

    const handleOk = () => {
        onClose(true);
    };

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            open={open}
            {...other}
        >
            <DialogTitle>Delete article</DialogTitle>
            <DialogContent>Are you sure you want to delete article <i>{article.caption}</i></DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="primary">Cancel</Button>
                <Button onClick={handleOk} color="primary" component={NavLink} to={`/`}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
}

function LiveFeed(props)
{
    const classes = useStyles();

    const [isLoading, setIsLoading] = React.useState(true);
    const [articles, setArticles] = React.useState([]);

    React.useEffect(() => {
        articleStore.getFirstArticles().then(response => {
            setArticles(response);
            setIsLoading(false);
        }).catch(error => console.error(error))
    }, [isLoading]);

    return (
        <div className="Marquee" style={{minHeight: "40px"}}>
            {isLoading && <div>Lodaing...</div>}
            {!isLoading && <Marquee
                totalDisplays={5}
                display1={<Button className={classes.marqueeButton} component={NavLink}
                                  to={`/article/${articles[0].id}`}>{articles[0].caption}</Button>}
                display2={<Button className={classes.marqueeButton} component={NavLink}
                                  to={`/article/${articles[1].id}`}>{articles[1].caption}</Button>}
                display3={<Button className={classes.marqueeButton} component={NavLink}
                                  to={`/article/${articles[2].id}`}>{articles[2].caption}</Button>}
                display4={<Button className={classes.marqueeButton} component={NavLink}
                                  to={`/article/${articles[3].id}`}>{articles[3].caption}</Button>}
                display5={<Button className={classes.marqueeButton} component={NavLink}
                                  to={`/article/${articles[4].id}`}>{articles[4].caption}</Button>}
                changeTime={16000}
                crossTime={16000}
                randomDisplayChange={false}
                color={'white'}
            />}
        </div>
    )
}

function SearchView(props)
{
    const classes = useStyles();
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        articleStore.getArticlesLike(props.value).then(response => {
            articleStore.setArticles(response);
            setIsLoading(false);
        }).catch(error => console.error(error))
    }, [isLoading]);

    return (
        <div aria-label="main content" className={classes.root}>
            <Grid container direction="row" justify="row-begin" alignItems="stretch" id="grid" className={classes.grid}>
                {isLoading && <Card className={classes.loadingCard}><CardContent><Typography
                    varian="h5">Loading...</Typography></CardContent></Card>}
                {!isLoading && articleStore.articles.map((article) => {
                    return (
                        <Grid item xs={12} sm={5} md={4} lg={3} xl={2} key={article.id}>
                            <ArticleCard props={article} key={article.id} id={`article-${article.id}`}/>
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    )
}

function App(props)
{
    let classes = useStyles();
    const [value, setValue] = React.useState(-1);
    const [currentArticle, setCurrentArticle] = React.useState({});
    const [search, setSearch] = React.useState("");

    return (
        <div className={classes.app}>
            <header className="topnav">
                <NavBar setValue={setValue} search={search} setSearch={setSearch}/>
            </header>
            <LiveFeed/>
            <div id='mainContent'>
                <div style={{height: "10px"}}/>
                <Switch>
                    <Route exact path="/"><FrontPage value={value} setValue={setValue}/></Route>
                    <Route path="/category/:id"
                           render={(props) => <CategoryView {...props} value={value} setValue={setValue}/>}/>
                    <Route path="/article/:id" render={(props) => <ArticleView {...props} value={currentArticle}
                                                                               setValue={setCurrentArticle}/>}/>
                    <Route path="/new" component={NewArticleView}/>
                    <Route path="/edit/:id" render={(props) => <EditArticleView {...props} value={currentArticle}
                                                                                setValue={setCurrentArticle}/>}/>
                    <Route path="/search/:search" render={(props) => <SearchView {...props} value={search}/>}/>
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
            </App>
        </BrowserRouter>
        ,
        root
    );
}