import React, { Component } from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Question.scss";
import classes from "classnames";
import { MOBILE_VERSION } from '../../../../actions/app';
import {withRouter} from "react-router";
import connect from "react-redux/es/connect/connect";

class Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };
  }

  render() {
    const {
      response,
      UIVersion
    } = this.props;

    const {
      show
    } = this.state;

    return (
        <div className={classes(s.root, {
          [s.layout]: UIVersion !==  MOBILE_VERSION,
          [s.mobile]: UIVersion ===  MOBILE_VERSION
        })}>
          <div className={classes(s.question, {[s.questionShow]: show})}
            onClick={() =>
            this.setState({show: !show})
          }>
            <p>{response.title}</p>

            <i className={classes("icon-angle-down", {[s.left]: !show})} />
          </div>

          <div className={UIVersion ===  MOBILE_VERSION ?  s.contentMobile: s.content}>

            {
              show &&(
                response.content
              )
            }

          </div>

        </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    UIVersion: store.app.UIVersion,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(Question)));

