import {Component} from "react-simplified";
import {PropTypes} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import React from "react";

class TabPanel extends Component<{ children?: PropTypes.node, value: PropTypes.any.isRequired, index: PropTypes.any.isRequired, other: [] }>
{
    render()
    {
        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={this.props.value !== this.props.index}
                id={`simple-tabpanel-${this.props.index}`}
                aria-labelledby={`simple-tab-${this.props.index}`}
                {...this.props.other}
            >
                <Box p={3}>{this.props.children}</Box>
            </Typography>
        )
    }
}

{/*<div
                className="main-content">
                <div
                    className="content-frame">
                    <img
                        src={require("C:\\Users\\Windows User\\Documents\\NTNU\\Systemutvikling\\Øving12\\oving12\\src\\img\\placeholder.jpg")}
                        alt="placeholder"/>
                    <div
                        className="title">< p> Dolor
                        ipsum
                        lorem </p>
                    </div>
                    <div className="lead">< b> Lorem ipsum dolor <a href=""> sit amet </a>, consectetur adipiscing elit.
                        Nulla sed neque odio.Nullam vehicula nisl a quam vulputate egestas.Maecenas convallis tellus
                        neque, ut varius libero mattis eget.Sed enim eros, ultricies eget molestie vel, cursus at
                        mi.Quisque sit amet imperdiet ante, eget maximus quam.
                    </b></div>
                    <div className="author-date-time">
                        <div className="author"><b>Author: </b> Henrik Ibsen</div>
                        <div className="date-time"><b>Date: </b> 28.09.2018</div>
                    </div>
                    <div className="social-media">
                        <div className="fb-like" data-href="https://developers.facebook.com/docs/plugins/" data-width=""
                             data-layout="box_count" data-action="like" data-size="small" data-show-faces="true"
                             data-share="true"/>
                    </div>
                    <div className="text-body">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                            incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
                            in
                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat
                            non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
                            dolor
                            sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                            dolore
                            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                            aliquip
                            ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                            cillum
                            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                            culpa
                            qui officia deserunt mollit anim id est laborum. </p>
                        <img
                            src={require("C:\\Users\\Windows User\\Documents\\NTNU\\Systemutvikling\\Øving12\\oving12\\src\\img\\placeholder.jpg")}
                            alt="placeholder"/>
                    </div>
                    <div className="tags">
                        <Tag text="Sport" linkTo=""/>
                        <Tag text="Placeholder" linkTo=""/>
                        <Tag text="Mikael Eidsvaag" linkTo=""/>
                    </div>
                    <div className="commentList">
                        <CommentList/>
                    </div>
                </div>
            </div>*/}