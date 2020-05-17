import { connect } from 'react-redux';
import React, { Component } from "react";
import update from 'immutability-helper';
import moment from 'moment';
import { appendToFormData } from '../../../../helpers/form';
import { fetchAuthorizedApiRequest } from '../../../../fetch';
import { forEach } from 'lodash';
import { UnprocessableEntity, InternalServerError } from '../../../../exceptions/http';
import { MOBILE_VERSION } from '../../../../actions/app';
import { receiveEditUser } from '../../../../actions/user';
import ProfessionalEdit from '../../../../pages/_profile/EditProfile/components/ProfileDetails/ProfessionalForm/Edit';
import PageNotFound from '../../../../pages/_errors/PageNotFound';
import Loader from '../../../../components/Loader';
import {withRouter} from "react-router";
import {actionIsAllowed} from "../../../../helpers/permissions";
import Forbidden from '../../../../pages/_errors/Forbidden/Forbidden';
import {I18n} from "react-redux-i18n";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from './Edit.scss';

class EditContainer extends Component {
  constructor(props, context) {
    super(props, context);

    const data = props.location.state && props.location.state.data
      ? props.location.state.data : null;

    const {
      owner,
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
    } = data;

    this.state = {
      data,
      isLoaded: !!data,
      isFetching: false,
      profForm: false,
      popupIsOpen: false,
      __id: owner.id,
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
        : null,
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
      __location: null,
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
      __id: id,
      publicEmail: email,
      __firstName: firstName,
      __lastName: lastName,
      __phoneNumber: phoneNumber,
      __description: description,
      __dateOfBirth,
      __images,
      __defaultImageIndex,
      __avatar,
      __socialMediaLinks,
      __workingPlaces,
      __studies,
      __location: location,
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
          location,
          email,
          dateOfBirth: __dateOfBirth.unix(),
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
          avatar: __avatar ? {
            source: __avatar.source? __avatar.source : __avatar.id,
            crop: __avatar.crop,
          } : null,
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
        role: 'professional',
        _method: 'PUT',
        for: id,
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
          isFetching: false,
        }, () => {
          window.history.back();
        }, () => {
          dispatch(receiveEditUser(data))
        }, () => {
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
      hasPassword,
      UIVersion,
      permissions,
      confirmed
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
      __location,
      data,
      isLoaded,
    } = this.state;

    if ( ! isLoaded) {
      return (
        <Loader />
      );
    }

    if ( ! data) {
      return (
        <PageNotFound />
      );
    }

    if ( ! actionIsAllowed(permissions, {
        module: 'professionals',
        action: 'update-all',
      })) {
      return(
        <Forbidden />
      )
    }

      return (
        <div className={s.root}>
          <div className={s.title}>
            <h4>{I18n.t('administration.editProf')}</h4>
          </div>
        <ProfessionalEdit
          isMobile={UIVersion === MOBILE_VERSION}
          hobbiesList={this.getHobbiesOptions()}
          onSubmit={this.saveChanges}
          prosRole='professional'
          onCancelEdit={() => window.history.back()}
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
          __location={__location}
          __phoneNumber={__phoneNumber}
          __description={__description}
          __hobbies={__hobbies}
          errors={errors}
          confirmed={confirmed}
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
          onHobbiesChange={__hobbies => {
            this.setState({__hobbies});
          }}

          onPhoneNumberChange={({target: {value: __phoneNumber}}) => {
            this.setState({__phoneNumber})
          }}

          onDateOfBirthChange={__dateOfBirth => {
            this.setState({__dateOfBirth})
          }}

          onPlaceChange={__location => {
            this.setState({__location})
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
        </div>
      )
  }
}

function mapStateToProps(store) {
  return {
    UIVersion: store.app.UIVersion,
    accessToken: store.auth.accessToken,
    hobbiesList: store.hobbies.list,
    childrenHobbiesList: store.hobbies.forChildren,
    userHaveChildrens: !!store.user.children.length,
    confirmed: store.user.confirmed,
    socialMediaTypesList: store.socialMediaTypes.list,
    permissions: store.user.permissions,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(EditContainer)));
