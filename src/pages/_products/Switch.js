import React from 'react';
import { Switch, Route, withRouter } from 'react-router';
import { PrivateRoute } from "../../core/Router";
import { connect } from 'react-redux';
import Bundle from '../../core/Bundle';

/* eslint-disable */
import loadProducts from 'bundle-loader?lazy!./Products';
import loadProduct from 'bundle-loader?lazy!./Product';
import loadProductCreate from 'bundle-loader?lazy!./Create';
import loadProductEdit from 'bundle-loader?lazy!./Edit';
import loadPageNotFound from 'bundle-loader?lazy!../../pages/_errors/PageNotFound';
/* eslint-enable */

const ProductsBundle = Bundle.generateBundle(loadProducts);
const ProductBundle = Bundle.generateBundle(loadProduct);
const ProductCreateBundle = Bundle.generateBundle(loadProductCreate);
const ProductEditBundle = Bundle.generateBundle(loadProductEdit);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class ProductsSwitch extends React.PureComponent {

  route() {
    const {
      isAuthenticated,
      userType,
      demo,
    } = this.props;

    const admin = isAuthenticated && !!userType.find(role =>  role.code === 'admin');

    const routes = [];

    if (!!admin || !demo) {
      routes.push(
        <Route key='products' path="/products" exact component={ProductsBundle} />
      )
    }

    return routes
  }

  render() {
    const {isAuthenticated} = this.props;
    return (
      <Switch>
        {this.route()}
        <PrivateRoute isAuthenticated={isAuthenticated} path="/products/create" component={ProductCreateBundle} />
        <PrivateRoute isAuthenticated={isAuthenticated} path="/products/edit/:productId" component={ProductEditBundle} />
        <Route path="/products/:productId" exact component={ProductBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

function mapStateToProps(store) {
  return {
    isAuthenticated: store.auth.isAuthenticated,
    userType: store.user.roles,
    demo: store.app.demo,
  };
}

export default withRouter(connect(mapStateToProps)(ProductsSwitch));
