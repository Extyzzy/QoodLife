import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {I18n} from 'react-redux-i18n';
import React, { Component } from "react";
import s from './Edit.scss';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import {actionIsAllowed} from "../../../../helpers/permissions";
import PageNotFound from '../../../../pages/_errors/PageNotFound';
import Loader from '../../../../components/Loader';
import EditPlaceForm from '../../../../pages/_profile/EditProfile/components/ProfileDetails/AgentForm/Edit';
import Forbidden from '../../../../pages/_errors/Forbidden/Forbidden';
import {appendToFormData} from "../../../../helpers/form";
import {fetchAuthorizedApiRequest} from "../../../../fetch";
import {forEach} from "lodash";
import {InternalServerError, UnprocessableEntity} from "../../../../exceptions/http";
import {MOBILE_VERSION} from "../../../../actions/app";
import update from "immutability-helper";

class Edit extends Component {
  constructor(props, context) {
    super(props, context);

    const data = props.location.state && props.location.state.data
      ? props.location.state.data : null;

    const {
      owner,
      name,
      logo,
      email,
      phoneNumber,
      hobbies,
      description,
      socialMediaLinks,
      branches,
      schedule,
      gallery,
    } = data;

    this.state = {
      isFetching: false,
      data,
      isLoaded: !!data,
      __id: owner ? owner.id : '',
      __name: name || '',
      __nameLegal: '',
      __description: description || '',
      __companyEmail: email || '',
      __schedule: schedule || '',
      __phoneNumber: phoneNumber || '',
      __avatar: logo
        ? {
          id: logo.id,
          src: logo.src,
          preview: logo.src,
        }
        : null,
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

    this.saveChanges = this.saveChanges.bind(this);
  }

  componentWillUnmount() {
    if (this.submitFormDataFetcher instanceof Promise) {
      this.submitFormDataFetcher.cancel();
    }
  }

  getHobbyTitles(hobbyID){
    const object = this.getHobbiesOptions().find(i => i.value === hobbyID);

    return object ? object.titles : null;
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
    const { hobbiesList } = this.props;
    let options = [];

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
      __name: name,
      __nameLegal: legalName,
      __description: description,
      __companyEmail: email,
      __schedule: schedule,
      __avatar,
      __images,
      __defaultImageIndex,
      __phoneNumber: phoneNumber,
      __socialMediaLinks,
      __branches,
      __hobbies,
    } = this.state;

    const defaultBranchIndex = __branches.findIndex(b => b.default) || 0;

    return appendToFormData(
      new FormData(),
      {
        user: {
          name,
          legalName,
          description,
          email,
          schedule,
          phoneNumber,
          logo: __avatar ? {
            source: __avatar.source? __avatar.source : __avatar.id,
            crop: __avatar.crop,
          } : null,
          gallery: {
            images: __images.map(({source, crop}) => ({source, crop})),
            default: __defaultImageIndex,
          },
          socialMediaLinks: __socialMediaLinks
            ? __socialMediaLinks.map(({id, name, type, url}) => ({
              type: (type && type.value) || id,
              url
            }))
            : null,
          defaultBranch: defaultBranchIndex,
          branches: __branches
            ? __branches.map(({schedule, gallery, location, region, description}) => ({
              region: region.code ? region.code : region,
              description,
              schedule,
              location,
              gallery: {
                images: gallery.images.map(({id, source, crop}) =>
                  ({
                    source: id || source,
                    crop,
                  })
                ),
                default: gallery.defaultImg,
              },
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
            ageGroups: ageGroups ? ageGroups.map(({value}) => value) : null,
            titles: titles && titles.length ? titles.map(({value, id}) => (value || id)) : null,
          })),
        },
        role: 'place',
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
      fetchAuthorizedApiRequest('/v1/account', {
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
        }, () => {
          window.history.back();
        }, () => {
          return Promise.resolve();
        });
      })
  }

  saveChanges(e) {
    e.preventDefault();
    this.submitFormData();
  }

  render() {
    const {
      permissions,
      UIVersion,
      confirmed
    } = this.props;

    const {
      data,
      isLoaded,
      errors,
      __name,
      __nameLegal,
      __description,
      __companyEmail,
      __schedule,
      __avatar,
      __phoneNumber,
      __socialMediaLinks,
      __branches,
      __hobbies,
      __images,
      __defaultImageIndex,
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

    if( ! actionIsAllowed(permissions, {
        module: 'places',
        action: 'update-all',
      })) {
      return(
        <Forbidden />
      )
    }

    return (
        <div className={s.root}>
          <div className={s.title}>
            <h4>{I18n.t('administration.editPlace')}</h4>
          </div>
          <EditPlaceForm
            __images={__images}
            defaultImageIndex={__defaultImageIndex}
            isMobile={UIVersion === MOBILE_VERSION}
            errors={errors}
            hobbiesList={this.getHobbiesOptions()}
            placeRole='place'
            __name={__name}
            __nameLegal={__nameLegal}
            __description={__description}
            __companyEmail={__companyEmail}
            __schedule={__schedule}
            __avatar={__avatar}
            __phoneNumber={__phoneNumber}
            __socialMediaLinks={__socialMediaLinks}
            __branches={__branches}
            __hobbies={__hobbies}
            confirmed={confirmed}
            onSubmit={this.saveChanges}
            onNameChange={(e) => this.setState({__name: e.target.value})}
            onLegalNameChange={(e) => this.setState({__nameLegal: e.target.value})}
            onEmailChange={(e) => this.setState({__companyEmail: e.target.value})}
            onScheduleChange={(e) => this.setState({__schedule: e.target.value})}
            onAvatarChange={([__avatar]) => this.setState({__avatar})}
            onDeleteAvatar={() => this.setState({__avatar: null})}
            onBranchesChange={__branches => this.setState({__branches})}
            onHobbiesChange={__hobbies => this.setState({__hobbies})}

            setDefaultImage={(__defaultImageIndex) => {
              this.setState({__defaultImageIndex});
            }}

            onImageChange={(attachments) => {
              this.setState({
                __images: [
                  ...__images,
                  ...attachments,
                ],
              });
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

            onDescriptionChange={(e) =>
              this.setState({__description: e.target.value})
            }

            onPhoneNumberChange={(e) =>
              this.setState({__phoneNumber: e.target.value})
            }

            onSocialMediaLinksChange={(__socialMediaLinks) =>
              this.setState({__socialMediaLinks})
            }
            onCancelEdit={() =>  window.history.back()}
          />
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    UIVersion: state.app.UIVersion,
    permissions: state.user.permissions,
    confirmed: state.user.confirmed,
    hobbiesList: state.hobbies.list,
    childrenHobbiesList: state.hobbies.forChildren,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(Edit)));
