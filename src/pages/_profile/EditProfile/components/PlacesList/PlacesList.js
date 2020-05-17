import React, { Component } from "react";
import Slider from "react-slick";
import { I18n } from 'react-redux-i18n';
import { withRouter } from 'react-router';
import { fetchApiRequest } from '../../../../../fetch';
import { InternalServerError } from '../../../../../exceptions/http';
import {
  settingsForListitem,
} from "../../../../../components/_carousel/SliderSettingsMobile";
import Loader from '../../../../../components/Loader';
import ComponentsList from "../../../../../components/ComponentsList";
import PlacesListItem from "../../../../_places/Places/components/ListItem";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./PlacesList.scss";

class PlacesList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false,
      placesList: [],
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

    this.fetchPlacesListReqest = fetchApiRequest(`/v1/professionals/connected/${prosId}`);
    this.fetchPlacesListReqest
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
    .then(g => {
      this.setState({
        placesList: g.list,
        isLoaded: true,
      });

      return Promise.resolve();
    });
  }

  render() {
    const { isLoaded, placesList } = this.state;
    const { isMobile } = this.props;

    if(!isLoaded){
      return <Loader />
    }

    return (
      <div className={s.root}>
        {
          isLoaded && (
            (!!placesList && !!placesList.length && (
              (isMobile && (
                <Slider
                  className={s.slider}
                  {...settingsForListitem}
                >
                  {
                    placesList.map(item => {
                      return (
                        <div key={`${item.key}_${item.id}`}>
                          <PlacesListItem
                            data={item}
                            className={s.listItem}
                            onComponentWillUnmount={
                              this.onListItemComponentWillUnmount
                            }
                            actionButtons={
                              this.listItemActionButtons
                            }
                            viewMode="list"
                          />
                        </div>
                      );
                    })
                  }
                </Slider>
              )) || (
                <ComponentsList
                  component={PlacesListItem}
                  list={placesList}
                  onComponentWillUnmount={
                    this.onListItemComponentWillUnmount
                  }
                  actionButtons={
                    this.listItemActionButtons
                  }
                  viewMode="icons"
                />
              ))) || (
                <div className={s.notFoundMessage}>
                  {I18n.t('agent.placesNotFound')}
                </div>
              )
          )
        }
      </div>
    );
  }
}


export default withRouter(withStyles(s)(PlacesList));
