import React from 'react';
import { Switch, Route, withRouter } from 'react-router';
import { PrivateRoute } from "../../core/Router";
import { connect } from 'react-redux';
import Bundle from '../../core/Bundle';

/* eslint-disable */
import loadBlog from 'bundle-loader?lazy!./Blog';
import loadPost from 'bundle-loader?lazy!./Post';
import loadBlogCreate from 'bundle-loader?lazy!./Create';
import loadBlogEdit from 'bundle-loader?lazy!./Edit';
import loadPageNotFound from 'bundle-loader?lazy!../../pages/_errors/PageNotFound';
/* eslint-enable */

const BlogBundle = Bundle.generateBundle(loadBlog);
const PostBundle = Bundle.generateBundle(loadPost);
const BlogCreateBundle = Bundle.generateBundle(loadBlogCreate);
const BlogEditBundle = Bundle.generateBundle(loadBlogEdit);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class BlogSwitch extends React.PureComponent {
  render() {
    const {isAuthenticated} = this.props;
    return (
      <Switch>
        <Route path="/blog" exact component={BlogBundle} />
        <PrivateRoute isAuthenticated={isAuthenticated} path="/blog/create" component={BlogCreateBundle} />
        <PrivateRoute isAuthenticated={isAuthenticated} path="/blog/edit/:blogId" component={BlogEditBundle} />
        <Route path="/blog/tag/:tag" exact component={BlogBundle} />
        <Route path="/blog/post/:postId" exact component={PostBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

function mapStateToProps(store) {
  return {
    isAuthenticated: store.auth.isAuthenticated,
  };
}

export default withRouter(connect(mapStateToProps)(BlogSwitch));
