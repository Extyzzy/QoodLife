import React from 'react';
import {Switch, Route, withRouter} from 'react-router';

import Bundle from '../../core/Bundle';

/* eslint-disable */
import loadPageNotFound from 'bundle-loader?lazy!../../pages/_errors/PageNotFound';
import loadAds from 'bundle-loader?lazy!./Ads';
import loadEditProfile from 'bundle-loader?lazy!./EditProfile';
import loadChatPage from 'bundle-loader?lazy!./Chat';
import loadGroups from 'bundle-loader?lazy!./Groups/Groups';
import loadTimeline from 'bundle-loader?lazy!./Timeline';
import loadFavorites from 'bundle-loader?lazy!./Favorites';
import loadSettings from 'bundle-loader?lazy!./Settings';
import loadSettingsProfessional from 'bundle-loader?lazy!./Settings/components/ProfPending';
import loadSettingsPlace from 'bundle-loader?lazy!./Settings/components/AgentPending';
import loadFavoritesPosts from 'bundle-loader?lazy!./Favorites/components/PostsList/PostsListSinglePage';
import loadFavoritesProducts from 'bundle-loader?lazy!./Favorites/components/ProductsList/ProductsListSinglePage';
import loadFavoritesPlaces from 'bundle-loader?lazy!./Favorites/components/PlacesList/PlacesListSinglePage';
import loadFavoritesProfessionals from 'bundle-loader?lazy!./Favorites/components/ProfessionalsList/ProfessionalsListSinglePage';
import loadFavoritesEvents from 'bundle-loader?lazy!./Favorites/components/EventsList/EventsListSinglePage';

import loadProfessionalEvents from 'bundle-loader?lazy!./Professional/EventsList/EventsListSinglePage';
import loadProfessionalPosts from 'bundle-loader?lazy!./Professional/PostsList/PostsListSinglePage';
import loadProfessionalPlaces from 'bundle-loader?lazy!./Professional/PlacesList/PlacesListSinglePage';
import loadProfessionalProducts from 'bundle-loader?lazy!./Professional/ProductsList/ProductsListSinglePage';
import loadProfessionalGroups from 'bundle-loader?lazy!./Professional/GroupsList/GroupsListSinglePage';

import loadBusinessEvents from 'bundle-loader?lazy!./Business/EventsList/EventsListSinglePage';
import loadBusinessPosts from 'bundle-loader?lazy!./Business/PostsList/PostsListSinglePage';
import loadBusinessPlaces from 'bundle-loader?lazy!./Business/PlacesList/PlacesListSinglePage';
import loadBusinessProducts from 'bundle-loader?lazy!./Business/ProductsList/ProductsListSinglePage';
import loadBusinessGroups from 'bundle-loader?lazy!./Business/GroupsList/GroupsListSinglePage';
import loadBusinessProfessionals from 'bundle-loader?lazy!./Business/ProfessionalsList/ProfessionalsListSinglePage';

import loadMemberGroups from 'bundle-loader?lazy!./Member/GroupsList/GroupsListSinglePage';

import {connect} from "react-redux";
/* eslint-enable */

const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);
const AdsProfileBundle = Bundle.generateBundle(loadAds);
const EditProfileBundle = Bundle.generateBundle(loadEditProfile);
const ChatBundle = Bundle.generateBundle(loadChatPage);
const GroupsBundle = Bundle.generateBundle(loadGroups);
const TimelineBundle = Bundle.generateBundle(loadTimeline);
const FavoritesBundle = Bundle.generateBundle(loadFavorites);
const FavoritesPostsBundle = Bundle.generateBundle(loadFavoritesPosts);
const FavoritesProductsBundle = Bundle.generateBundle(loadFavoritesProducts);
const FavoritesPlacesBundle = Bundle.generateBundle(loadFavoritesPlaces);
const FavoritesProfessionalsBundle = Bundle.generateBundle(loadFavoritesProfessionals);
const FavoritesEventsBundle = Bundle.generateBundle(loadFavoritesEvents);
const SettingsBundle = Bundle.generateBundle(loadSettings);
const SettingsProfessionalBundle = Bundle.generateBundle(loadSettingsProfessional);
const SettingsPlaceBundle = Bundle.generateBundle(loadSettingsPlace);

const ProfessionalEventsBundle = Bundle.generateBundle(loadProfessionalEvents);
const ProfessionalPostsBundle = Bundle.generateBundle(loadProfessionalPosts);
const ProfessionalPlacesBundle = Bundle.generateBundle(loadProfessionalPlaces);
const ProfessionalProductsBundle = Bundle.generateBundle(loadProfessionalProducts);
const ProfessionalGroupsBundle = Bundle.generateBundle(loadProfessionalGroups);

const BusinessEventsBundle = Bundle.generateBundle(loadBusinessEvents);
const BusinessPostsBundle = Bundle.generateBundle(loadBusinessPosts);
const BusinessPlacesBundle = Bundle.generateBundle(loadBusinessPlaces);
const BusinessProductsBundle = Bundle.generateBundle(loadBusinessProducts);
const BusinessGroupsBundle = Bundle.generateBundle(loadBusinessGroups);
const BusinessProfessionalsBundle = Bundle.generateBundle(loadBusinessProfessionals);
const MemberGroupsBundle = Bundle.generateBundle(loadMemberGroups);

class ProfileSwitch extends React.PureComponent {

  routes() {
    const {
      ads,
    } = this.props;

    const routes = [];

    if (ads) {
      routes.push(
        <Route key='ads' path="/profile/ads" exact component={AdsProfileBundle} />,
      )
    }

    return routes;
  }

  render() {
    return (
      <Switch>
        <Route path="/profile/" exact component={EditProfileBundle} />
        <Route path="/profile/messages" exact component={ChatBundle} />
        <Route path="/profile/settings" exact component={SettingsBundle} />
        <Route path="/profile/settings/professional" exact component={SettingsProfessionalBundle} />
        <Route path="/profile/settings/place" exact component={SettingsPlaceBundle} />
        <Route path="/profile/favorites" exact component={FavoritesBundle} />
        <Route path="/profile/favorites/posts" exact component={FavoritesPostsBundle} />
        <Route path="/profile/favorites/products" exact component={FavoritesProductsBundle} />
        <Route path="/profile/favorites/places" exact component={FavoritesPlacesBundle} />
        <Route path="/profile/favorites/professionals" exact component={FavoritesProfessionalsBundle} />
        <Route path="/profile/favorites/events" exact component={FavoritesEventsBundle} />
        <Route path="/profile/edit" exact component={EditProfileBundle} />
        <Route path="/profile/timeline" exact component={TimelineBundle} />
        <Route path="/profile/groups" exact component={GroupsBundle} />
        <Route path="/profile/professional/events" exact component={ProfessionalEventsBundle} />
        <Route path="/profile/professional/posts" exact component={ProfessionalPostsBundle} />
        <Route path="/profile/professional/places" exact component={ProfessionalPlacesBundle} />
        <Route path="/profile/professional/products" exact component={ProfessionalProductsBundle} />
        <Route path="/profile/professional/groups" exact component={ProfessionalGroupsBundle} />
        <Route path="/profile/business/events" exact component={BusinessEventsBundle} />
        <Route path="/profile/business/posts" exact component={BusinessPostsBundle} />
        <Route path="/profile/business/places" exact component={BusinessPlacesBundle} />
        <Route path="/profile/business/products" exact component={BusinessProductsBundle} />
        <Route path="/profile/business/groups" exact component={BusinessGroupsBundle} />
        <Route path="/profile/business/professionals" exact component={BusinessProfessionalsBundle} />
        <Route path="/profile/member/groups" exact component={MemberGroupsBundle} />
        {this.routes()}
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
    ads: store.app.ads,
  };
}

export default withRouter(connect(mapStateToProps)(ProfileSwitch));

