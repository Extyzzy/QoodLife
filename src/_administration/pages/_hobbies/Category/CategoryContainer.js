import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Forbidden from '../../../../pages/_errors/Forbidden';
import PageNotFound from '../../../../pages/_errors/PageNotFound';
import Loader from '../../../../components/Loader';
import { fetchAuthorizedApiRequest } from '../../../../fetch';
import { actionIsAllowed } from '../../../../helpers/permissions';
import {
  InternalServerError,
} from "../../../../exceptions/http";
import View from './View';

class CategoryContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      loaded: false,
      hobbyDetails: null,
      showform: false,
    };
  }

  componentDidMount() {
    const {
      match: {
        params: {
          categoryId,
        },
      },
    } = this.props;

    this.fetchHobbyDetails(categoryId);
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: {
        params: {
          categoryId,
        },
      },
    } = nextProps;

    this.fetchHobbyDetails(categoryId);
  }

  componentWillUnmount() {
    if (this.fetchHobbyDetailsFetcher instanceof Promise) {
      this.fetchHobbyDetailsFetcher.cancel();
    }
  }

  fetchHobbyDetails(categoryId) {
    const {
      accessToken,
      dispatch,
    } = this.props;

    this.fetchHobbyDetailsFetcher = dispatch(
      fetchAuthorizedApiRequest(
        `/v1/hobbies/categories/${categoryId}`,
        {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    )

    this.fetchHobbyDetailsFetcher
      .then(response => {
        switch(response.status) {
          case 200:

            return response.json();

          default:

            return Promise.reject(
              new InternalServerError()
            );

        }
      })
      .then(hobbyDetails => {
        this.setState({
          hobbyDetails,
          loaded: true,
        });
      }, () => {
        this.setState({
          loaded: true,
        });
      });
  }

  render() {
    const {
      permissions,
    } = this.props;

    const {
      loaded,
      hobbyDetails,
      showform,
    } = this.state;

    if ( ! actionIsAllowed(permissions, {
        module: 'hobbies',
        action: 'manage-everything',
    })) {
      return (
        <Forbidden />
      );
    }

    if ( ! loaded) {
      return (
        <Loader />
      );
    }

    if ( ! hobbyDetails) {
      return (
        <PageNotFound />
      );
    }

    return (
      <View
        isFetching={!loaded}
        showform={showform}
        hobbyDetails={hobbyDetails}
        canManageHobbies={
          actionIsAllowed(permissions, {
            module: 'hobbies',
            action: 'manage-everything',
          })
        }

        onPopupClose={() => {
          this.setState({showform: false})
        }}

        openPopup={() => {
          this.setState({showform: true})
        }}

      />
    );
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    permissions: state.user.permissions,
    authedUser:  state.user,
  };
}

export default withRouter(connect(mapStateToProps)(CategoryContainer));
