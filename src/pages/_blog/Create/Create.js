import React, { Component } from "react";
import {I18n} from 'react-redux-i18n';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Create.scss';
import Layout from '../../../components/_layout/Layout/Layout';
import CreatePostForm from "./components/CreatePostForm";
import {actionIsAllowed} from "../../../helpers/permissions";
import Forbidden from '../../_errors/Forbidden/Forbidden';
import {MOBILE_VERSION} from "../../../actions/app";

class Create extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isFetching: false,
    };

    this.goBackToPosts = this.goBackToPosts.bind(this);
  }

  goBackToPosts() {
    const {
      history,
      UIVersion,
      location,
    } = this.props;

    const role = location.state;

    const {
      __userRoles
    } = this.state;

    if (UIVersion === MOBILE_VERSION) {
      history.push(`/profile/posts`);
      return;
    }
    if (role || __userRoles) {
     return history.push(`/profile/edit`, {
      activeTab: 'posts',
      activeTabRole: role ? role : __userRoles.codeUser,
    });
  }
    window.history.back();
  }

  render() {
    const {
      permissions,
    } = this.props;

    if ( ! actionIsAllowed(permissions, {
        module: 'blog',
        action: 'create',
      })) {
      return <Forbidden />;
    }

    return (
      <Layout
        hasSidebar
        whichSidebar='My Profile'
        contentHasBackground
      >
        <div className={s.root}>
          <div className={s.title}>
            <h4>{I18n.t('blog.createAPostTitle')}</h4>
          </div>
          <CreatePostForm
            onFetchingStateChange={isFetching => {
              this.setState({isFetching});
            }}
            goBackToPosts={this.goBackToPosts}
          />
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    UIVersion: state.app.UIVersion,
    permissions: state.user.permissions,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(Create)));
