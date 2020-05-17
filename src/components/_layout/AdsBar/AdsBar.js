import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from "../../Loader";
import { fetchAdsBlocks } from '../../../actions/adsModule'
import slugify from 'slugify';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AdsBar.scss';
import {audience} from "../../../helpers/sideBarAudience";
import {isEqual} from "lodash";
import { withRouter } from 'react-router';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

class AdsBar extends Component {
  componentDidMount() {
    const {
      accessToken,
      dispatch,
      navigation,
      location
    } = this.props;

    const {
      selectedHobby,
      selectedCategory
    } = navigation;

    if ( location.pathname.indexOf('places/') === -1) {
      dispatch(
        fetchAdsBlocks(
          accessToken,
          {
            __GET: {
              take: 6,
              audience: ! (selectedHobby || selectedCategory) ? audience(navigation) : null,
              categories: !selectedHobby && selectedCategory ? [selectedCategory] : null,
              hobbies: selectedHobby ? [selectedHobby] : null,
            },
          },
        )
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      dispatch,
      accessToken,
      navigation,
      location
    } = this.props;

    const {
      navigation: nextNavigation
    } = nextProps;

    const {
      selectedHobby,
      selectedCategory
    } = nextNavigation;

    if ( ! isEqual(navigation, nextNavigation) && location.pathname.indexOf('places/') === -1) {
      dispatch(
        fetchAdsBlocks(
          accessToken,
          {
            __GET: {
              take: 6,
              audience: ! (selectedHobby || selectedCategory) ? audience(nextNavigation) : null,
              categories: !selectedHobby && selectedCategory ? [selectedCategory] : null,
              hobbies: selectedHobby ? [selectedHobby] : null,
            },
          },
        )
      );
    }
  }

  render() {
    const { adsProductsList, isFetching } = this.props;

    if (isFetching) {
      return (
        <div className={s.root}>
          <Loader className={s.loader} sm contrast/>
        </div>
      )
    }

    return (
      <div className={s.root}>
        {
          adsProductsList && !!adsProductsList.length && adsProductsList.map((data, i) =>  {
            const defaultImage = data.gallery.images.find(i => i.default);
            const addUrl = `/products/${slugify(data.title)}-${data.id}`;

            return (
              <Link key={i} className={s.addDiv} to={{pathname: addUrl, state: {data}}}>
                <LazyLoadImage
                  width="100%"
                  height="100%"
                  effect="blur"
                  className={s.addImage}
                  src={defaultImage.src}
                  alt={data.title}
                />
                <span>{data.title}</span>
              </Link>
            )
          })
        }
      </div>
    );
  };
}

function mapStateToProps(store) {
  return {
    adsProductsList: store.adsModule.list,
    isFetching: store.adsModule.isFetching,
    accessToken: store.auth.accessToken,
    navigation: {
      sidebarOpenedGroup: store.navigation.sidebarOpenedGroup,
      selectedHobby: store.navigation.selectedHobby,
      selectedCategory: store.navigation.selectedCategory,
    },
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(AdsBar)));
