import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import { connect } from 'react-redux';
import { chunk } from 'lodash';
import { I18n } from 'react-redux-i18n';
import { MOBILE_VERSION } from '../../../actions/app';
import { DEFAULT_ADS_BLOCKS_FREQUENCE } from '../../../constants';
import Calendar from '../../../components/Calendar';
import Layout from '../../../components/_layout/Layout';
import Loader from '../../../components/Loader';
import ComponentsList from '../../../components/ComponentsList';
import MobileAdsCarousel from '../../../components/MobileAdsCarousel';
import PostsListItem from './components/ListItem';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Blog.scss';

class Blog extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    postsList: PropTypes.array.isRequired,
    onItemComponentWillUnmount: PropTypes.func,
    onItemPopupComponentWillUnmount: PropTypes.func,
    showItemOwnerDetails: PropTypes.bool,
    itemActionButtons: PropTypes.func,
    itemPopupActionButtons: PropTypes.func,
    showLoadMore: PropTypes.bool.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    loadingMore: PropTypes.bool.isRequired,
  };

  getUIVersion() {
    const { UIVersion } = this.props;

    return UIVersion === MOBILE_VERSION;
  }

  render() {
    const {
      isFetching,
      isLoaded,
      postsList,
      onItemComponentWillUnmount,
      onItemPopupComponentWillUnmount,
      showItemOwnerDetails,
      itemActionButtons,
      itemPopupActionButtons,
      showLoadMore,
      onLoadMore,
      loadingMore,
      isAuthenticated,
      userType,
      UIVersion,
      demo,
    } = this.props;

    const admin = isAuthenticated ? userType.find(role =>  role.code === 'admin') : false;

    const isMobile = this.getUIVersion();
    const postsGroups = chunk(postsList, DEFAULT_ADS_BLOCKS_FREQUENCE);

    return (
      <Layout
        hasSidebar
        hasAds
        contentHasBackground
      >
        <div className={classes(s.root, {
          [s.mobile]: isMobile,
        })}>
          <div className={s.header}>
            {
              isFetching && (
                <Loader className={s.loader} sm contrast />
              )
            }
          </div>

          {
            isLoaded && (
              <div>
                {
                  (!!admin || !demo) && isAuthenticated && (
                    <Calendar />
                  )
                }
                {
                  (!!postsList && !!postsList.length && (
                    <div>
                      {
                        postsGroups.map((group, groupKey) =>
                          <div key={groupKey}>
                            <ComponentsList
                              className={s.postsList}
                              component={PostsListItem}
                              list={group}
                              onComponentWillUnmount={
                                onItemComponentWillUnmount
                              }
                              onPopupComponentWillUnmount={
                                onItemPopupComponentWillUnmount
                              }
                              showOwnerDetails={showItemOwnerDetails}
                              actionButtons={itemActionButtons}
                              popupActionButtons={itemPopupActionButtons}
                            />

                            {
                              showLoadMore &&
                              groupKey+1 === postsGroups.length && (
                                <div className="text-center">
                                  <button
                                    className="btn btn-default"
                                    disabled={loadingMore}
                                    onClick={() => onLoadMore(groupKey)}
                                  >
                                    {
                                      loadingMore
                                      ? I18n.t('general.elements.loading')
                                      : I18n.t('general.elements.loadMore')
                                    }
                                  </button>
                                </div>
                              )
                            }

                            {
                              UIVersion === MOBILE_VERSION &&
                              group.length === DEFAULT_ADS_BLOCKS_FREQUENCE && (
                                <MobileAdsCarousel blockIndex={groupKey} />
                              )
                            }
                          </div>
                        )
                      }
                    </div>
                  )) || (
                    I18n.t('blog.postsNotFound')
                  )
                }
              </div>
            )
          }
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    UIVersion: state.app.UIVersion,
    userType: state.user.roles,
    demo: state.app.demo,
  };
}

export default connect(mapStateToProps)(withStyles(s)(Blog));
