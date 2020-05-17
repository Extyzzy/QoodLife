import React, { Component } from "react";
import moment from 'moment';
import { connect } from "react-redux";
import { forEach } from 'lodash';
import { appendToFormData } from '../../../../../../helpers/form';
import { fetchAuthorizedApiRequest } from '../../../../../../fetch';
import { receiveEditUser } from '../../../../../../actions/user';
import { MOBILE_VERSION } from '../../../../../../actions/app';
import {
  UnprocessableEntity,
  InternalServerError,
} from '../../../../../../exceptions/http';
import Edit from './Edit';
import ViewMobile from './ViewMobile';
import View from './View';

class Container extends Component {
  constructor(props, context) {
    super(props, context);
    const {
      gender,
      children,
      hobbies,
      childrenHobbies,
      language,
      avatar,
      locations,
      region,
      dateOfBirth,
      blogLanguages,
      firstName,
      lastName,
    } = this.props.profileDetails;

    const [ defaultLocation ] = locations;
    const hasDefaultGender = gender.slug === 'unisex';

    this.state = {
      popupIsOpen: false,
      groupsAreLoaded: false,
      editMode: false,
      childrenHobbiesOptions: null,
      showChildrenHobbiesSelect: !!children.length,
      __hobbiesForChildrens: childrenHobbies
      ? childrenHobbies.map(({
        id,
        name
      }) => ({
        value: id,
        label: name,
      }))
      : [],
      __hobbies: hobbies.map(({
        id,
        name
      }) => ({
        value: id,
        label: name,
      })),
      __firstName: firstName || '',
      __lastName: lastName || '',
      __location: defaultLocation || null,
      __region: region || null,
      __dateOfBirth: moment.unix(dateOfBirth),
      __profileLanguage: language,
      __gender: hasDefaultGender
      ? null
      : {
           value: gender.id,
           label: gender.name,
      },
      __children: children
        ? children.map(({dateOfBirth, gender}) => ({
          dateOfBirth: dateOfBirth || 0,
          gender,
          in_planning: !dateOfBirth && true
        }))
        : [],
      __avatar: avatar
        ? {
            id: avatar.id,
            src: avatar.src,
            preview: avatar.src,
          }
        : null,
      __blogLanguages: blogLanguages
        ? blogLanguages.map(
            ({id: value, full: label}) => ({value, label})
          )
        : [],
    };

    this.saveChanges = this.saveChanges.bind(this);
  }

  componentDidMount() {
    this.setProfileLanguage();
    this.getHobbiesForChildren();
  }

  componentWillReceiveProps(nextProps) {
    const {
      profileLanguagesList,
    } = nextProps;

    const [defaultProfileLanguage] = profileLanguagesList;

    if (defaultProfileLanguage !== undefined) {
      this.setState({
        __profileLanguage: {
          value: defaultProfileLanguage.id,
          label: defaultProfileLanguage.full,
        },
      })
    }
  }

  componentWillUnmount() {
    if (this.submitFormDataFetcher instanceof Promise) {
      this.submitFormDataFetcher.cancel();
    }
  }

  getBlogLanguagesList() {
    const { blogLanguagesList } = this.props;

    return blogLanguagesList.map(
      ({id: value, full: label}) => ({value, label}));
  }

  getHobbiesForChildren() {
    const {
      dispatch,
      accessToken,
    } = this.props;

    this.getChildrensHobbiesFetcher = dispatch(
      fetchAuthorizedApiRequest(
        `/v1/hobbies/for-children`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        })
    );

    this.getChildrensHobbiesFetcher
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
      .then(hobbies => {
        let options = [];
        forEach(hobbies.list, item => {
          if(item.can_be_favorite){
            options.push({
              value: item.id,
              label: item.name
            })
          }
        });

        this.setState({
          childrenHobbiesOptions: options,
        }, () => {
          return Promise.resolve();
        });
      })
  }

  setProfileLanguage() {
    const {
      __profileLanguage,
    } = this.state;

    const {
      profileLanguagesList,
    } = this.props;

    const browserLang = navigator.language.replace(/-|[A-Z]/g, '');
    const [defaultProfileLanguage] = profileLanguagesList;

    if (defaultProfileLanguage !== undefined && __profileLanguage === null) {
      const userLanguage = profileLanguagesList.find(l => l.short === browserLang);

      if(!!userLanguage){
        this.setState({
          __profileLanguage: {
            value: defaultProfileLanguage.id,
            label: defaultProfileLanguage.full,
          },
        })
      } else {
        this.setState({
          __profileLanguage: {
            value: userLanguage.id,
            label: userLanguage.full,
          },
        })
      }
    }
  }

  getHobbiesOptions() {
    const { hobbiesList } = this.props;
    let options = [];

    forEach(hobbiesList, ({children, hobbies, category}) => {
      if(!category.for_children) {
        if (children) {
          children.forEach(({hobbies}) => {
            options.push(...hobbies.map(({
              id: value,
              name: label,
            }) => ({value, label})));
          });
        } else {
          options.push(...hobbies.map(({
            id: value,
            name: label,
          }) => ({value, label})));
        }
      }
    });

    return options;
  }

  getGendersOptions() {
    const { gendersList } = this.props;

    const male = gendersList.findIndex(i => i.slug === 'male');
    const female = gendersList.findIndex(i => i.slug === 'female');

    gendersList[male].name = 'Barbat';
    gendersList[female].name = 'Femeie';

    return gendersList.map(({
      id: value,
      name: label,
    }) => ({
      value,
      label
    }));
  }

  getFormData() {
    const {
      __firstName: firstName,
      __lastName: lastName,
      __dateOfBirth: dateOfBirth,
      __description: description,
      __phoneNumber,
      __location: location,
      __children,
      __hobbies,
      __region,
      __hobbiesForChildrens,
      __gender,
      __blogLanguages,
      __profileLanguage,
    } = this.state;

    return appendToFormData(
      new FormData(),
      {
        user: {
          firstName,
          lastName,
          description,
          blogLanguages: __blogLanguages.map(({value}) => value),
          language: __profileLanguage.id || __profileLanguage.value,
          dateOfBirth: dateOfBirth.unix(),
          gender: __gender ? __gender.value : null,
          phoneNumber: __phoneNumber || null,
          location: location ? {
            label: location.label,
            longitude: location.longitude,
            latitude: location.latitude
          } : null,
          region: __region ? __region : null,
          children: !!__children.length
          ? __children.map(({dateOfBirth, gender, in_planning}) =>
              ({
                dateOfBirth: dateOfBirth,
                gender: in_planning ? this.props.unisex.id : gender.id,
              })
            )
          : null,
          hobbies: __hobbies.map(({value}) => value),
          hobbiesChildren: !!__children.length
          ? !!__hobbiesForChildrens.length
              ? __hobbiesForChildrens.map(({value}) => value)
              : null
          : null,
        },
        role: 'member',
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
          editMode: false,
        }, () => {
          dispatch(receiveEditUser(data));
          window.scrollTo(0, 0);
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
      errors,
      editMode,
      popupIsOpen,
      childrenHobbiesOptions,
      showChildrenHobbiesSelect,
      __firstName,
      __lastName,
      __description,
      __avatar,
      __dateOfBirth,
      __phoneNumber,
      __children,
      __blogLanguages,
      __profileLanguage,
      __location,
      __gender,
      __hobbies,
      __hobbiesForChildrens,
    } = this.state;

    const {
      profileDetails,
      UIVersion,
      admin,
      demo,
    } = this.props;

    if(editMode) {
      return(
        <Edit
          isMobile={UIVersion === MOBILE_VERSION}
          blogLanguagesList={this.getBlogLanguagesList()}
          hobbiesList={this.getHobbiesOptions()}
          gendersOptions={this.getGendersOptions()}
          onSubmit={this.saveChanges}
          errors={errors}
          hasPassword={!!profileDetails.provider}
          showChildrenHobbiesSelect={showChildrenHobbiesSelect}
          childrenHobbiesOptions={childrenHobbiesOptions}
          popupIsOpen={popupIsOpen}
          __firstName={__firstName}
          __hobbiesForChildrens={__hobbiesForChildrens}
          __lastName={__lastName}
          __description={__description}
          __avatar={__avatar}
          __dateOfBirth={__dateOfBirth}
          __phoneNumber={__phoneNumber}
          __children={__children}
          __blogLanguages={__blogLanguages}
          __profileLanguage={__profileLanguage}
          __location={__location}
          __gender={__gender}
          __hobbies={__hobbies}
          onAvatarChange={([__avatar]) => {
            this.setState({
              __avatar,
            });
          }}

          onDeleteAvatar={() => {
            this.setState({
              __avatar: null,
            });
          }}

          onChildrensChange={__children => {
            this.setState({__children});
            if(!!__children.length){
              this.setState({showChildrenHobbiesSelect: true})
            } else {
              this.setState({
                showChildrenHobbiesSelect: false
              })
            }
          }}
          onHobbiesForChildrensChange={__hobbiesForChildrens => this.setState({__hobbiesForChildrens})}
          onHobbiesChange={__hobbies => this.setState({__hobbies})}
          onGenderChange={__gender => this.setState({__gender})}
          onDateOfBirthChange={__dateOfBirth => this.setState({__dateOfBirth})}
          onPlaceChange={__location => this.setState({
            __location,
            __region: __location.country_init
          })}

          onDescriptionChange={({target: {value: __description}}) => {
            this.setState({__description});
          }}

          onFirstNameChange={({target: {value: __firstName}}) => {
            this.setState({__firstName});
          }}

          onLastNameChange={({target: {value: __lastName}}) => {
            this.setState({__lastName});
          }}

          onBlogLanguagesChange={__blogLanguages => {
            this.setState({__blogLanguages});
          }}

          onPhoneNumberChange={({target: {value: __phoneNumber}}) => {
            this.setState({__phoneNumber})
          }}

          onCancelEdit={() => this.setState({
              editMode: false
            }, () => window.scrollTo(0, 0)
          )
          }
        />
      )
    }

    if(UIVersion === MOBILE_VERSION){
      return (
        <ViewMobile
          switchEditMode={() => this.setState({editMode: true})}
          profileDetails={profileDetails}
          role={profileDetails.roles.filter(data =>
            data.code === 'member' || 'admin'
          )}
        />
      )
    }

    const member = profileDetails.roles.find(role =>  role.code === 'member');
    const adminul = profileDetails.roles.find(role =>  role.code === 'admin');

    return (
      <View
        switchEditMode={() => this.setState({editMode: true})}
        profileDetails={profileDetails}
        role={adminul ? adminul : member}
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
    gendersList: store.genders.list.filter(e => e.slug !== 'unisex'),
    unisex: store.genders.list.find(e => e.slug === 'unisex'),
    blogLanguagesList: store.blogLanguages.list,
    profileLanguagesList: store.languages.list,
  };
}

export default connect(mapStateToProps)(Container);
