import React, { Component } from 'react';
import { fetchApiRequest } from '../../../../../fetch';
import { InternalServerError } from "../../../../../exceptions/http";
import { I18n } from 'react-redux-i18n';
import Loader from '../../../../../components/Loader';
import ListItemContainer from './ListItemContainer';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ListItem.scss";

class Container extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      eventGroups: [],
      groupsAreLoaded: false,
    };
  }

  componentDidMount(){
    this.getRelatedToEventGroupsList()
  }

  componentWillUnmount() {
    if (this.fetchEventGroupsFetcher instanceof Promise) {
      this.fetchEventGroupsFetcher.cancel();
    }
  }

  getRelatedToEventGroupsList() {
    const { data } = this.props;

    this.fetchEventGroupsFetcher = fetchApiRequest(`/v1/groups/events/${data.id}`);

    this.fetchEventGroupsFetcher
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
        eventGroups: g.list,
        groupsAreLoaded: true,
      });
    });
  }

  render() {
    const {
      eventGroups,
      groupsAreLoaded,
    } = this.state;

    if(!groupsAreLoaded) {
      return (
        <Loader />
      )
    }

    return (
      <div>
        {
          (eventGroups && eventGroups.length > 0 && (
            eventGroups.map((group, index) => {
              return (
                <ListItemContainer
                  key={index}
                  data={group}
                />
              )
            })
          )) || (
            <div className={s.poster}>{I18n.t('groups.groupsNotFound')}</div>
          )
        }
      </div>
    );
  }
}


export default withStyles(s)(Container);
