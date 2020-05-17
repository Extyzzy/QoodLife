import React, { Component } from "react";
import {forEach} from "lodash";
import {appendToFormData} from "../../../../../helpers/form";
import {fetchAuthorizedApiRequest} from "../../../../../fetch";
import {InternalServerError, UnprocessableEntity} from "../../../../../exceptions/http";
import {connect} from "react-redux";
import {I18n} from "react-redux-i18n";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../../Settings.scss';
import ProfessionalEdit from '../../../EditProfile/components/ProfileDetails/ProfessionalForm/Edit'
import update from "immutability-helper";
import moment from "moment/moment";
import classes from "classnames";
import Layout from "../../../../../components/_layout/Layout";
import {
  setUserData,
} from "../../../../../actions/user";
import {SilencedError} from "../../../../../exceptions/errors";

class ProfessionalContainer extends Component {
  constructor(props, context) {
    super(props, context);
    const {
      profileDetails,
    } = this.props;

    const {
      firstName,
      lastName,
      gallery,
      dateOfBirth,
      phoneNumber,
      email,
      description,
      studies,
      workingPlaces,
      socialMediaLinks,
      hobbies,
    } = profileDetails.profDetails || false;

    this.state = {
      toBeProsInvitationsList: [],
      invitationsToBeProsAreLoaded: false,
      profDetails: profileDetails,
      profForm: true,
      popupIsOpen: false,
      publicEmail: email || null,
      __prosParent: null,
      __firstName: firstName || '',
      __lastName: lastName || '',
      __dateOfBirth: moment.unix(dateOfBirth),
      __images: gallery
        ? gallery.images.map(({id, src}) => ({
          source: id,
          preview: src,
        }))
        : [],
      __defaultImageIndex: gallery
        ? gallery.images.findIndex(image => image.default)
        : null,
      __socialMediaLinks: socialMediaLinks || [],
      __workingPlaces: workingPlaces || [],
      __studies: studies || [],
      __phoneNumber: phoneNumber || '',
      __description: description || '',
      __profileLanguage: profileDetails.language,
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
          titles: dataFromPivotTable.titles.length ? this.getTitles(titles.professional, dataFromPivotTable.titles) : null,
        })) : [],
    };

    this.saveChanges = this.saveChanges.bind(this);
  }

  componentDidMount() {
    this.fetchProsThatInvitedUserToBePros();
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

  fetchProsThatInvitedUserToBePros() {
    const { accessToken, dispatch } = this.props;

    this.fetchProsThatInvitedUserReqest = dispatch(
      fetchAuthorizedApiRequest(`/v1/account/invitations/have`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    );

    this.fetchProsThatInvitedUserReqest
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
    .then(toBeProsInvitationsList => {
      this.setState({
        toBeProsInvitationsList,
        invitationsToBeProsAreLoaded: true,
      });

      return Promise.resolve();
    });
  }

  getHobbiesOptions() {
    const { hobbiesList, childrenHobbiesList } = this.props;
    let options = [];

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
      titles,
      ageGroups: !!ageGroups.length? ageGroups : null,
    })));

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
      publicEmail: email,
      __firstName: firstName,
      __lastName: lastName,
      __phoneNumber: phoneNumber,
      __description: description,
      __dateOfBirth,
      __images,
      __defaultImageIndex,
      __socialMediaLinks,
      __workingPlaces,
      __studies,
      __profileLanguage: language,
      __prosParent,
      __hobbies,
    } = this.state;

    return appendToFormData(
      new FormData(),
      {
        user: {
          firstName,
          lastName,
          phoneNumber,
          description,
          email,
          language: language.id,
          parent: __prosParent? __prosParent.value : null,
          dateOfBirth: __dateOfBirth.unix() ? __dateOfBirth.unix() : null,
          studies: __studies? __studies.map(item => item) : null,
          socialMediaLinks: __socialMediaLinks
            ? __socialMediaLinks.map(({id, name, type, url}) => ({
              type: (type && type.value) || id,
              url
            }))
            : null,
          workingPlaces: __workingPlaces
            ? __workingPlaces.map(({institution, position, location, region}) => ({
              region: region.code ? region.code : region,
              institution,
              position,
              location,
            }))
            : null,
          gallery: {
            images: __images.map(({source, crop}) => ({source, crop})),
            default: __defaultImageIndex,
          },
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

  submitFormData() {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const {
      profDetails,
      __prosParent,
    } = this.state;

    this.submitFormDataFetcher = dispatch(
      fetchAuthorizedApiRequest('/v1/professionals/pending', {
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
          const pstatus = __prosParent? 'ok' : 'pending';

            this.setState({
              profDetails: update(profDetails, {
                $apply: (profDetails) => update(profDetails, {
                  profPending: {
                    $set: pstatus,
                  },
              }),
             })
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
          profForm: false,
        }, () => {
          return Promise.resolve();
        });
      })
  }

  saveChanges(e) {
    e.preventDefault();
    this.submitFormData();
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
      profileDetails,
      hasPassword,
    } = this.props;

    const {
      popupIsOpen,
      publicEmail,
      toBeProsInvitationsList,
      invitationsToBeProsAreLoaded,
      errors,
      __firstName,
      __lastName,
      __dateOfBirth,
      __images,
      __defaultImageIndex,
      __socialMediaLinks,
      __workingPlaces,
      __studies,
      __phoneNumber,
      __description,
      __profileLanguage,
      __prosParent,
      __hobbies,
      profForm,
      profDetails,
    } = this.state;

    const parentOptions = toBeProsInvitationsList.map(({
      user: {
        id,
        firstName,
        lastName
      }
    }) => ({
      value: id,
      label: `${firstName} ${lastName}`
    }));

    return (
      <Layout
        hasSidebar
        hasAds
        whichSidebar='My Profile'
        contentHasBackground
      >
      <div className={s.root}>
          <button onClick={() => {
            this.setState({profForm: !profForm})
          }}
            className={classes(s.question, {
              [s.open]: profDetails.profPending === 'pending' || profForm }
            )}
          >
            {
              ( profDetails.profPending === 'pending' &&(
                I18n.t('settings.pending.professionalsRequest')
              )) || (
                (profForm &&(
                  I18n.t('settings.pending.professionalsForm')
                )) || (
                  I18n.t('settings.pending.professionalsQuestion')
                )
              )
            }
          </button>

        {
          profForm &&(
            <ProfessionalEdit
              hobbiesList={this.getHobbiesOptions()}
              onSubmit={this.saveChanges}
              hasParentSelector
              prosRole='professional'
              hasPassword={hasPassword}
              popupIsOpen={popupIsOpen}
              defaultImageIndex={__defaultImageIndex}
              publicEmail={publicEmail}
              toBeProsInvitationsList={parentOptions}
              invitationsToBeProsAreLoaded={invitationsToBeProsAreLoaded}
              __firstName={__firstName}
              __lastName={__lastName}
              __dateOfBirth={__dateOfBirth}
              __images={__images}
              __socialMediaLinks={__socialMediaLinks}
              __workingPlaces={__workingPlaces}
              __studies={__studies}
              __phoneNumber={__phoneNumber}
              __description={__description}
              __profileLanguage={__profileLanguage}
              __prosParent={__prosParent}
              __hobbies={__hobbies}
              errors={errors}
              confirmed={profileDetails.confirmed}
              onCancelEdit={() => {
                this.setState({profForm: false})
              }}

              onEmailChange={({target: {value: publicEmail}}) => {
                this.setState({publicEmail})
              }}

              switchPasswordPopup={() => {
                this.setState({
                  popupIsOpen: !popupIsOpen,
                })
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

              onFirstNameChange={({target: {value: __firstName}}) => {
                this.setState({__firstName});
              }}

              onLastNameChange={({target: {value: __lastName}}) => {
                this.setState({__lastName});
              }}

              onDescriptionChange={({target: {value: __description}}) => {
                this.setState({__description});
              }}

              onBlogLanguagesChange={__blogLanguages => {
                this.setState({__blogLanguages});
              }}

              onHobbiesChange={__hobbies => {
                this.setState({__hobbies});
              }}


              onPhoneNumberChange={({target: {value: __phoneNumber}}) => {
                this.setState({__phoneNumber});
              }}

              onDateOfBirthChange={__dateOfBirth => {
                this.setState({__dateOfBirth});
              }}

              onSocialMediaLinksChange={__socialMediaLinks => {
                this.setState({__socialMediaLinks});
              }}

              onStudiesChange={__studies => {
                this.setState({__studies});
              }}

              onworkingPlacesChange={__workingPlaces => {
                this.setState({__workingPlaces});
              }}

              onProsParentChange={__prosParent => {
                this.setState({__prosParent});
              }}

              role={profileDetails.roles.filter(data => data.code === 'professional')}
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
    socialMediaTypesList: store.socialMediaTypes.list,
  };
}

export default connect(mapStateToProps)(withStyles(s)(ProfessionalContainer));
