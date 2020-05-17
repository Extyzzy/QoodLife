import React, { Component } from "react";
import {I18n} from 'react-redux-i18n';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Edit.scss';
import Layout from '../../../components/_layout/Layout/Layout';
import EditPostForm from "./components/EditPostForm";
import { MOBILE_VERSION } from '../../../actions/app';
import {actionIsAllowed} from "../../../helpers/permissions";
import PageNotFound from '../../_errors/PageNotFound/PageNotFound';
import Loader from '../../../components/Loader/Loader';
import Forbidden from '../../_errors/Forbidden/Forbidden';
import {SilencedError} from "../../../exceptions/errors";
import {fetchAuthorizedApiRequest} from "../../../fetch";

class Edit extends Component {
  constructor(props, context) {
    super(props, context);

    const data = props.location.state && props.location.state.data
      ? props.location.state.data : null;

    this.state = {
      isFetching: false,
      data,
      isLoaded: !!data,
    };

    this.goBackToPosts = this.goBackToPosts.bind(this);
  }

  componentDidMount() {
    if( ! this.state.data) {
      this.getData();
    }
  }

  componentWillUnmount() {
    if (this.PostFetcher instanceof Promise) {
      this.PostFetcher.cancel();
    }
  }

  getData() {
    const {
      match: {params: {postId}}
    } = this.props;

    const {
      dispatch,
      accessToken,
    } = this.props;

    this.PostFetcher = dispatch(
      fetchAuthorizedApiRequest(`/v1/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    );

    this.PostFetcher
      .then(response => {
        switch(response.status) {
          case 200:

            return response.json();

          default:

            return Promise.reject(
              new SilencedError('Failed to fetch post.')
            );
        }
      })
      .then(data => {
        this.setState({data});

        return Promise.resolve();
      })
      .finally(() => {
        if ( ! this.PostFetcher.isCancelled()) {
          this.setState({
            isLoaded: true,
          });
        }
      });
  }

  goBackToPosts() {
    const {
      history,
      UIVersion,
      location,
    } = this.props;

    const role = location.state.role;

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

    const {
      data,
      isLoaded,
    } = this.state;

    if ( ! isLoaded) {
      return (
        <Loader />
      );
    }

    if ( ! data) {
      return (
        <PageNotFound />
      );
    }

    if( ! actionIsAllowed(permissions, {
        module: 'blog',
        action: 'update-all',
      }) && ( ! actionIsAllowed(permissions, {
        module: 'blog',
        action: 'update-personal',
      }))) {
      return(
        <Forbidden />
      )
    }

    return (
      <Layout
        hasSidebar
        whichSidebar='My Profile'
        contentHasBackground
      >
        <div className={s.root}>
          <div className={s.title}>
            <h4>{I18n.t('blog.editPost')}</h4>
          </div>
          <EditPostForm
            ref={form => {
              this.editPostForm = form;
            }}
            data={data}
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
    accessToken: state.auth.accessToken,
    userID: state.user.id,
    UIVersion: state.app.UIVersion,
    permissions: state.user.permissions,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(Edit)));
