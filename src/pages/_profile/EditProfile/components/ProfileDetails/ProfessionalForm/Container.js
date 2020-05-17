import React, { Component } from "react";
import update from 'immutability-helper';
import moment from 'moment';
import { connect } from "react-redux";
import { appendToFormData } from '../../../../../../helpers/form';
import { fetchAuthorizedApiRequest } from '../../../../../../fetch';
import { forEach } from 'lodash';
import { UnprocessableEntity, InternalServerError } from '../../../../../../exceptions/http';
import { MOBILE_VERSION } from '../../../../../../actions/app';
import { receiveEditUser } from '../../../../../../actions/user';
import ProfessionalEdit from './Edit';
import ViewMobile from './ViewMobile';
import View from './View';
import {SilencedError} from "../../../../../../exceptions/errors";
import {withRouter} from "react-router";

class Container extends Component {
  constructor(props, context) {
    super(props, context);
    const {
      profileDetails,
    } = this.props;

    const {
      firstName,
      lastName,
      avatar,
      gallery,
      dateOfBirth,
      phoneNumber,
      email,
      description,
      studies,
      workingPlaces,
      socialMediaLinks,
      hobbies,
    } = profileDetails.profDetails;

    this.state = {
      isFetching: false,
      profForm: false,
      popupIsOpen: false,
      publicEmail: email || null,
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
        : 0,
      __avatar: avatar
        ? {
          id: avatar.id,
          src: avatar.src,
          preview: avatar.src,
        }
        : null,
      __socialMediaLinks: socialMediaLinks || [],
      __workingPlaces: workingPlaces || [],
      __studies: studies || [],
      __phoneNumber: phoneNumber || '',
      __description: description || '',
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
    this.promotion = this.promotion.bind(this);
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

  promotion() {
    const {
      dispatch,
      profileDetails,
      history,
      accessToken,
    } = this.props;

    dispatch(
      fetchAuthorizedApiRequest(`/v1/professionals/promotions?professional=${profileDetails.profDetails.id}`, {
        ...(accessToken ? {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        } : {})
      })
    )
      .then(response => {
        switch (response.status) {
          case 201:
            profileDetails.profDetails.status.promotion = true;
            this.forceUpdate();
            return;

          case 403:
            return history.push(`/profile/ads`);

          default:

            return Promise.reject(
              new SilencedError('Failed to fetch activate promotion.')
            );
        }
      })
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
              location: {
                label: location.label,
                longitude: location.longitude,
                latitude: location.latitude,
              },
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
            ageGroups: ageGroups ? ageGroups.map(({value}) => value) : null,
            titles: titles && titles.length ? titles.map(({value, id}) => (value || id)) : null,
          })),
        },
        role: 'professional',
        _method: 'PUT',
      },
    );
  }

  submitFormData() {
    const {
      dispatch,
      accessToken,
    } = this.props;

    this.submitFormDataFetcher = dispatch(
      fetchAuthorizedApiRequest('/v1/account ', {
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
      .then(data => {
        this.setState({
          errors: null,
          editMode: false,
          isFetching: false,
        }, () => {
          dispatch(receiveEditUser(data))
        }, () => {
          window.scrollTo(0, 0);
          return Promise.resolve();
        });
      })
  }

  saveChanges(e) {
    e.preventDefault();
    this.setState({
      isFetching: true
    }, () => this.submitFormData());

  }

  render() {
    const {
      profileDetails,
      hasPassword,
      UIVersion,
      admin,
      demo,
    } = this.props;

    const {
      popupIsOpen,
      publicEmail,
      errors,
      isFetching,
      __firstName,
      __lastName,
      __dateOfBirth,
      __images,
      __defaultImageIndex,
      __avatar,
      __socialMediaLinks,
      __workingPlaces,
      __studies,
      __phoneNumber,
      __description,
      __hobbies,
      editMode,
    } = this.state;

    if(editMode) {
      return (
        <ProfessionalEdit
          hasAvatar
          isMobile={UIVersion === MOBILE_VERSION}
          hobbiesList={this.getHobbiesOptions()}
          onSubmit={this.saveChanges}
          prosRole='professional'
          onCancelEdit={() => this.setState({
              editMode: false
            }, () => window.scrollTo(0, 0)
          )
          }
          hasParentSelector={false}
          hasPassword={hasPassword}
          popupIsOpen={popupIsOpen}
          defaultImageIndex={__defaultImageIndex}
          publicEmail={publicEmail}
          isFetching={isFetching}
          __firstName={__firstName}
          __lastName={__lastName}
          __dateOfBirth={__dateOfBirth}
          __images={__images}
          __avatar={__avatar}
          __socialMediaLinks={__socialMediaLinks}
          __workingPlaces={__workingPlaces}
          __studies={__studies}
          __phoneNumber={__phoneNumber}
          __description={__description}
          __hobbies={__hobbies}
          errors={errors}
          confirmed={profileDetails.confirmed}
          onEmailChange={({target: {value: publicEmail}}) => {
            this.setState({publicEmail})
          }}

          switchPasswordPopup={() => {
            this.setState({
              popupIsOpen: !popupIsOpen,
            })
          }}

          onAvatarChange={([__avatar]) => {
            this.setState({
              __avatar,
            });
          }}

          deleteAvatar={() => {
            this.setState({
              __avatar: null,
            });
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
                  ? 0 : __defaultImageIndex - 1,
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
          onHobbiesChange={__hobbies => {
            this.setState({__hobbies});
          }}

          onPhoneNumberChange={({target: {value: __phoneNumber}}) => {
            this.setState({__phoneNumber})
          }}

          onDateOfBirthChange={__dateOfBirth => {
            this.setState({__dateOfBirth})
          }}

          onSocialMediaLinksChange={__socialMediaLinks => {
            this.setState({__socialMediaLinks})
          }}

          onStudiesChange={__studies => {
            this.setState({__studies})
          }}

          onworkingPlacesChange={__workingPlaces => {
            this.setState({__workingPlaces})
          }}
        />
      )
    }

    if(UIVersion === MOBILE_VERSION){
      return (
        <ViewMobile
          switchEditMode={() => this.setState({editMode: true})}
          profDetails={profileDetails.profDetails}
          role={profileDetails.roles.filter(data => data.code === 'professional')}
        />
      )
    }

    return (
      <View
        switchEditMode={() => this.setState({editMode: true})}
        profDetails={profileDetails.profDetails}
        role={profileDetails.roles.filter(data => data.code === 'professional')}
        promotion={this.promotion}
        admin={admin}
        demo={demo}
      />
    )
  }
}

function mapStateToProps(store) {
  return {
    UIVersion: store.app.UIVersion,
    profileDetails: store.user,
    accessToken: store.auth.accessToken,
    hobbiesList: store.hobbies.list,
    childrenHobbiesList: store.hobbies.forChildren,
    socialMediaTypesList: store.socialMediaTypes.list,
  };
}

export default withRouter(connect(mapStateToProps)(Container));
