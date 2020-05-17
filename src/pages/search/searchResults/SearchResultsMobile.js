import React from 'react';
import Layout from "../../../components/_layout/Layout/Layout";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SearchResultsMobile.scss';
import SearchBox from '../../../components/searchBox';
import {sliderSettings} from "../../../components/_carousel/SliderSettingsMobile";
import ProfessionalsListItem from "../../_professionals/Professionals/components/ListItem";
import PlacesListItem from "../../_places/Places/components/ListItem";
import PostsListItem from "../../_blog/Blog/components/ListItem";
import ProductsListItem from "../../_products/Products/components/ListItem";
import GroupsListItem from "../../_groups/Groups/components/ListItem";
import EventsListItem from "../../_events/Events/components/ListItem";
import MembersListItem from "../../search/searchResults/components/Members/components/ListItem";
import Slider from "react-slick/lib";
import {I18n} from "react-redux-i18n";
import classes from "classnames";
import Buttons from "../../_hobbies/Hobbies/Buttons";
import connect from "react-redux/es/connect/connect";

const SearchResults = ({
     response: {
       hobbies,
       places,
       professionals,
       events,
       groups,
       products,
       posts,
       users,
     },
     postsGroups,
     usersGroups,
     hobbiesGroups,
     eventsGroups,
     groupsGroups,
     placesGroups,
     professionalsGroups,
     productsGroups,
     userHobbies,
 }) => (
  <Layout
    contentHasBackground
  >
    <div className={s.root}>
      <SearchBox />

      {
        !!products && !!products.length &&(
          <div className={s.searchResult}>
            <h3>{I18n.t('general.header.products')}</h3>
            {
              productsGroups.map((group, groupKey) => (
                <div key={groupKey}>
                  <Slider
                    className={s.slider}
                    {...sliderSettings}
                  >
                    {
                      !!group.length
                      && group.map((product, index) =>  {
                        return (
                          <div key={index}>
                            <ProductsListItem
                              data={product}
                              viewMode={'icons'}
                            />
                          </div>
                        );
                      })
                    }
                  </Slider>
                </div>
              ))
            }
          </div>
        )
      }

      {
        !!groups && !!groups.length &&(
          <div className={s.searchResult}>
            <h3>{I18n.t('general.header.groups')}</h3>
            {
              groupsGroups.map((group, groupKey) => (
                <div key={groupKey}>
                  <Slider
                    className={s.slider}
                    {...sliderSettings}
                  >
                    {
                      !!group.length
                      && group.map((groups, index) =>  {
                        return (
                          <div key={index}>
                            <GroupsListItem
                              data={groups}
                              viewMode={'icons'}
                            />
                          </div>
                        );
                      })
                    }
                  </Slider>
                </div>
              ))
            }
          </div>
        )
      }

      {
        !!events && !!events.length &&(
          <div className={s.searchResult}>
            <h3>{I18n.t('general.header.events')}</h3>
            {
              eventsGroups.map((group, groupKey) => (
                <div key={groupKey}>
                  <Slider
                    className={s.slider}
                    {...sliderSettings}
                  >
                    {
                      !!group.length
                      && group.map((event, index) =>  {
                        return (
                          <div key={index}>
                            <EventsListItem
                              data={event}
                              viewMode={'icons'}
                            />
                          </div>
                        );
                      })
                    }
                  </Slider>
                </div>
              ))
            }
          </div>
        )
      }

      {
        !!professionals && !!professionals.length &&(
          <div className={s.searchResult}>
            <h3>{I18n.t('placesAndPros.professionals')}</h3>
            {
              professionalsGroups.map((group, groupKey) => (
                <div key={groupKey}>
                  <Slider
                    className={s.slider}
                    {...sliderSettings}
                  >
                    {
                      !!group.length
                      && group.map((professional, index) =>  {
                        return (
                          <div key={index}>
                            <ProfessionalsListItem
                              data={professional}
                              viewMode={'icons'}
                              className={s.professionalsList}
                            />
                          </div>
                        );
                      })
                    }
                  </Slider>
                </div>
              ))
            }
          </div>
        )
      }

      {
        !!places && !!places.length &&(
          <div className={s.searchResult}>
            <h3>{I18n.t('placesAndPros.places')}</h3>
            {
              placesGroups.map((group, groupKey) => (
                <div key={groupKey}>
                  <Slider
                    className={s.slider}
                    {...sliderSettings}
                  >
                    {
                      !!group.length
                      && group.map((place, index) =>  {
                        return (
                          <div key={index}>
                            <PlacesListItem
                              data={place}
                              viewMode={'icons'}
                              className={s.professionalsList}
                            />
                          </div>
                        );
                      })
                    }
                  </Slider>
                </div>
              ))
            }
          </div>
        )
      }

      {
        !!posts && !!posts.length &&(
          <div className={s.searchResultPosts}>
            <h3>{I18n.t('general.header.posts')}</h3>
            {
              postsGroups.map((group, groupKey) => (
                <div key={groupKey}>
                  <Slider
                    className={s.slider}
                    {...sliderSettings}
                  >
                    {
                      !!group.length
                      && group.map((post, index) =>  {
                        return (
                          <div key={index}>
                            <PostsListItem
                              data={post}
                              viewMode={'icons'}
                            />
                          </div>
                        );
                      })
                    }
                  </Slider>
                </div>
              ))
            }
          </div>
        )
      }

      {
        !!users && !!users.length &&(
          <div className={s.searchResult}>
            <h3>{I18n.t('general.header.members')}</h3>
            {
              usersGroups.map((group, groupKey) => (
                <div key={groupKey}>
                  <Slider
                    className={s.slider}
                    {...sliderSettings}
                  >
                    {
                      !!group.length
                      && group.map((user, index) =>  {
                        return (
                          <div key={index}>
                            <MembersListItem
                              data={user}
                              viewMode={'icons'}
                            />
                          </div>
                        );
                      })
                    }
                  </Slider>
                </div>
              ))
            }
          </div>
        )
      }

      {
        !!hobbies && !!hobbies.length &&(
          <div className={s.searchResult}>
            <h3>{I18n.t('general.header.hobbies')}</h3>
            {
              hobbiesGroups.map((group, groupKey) => (
                <div key={groupKey}>
                  <Slider
                    className={s.slider}
                    {...sliderSettings}
                  >
                    {
                      !!group.length
                      && group.map((hobby, index) =>  {
                        const isActive = !!userHobbies && !!userHobbies.length
                          && !!userHobbies.find(({id}) => id === hobby.id);

                        return (
                            <div
                              key={index}
                              className={s.listItem}
                            >
                              <div className={s.title}>
                                <span>{hobby.name}</span>
                              </div>
                              <img
                                src={hobby.image.src}
                                alt={hobby.name}
                              />
                              <div className={classes(
                                s.buttonContainer, {
                                  [s.active]: isActive,
                                })
                              }>
                                <Buttons
                                  isActive={isActive}
                                  hobby={hobby}
                                />
                              </div>
                            </div>
                        );
                      })
                    }
                  </Slider>
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  </Layout>
);

function mapStateToProps(state) {
  return {
    UIVersion: state.app.UIVersion,
  };
}

export default (connect(mapStateToProps)(withStyles(s)(SearchResults)));
