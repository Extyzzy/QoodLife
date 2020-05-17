import React, { Component } from "react";
import {forEach} from "lodash";
import {appendToFormData} from "../../../../../helpers/form";
import {fetchAuthorizedApiRequest} from "../../../../../fetch";
import {InternalServerError, UnprocessableEntity} from "../../../../../exceptions/http";
import {connect} from "react-redux";
import {I18n} from "react-redux-i18n";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../../Settings.scss';
import AgentEdit from '../../../EditProfile/components/ProfileDetails/AgentForm/Edit'
import update from "immutability-helper";
import classes from "classnames";
import Layout from "../../../../../components/_layout/Layout";
import {
  setUserData,
} from "../../../../../actions/user";
import { withRouter } from 'react-router';
import {SilencedError} from "../../../../../exceptions/errors";

class AgentContainer extends Component {
  constructor(props, context) {
    super(props, context);
    const {
      profileDetails,
      location
    } = this.props;

    const {
      id,
      name,
      email,
      phoneNumber,
      branches,
      description,
      socialMediaLinks,
      hobbies,
      gallery,
    } = profileDetails.placeDetails || location.state.data || false;
    console.info(this.props);
    this.state = {
      __id: id,
      agentDetails: profileDetails.placePending === 'pending'
        ? 'pending'
        : null,
      agentForm: true,
      editmode: false,
      popupIsOpen: false,
      __companyEmail: email,
      __name: name,
      __images: gallery
        ? gallery.images.map(({id, src}) => ({
          source: id,
          preview: src,
        }))
        : [],
      __defaultImageIndex: gallery
        ? gallery.images.findIndex(image => image.default)
        : null,
      __phoneNumber: phoneNumber || '',
      __socialMediaLinks: socialMediaLinks || [],
      __description: description || '',
      __branches: branches || [],
      __hobbies: hobbies ? hobbies.map(({
          id,
          name,
          titles,
          ageGroups,
          audience,
          dataFromPivotTable,
        }) =>
        ({
          hobby: {
            value: id,
            label: name,
            titles: this.getHobbyTitles(id),
            ageGroups,
            audience,
          },
          audience,
          ageGroups: this.getHobbyAgeGroups(ageGroups, dataFromPivotTable),
          titles: dataFromPivotTable.titles.length ? this.getTitles(titles.place, dataFromPivotTable.titles) : null,
        })) : [],
    };

    this.submitFormData = this.submitFormData.bind(this);
  }

  getHobbyTitles(hobbyID){
    const object = this.getHobbiesOptions().find(i => i.value === hobbyID);
    return object.titles;
  }

  getTitles(arr1, arr2){
    let titles = [];

    arr1.forEach((e1)=> arr2.forEach((e2)=>{
        if (e1.id === e2){
          titles.push(e1)
        }
      }
    ));

    return titles
  }

  getHobbyAgeGroups(ageGroupsOptions, dataFromPivotTable){
    let ageGroups = [];

    forEach(dataFromPivotTable.ageGroups, groupId => {
      const reqiredAgeGroup = ageGroupsOptions.find(gr => gr.id === groupId);

      if(reqiredAgeGroup){
        ageGroups.push({
          value: reqiredAgeGroup.id,
          label: reqiredAgeGroup.name
        });
      }
    });

    return ageGroups
  }

  getHobbiesOptions() {
    const { hobbiesList, childrenHobbiesList, userHaveChildrens } = this.props;
    let options = [];

    if(!userHaveChildrens){
      options.push(...childrenHobbiesList.map(({
         id: value,
         name: label,
         audience,
         ageGroups,
         titles,
       }) => ({
        value,
        label,
        audience,
        ageGroups,
        titles,
      })));
    }

    forEach(hobbiesList, ({children, hobbies}) => {
      if (children) {
        children.forEach(({hobbies}) => {
          options.push(...hobbies.map(({
           id: value,
           name: label,
           audience,
           ageGroups,
           titles,
         }) => ({
            value,
            label,
            audience,
            titles,
            ageGroups: !!ageGroups.length? ageGroups : null,
          })));
        });
      } else {
        options.push(...hobbies.map(({
         id: value,
         name: label,
         audience,
         titles,
         ageGroups,
       }) => ({
          value,
          label,
          audience,
          titles,
          ageGroups: !!ageGroups.length? ageGroups : null,
        })));
      }
    });

    return options;
  }

  getFormData() {
    const {
      __id,
      __name: name,
      __companyEmail,
      __phoneNumber,
      __socialMediaLinks,
      __description: description,
      __branches,
      __hobbies,
      __images,
      __defaultImageIndex,
    } = this.state;

    const defaultBranchIndex = __branches.findIndex(b => b.default);

    return appendToFormData(
      new FormData(),
      {
        user: {
          place: __id,
          name,
          description,
          email: __companyEmail,
          phoneNumber: __phoneNumber || null,
          defaultBranch: __branches && __branches.length >= 1 ? defaultBranchIndex : null,
          branches: __branches
            ? __branches.map(({schedule, gallery, location, region, description }) => ({
              region: region.code ? region.code : region,
              schedule,
              description,
              location,
              gallery: {
                images: gallery.images.map(({id, source, crop}) =>
                  ({
                    source: id || source,
                    crop,
                  })
                ),
                default: gallery.defaultImg === -1 ? 0 : gallery.defaultImg,
              },
            }))
            : null,
          gallery: {
            images: __images.map(({source, crop}) => ({source, crop})),
            default: __defaultImageIndex,
          },
          socialMediaLinks: __socialMediaLinks
            ? __socialMediaLinks.map(({id, name, type, url}) => ({
              type: type? type.value : id,
              url
            }))
            : null,
          hobbies: __hobbies.map(({
            hobby,
            audience,
            ageGroups,
            titles
          }) => ({
            hobby: hobby.value,
            audience,
            ageGroups: ageGroups? ageGroups.map(({value}) => value) : null,
            titles: titles && titles.length ? titles.map(({value, id}) => (value || id)) : null,
          })),
        },
      },
    );
  }

  submitFormData(e) {
    e.preventDefault();

    const {
      dispatch,
      accessToken,
    } = this.props;

    this.submitFormDataFetcher = dispatch(
      fetchAuthorizedApiRequest('/v1/places/pending', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: this.getFormData(),
      })
    );

    this.submitFormDataFetcher
      .then(response => {
        switch(response.status) {
          case 200:
            return response.json();

          case 204:
            this.setState({
              agentDetails: 'pending',
            }, () => {
               this.fetchUserData();
          });
            return Promise.resolve();

          case 422:
            return response.json().then(({errors}) => {
              this.setState({errors});

              return Promise.reject(
                new UnprocessableEntity()
              );
            });
          default:
            return Promise.reject(
              new InternalServerError()
            );
        }
      })
      .then(() => {
        this.setState({
          errors: null,
          agentForm: false,
        }, () => {
          return Promise.resolve();
        });
      })
  }

  fetchUserData() {
    const {
      accessToken,
      dispatch,
    } = this.props;

    dispatch (
      fetchAuthorizedApiRequest('/v1/account/details', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    )
    .then(response => {
      switch (response.status) {
        case 200:
          return response.json();
        default:
          return Promise.reject(
            new SilencedError('Failed to fetch user data.')
          );
      }
    })
      .then(data =>
        dispatch(
         setUserData(data)
      ))
  }

  render() {
    const {
      hasPassword,
      profileDetails
    } = this.props;

    const {
      __images,
      __defaultImageIndex,
      popupIsOpen,
      __name,
      __phoneNumber,
      __description,
      __hobbies,
      __socialMediaLinks,
      __companyEmail,
      __branches,
      errors,
      agentForm,
      agentDetails,
    } = this.state;

    return (
      <Layout
        hasSidebar
        hasAds
        whichSidebar='My Profile'
        contentHasBackground
      >
        <div className={s.root}>

          <button onClick={() => {
            this.setState({agentForm: !agentForm})
          }}
                  className={classes(s.question, {
                    [s.open]: agentDetails === 'pending' || agentForm }
                  )}
          >
            {
              (agentDetails === 'pending' &&(
                I18n.t('settings.pending.agentRequest')
              )) || (
                (agentForm &&(
                  I18n.t('settings.pending.agentForm')
                )) || (
                  I18n.t('settings.pending.agentQuestion')
                )
              )
            }
          </button>

          {
            agentForm &&(
              <AgentEdit
                hobbiesList={this.getHobbiesOptions()}
                onSubmit={this.submitFormData}
                errors={errors}
                placeRole='place'
                hasPassword={hasPassword}
                popupIsOpen={popupIsOpen}
                __name={__name}
                __phoneNumber={__phoneNumber}
                __description={__description}
                __hobbies={__hobbies}
                __socialMediaLinks={__socialMediaLinks}
                __branches={__branches}
                __companyEmail={__companyEmail}
                defaultImageIndex={__defaultImageIndex}
                __images={__images}
                onEmailChange={(e) => this.setState({__companyEmail: e.target.value})}
                confirmed={profileDetails.confirmed}
                switchPasswordPopup={() => {
                  this.setState({
                    popupIsOpen: !popupIsOpen,
                  })
                }}

                onNameChange={({target: {value: __name}}) => {
                  this.setState({__name});
                }}

                onImageChange={(attachments) => {
                  this.setState({
                    __images: [
                      ...__images,
                      ...attachments,
                    ],
                  });
                }}

                setDefaultImage={(__defaultImageIndex) => {
                  this.setState({__defaultImageIndex});
                }}

                deleteImage={(i) => {
                  if (__defaultImageIndex >= i) {
                    this.setState({
                      __defaultImageIndex: __defaultImageIndex === i
                        ? null : __defaultImageIndex - 1,
                    });
                  }

                  this.setState({
                    __images: update(__images, {
                      $splice: [[i, 1]],
                    }),
                  });
                }}

                cropImage ={(i, crop, size) => {
                  this.setState({
                    __images: update(__images, {
                      [i]: {
                        $apply: (image) => update(image, {
                          crop: {
                            $set: crop,
                          },
                          size: {
                            $set: size,
                          },
                        }),
                      },
                    }),
                  });
                }}

                onPhoneNumberChange={({target: {value: __phoneNumber}}) => {
                  this.setState({__phoneNumber})
                }}

                onDescriptionChange={({target: {value: __description}}) => {
                  this.setState({__description})
                }}

                onHobbiesChange={__hobbies => {
                  this.setState({__hobbies});
                }}

                onSocialMediaLinksChange={__socialMediaLinks => {
                  this.setState({__socialMediaLinks})
                }}

                onBranchesChange={__branches=> {
                  this.setState({__branches})
                }}

                onCancelEdit={() => {
                  this.setState({
                    agentForm: false,
                  })
                }}
              />
            )
          }
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(store) {
  return {
    UIVersion: store.app.UIVersion,
    profileDetails: store.user,
    accessToken: store.auth.accessToken,
    hobbiesList: store.hobbies.list,
    childrenHobbiesList: store.hobbies.forChildren,
    userHaveChildrens: !!store.user.children.length,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(AgentContainer)));
