import React, { Component } from "react";
import { I18n } from 'react-redux-i18n';
import { withRouter } from 'react-router';
import { fetchApiRequest } from '../../../../../fetch';
import { InternalServerError } from '../../../../../exceptions/http';
import {
  settingsForListitem,
} from "../../../../../components/_carousel/SliderSettingsMobile";
import Loader from '../../../../../components/Loader';
import ComponentsList from "../../../../../components/ComponentsList";
import ProfessionalsListItem from "../../../../_professionals/Professionals/components/ListItem";

import Slider from "react-slick";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ProfessionalsList.scss";

class ProfessionalsList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false,
      professionalsList: [],
    };
  }

  componentDidMount() {
    this.fetchProfessionalsList();
  }

  componentWillUnmount() {
    if (this.fetchProfessionalsList instanceof Promise) {
      this.fetchProfessionalsList.cancel();
    }
  }

  fetchProfessionalsList() {
    const { match: {params: {placeId: placeRoute}} } = this.props;

    const placeId = placeRoute.split('-').pop();

    this.fetchProfessionalsList = fetchApiRequest(`/v1/places/connected/${placeId}`);

    this.fetchProfessionalsList
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
        professionalsList: g.list,
        isLoaded: true,
      });

      return Promise.resolve();
    });
  }

  render() {
    const { isLoaded, professionalsList } = this.state;
    const { isMobile } = this.props;

    if(!isLoaded){
      return <Loader />
    }

    return (
      <div className={s.root}>
        {
          isLoaded && (
            (!!professionalsList && !!professionalsList.length && (
              (isMobile && (
                <Slider
                  className={s.slider}
                  {...settingsForListitem}
                >
                  {
                    professionalsList.map(item => {
                      return (
                        <div key={item.id}>
                          <ProfessionalsListItem
                            data={item}
                            className={s.listItem}
                            viewMode="icons"
                          />
                        </div>
                      );
                    })
                  }
                </Slider>
              )) || (
                <ComponentsList
                  component={ProfessionalsListItem}
                  list={professionalsList}
                  onComponentWillUnmount={
                    this.onListItemComponentWillUnmount
                  }
                  actionButtons={
                    this.listItemActionButtons
                  }
                  viewMode="icons"
                />
            ))) || I18n.t('professionals.professionalsNotfound')
          )
        }
      </div>
    );
  }
}


export default withRouter(withStyles(s)(ProfessionalsList));
