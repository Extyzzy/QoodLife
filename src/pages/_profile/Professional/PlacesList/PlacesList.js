import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PlacesList.scss';
import { fetchApiRequest } from '../../../../fetch';
import { InternalServerError } from '../../../../exceptions/http';
import PlacesListItem from '../../../_places/Places/components/ListItem';
import Loader from '../../../../components/Loader';
import ComponentsList from '../../../../components/ComponentsList';

class PlacesListContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false,
      placesList: []
    };
  }

  componentDidMount() {
    this.fetchPlacesList();
  }

  componentWillUnmount() {
    if (this.fetchPlacesListReqest instanceof Promise) {
      this.fetchPlacesListReqest.cancel();
    }
  }

  fetchPlacesList() {
    const { prosId } = this.props;

    this.fetchPlacesListReqest = fetchApiRequest(
      `/v1/professionals/connected/${prosId}`
    );
    this.fetchPlacesListReqest
      .then(response => {
        switch (response.status) {
          case 200:
            return response.json();
          default:
            return Promise.reject(new InternalServerError());
        }
      })
      .then(g => {
        this.setState({
          placesList: g.list,
          isLoaded: true
        });

        return Promise.resolve();
      });
  }
  render() {
    const { isFetching } = this.props;

    const { placesList } = this.state;

    if (isFetching) {
      return <Loader sm contrast />;
    }

    return (
      <div>
        {(!!placesList.length && (
          <ComponentsList
            component={PlacesListItem}
            list={placesList}
            showOwnerDetails={false}
          />
        )) ||
          I18n.t('agent.placesNotFound')}
      </div>
    );
  }
}

export default withStyles(s)(PlacesListContainer);
