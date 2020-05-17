import React, { Component } from 'react';
import Settings from './Settings';
import {
  InternalServerError,
  UnprocessableEntity
} from '../../../exceptions/http';
import { fetchAuthorizedApiRequest } from '../../../fetch';
import { fetchGenders } from '../../../actions/genders';
import { fetchBlogLanguages } from '../../../actions/blogLanguages';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { I18n } from 'react-redux-i18n';
import { appendToFormData } from '../../../helpers/form';
import config from '../../../../src/config';

class SettingsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    const {
      user,
      user: { language, roles }
    } = this.props;

    let rolesHide = [];

    if (user.hide) {
      rolesHide.push({
        id: user.id,
        name: I18n.t('general.header.member'),
        code: 'member'
      });
    }

    if (user.profDetails && user.profDetails.hide) {
      rolesHide.push({
        id: user.profDetails.id,
        name: I18n.t('general.header.professionals'),
        code: 'professional'
      });
    }

    if (user.placeDetails && user.placeDetails.hide) {
      rolesHide.push({
        id: user.placeDetails.id,
        name: I18n.t('general.header.place'),
        code: 'place'
      });
    }

    const role =
      user.roles[0].code === 'admin'
        ? {
            id: user.id,
            name: user.default
          }
        : roles.find(data => data.code === user.default);

    this.state = {
      accountIsActivated: user.status,
      popupIsOpen: false,
      __canInviteUsers: false,
      language: {
        value: language.id,
        label: language.full
      },
      role: rolesHide
        ? rolesHide.map(({ id, code, name }) => ({
            value: id,
            code,
            label: `${I18n.t('settings.profile.hide') + name}`
          }))
        : null,
      defaultProfile: {
        value: role.id,
        label: role.name,
        code: role.code
      }
    };

    this.getPowerToPros = this.getPowerToPros.bind(this);
    this.submitFormData = this.submitFormData.bind(this);
  }

  componentDidMount() {
    const { dispatch, blogLanguagesList, gendersList } = this.props;

    if (!blogLanguagesList || !blogLanguagesList.length) {
      dispatch(fetchBlogLanguages());
    }

    if (!gendersList || !gendersList.length) {
      dispatch(fetchGenders());
    }
  }

  getPowerToPros() {
    const { accessToken, dispatch } = this.props;

    this.fetchProfessionalsList = dispatch(
      fetchAuthorizedApiRequest(`/v1/professionals/give-me-the-power`, {
        method: 'Post',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    );

    this.fetchProfessionalsList
      .then(response => {
        switch (response.status) {
          case 200:
            return response.json();

          default:
            return Promise.reject(new InternalServerError());
        }
      })
      .then(() => {
        this.setState({
          __canInviteUsers: true
        });

        return Promise.resolve();
      });
  }

  optionsLanguages() {
    const { languages } = this.props;

    let options = [];

    options.push(
      ...languages.map(({ id: value, full: label }) => ({
        value,
        label
      }))
    );

    return options;
  }

  optionsRoles() {
    const {
      user: { roles }
    } = this.props;

    const { defaultProfile } = this.state;

    let filtred = roles.filter(data => data.id !== defaultProfile.value);

    let rolesOptions = [];

    rolesOptions.push(
      ...filtred.map(({ id: value, name: label, code }) => ({
        value,
        label: `${I18n.t('settings.profile.hide') + label}`,
        code
      }))
    );

    return rolesOptions;
  }

  optionsDefaultProfile() {
    const {
      user: { roles }
    } = this.props;

    let rolesOptions = [];

    rolesOptions.push(
      ...roles.map(({ id: value, name: label, code }) => ({
        value,
        code,
        label: label
      }))
    );

    return rolesOptions;
  }

  getFormData() {
    const {
      language: __language,
      role: __role,
      defaultProfile: __defaultProfile
    } = this.state;

    const { user } = this.props;

    return appendToFormData(new FormData(), {
      user: {
        language: __language.value,
        default:
          user.roles[0].code === 'admin' ? 'member' : __defaultProfile.code,
        hide: __role.length ? __role.map(({ code }) => code) : []
      },
      _method: 'PUT'
    });
  }

  submitFormData() {
    const { dispatch, accessToken } = this.props;

    this.submitFormDataFetcher = dispatch(
      fetchAuthorizedApiRequest('/v1/account/settings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: this.getFormData()
      })
    );

    this.submitFormDataFetcher
      .then(response => {
        switch (response.status) {
          case 200:
            return response.json();

          case 422:
            return response.json().then(({ errors }) => {
              this.setState({ errors });

              return Promise.reject(new UnprocessableEntity());
            });
          default:
            return Promise.reject(new InternalServerError());
        }
      })
      .then(() => {
        window.location.reload();
      });
  }

  deactivateProfile = () => {
    const { dispatch, accessToken } = this.props;
    const { accountIsActivated } = this.state;

    if (
      window.confirm(I18n.t('profile.editProfile.profileDetails.deactivateWarning'))
    ) {
      dispatch(
        fetchAuthorizedApiRequest('/v1/account/deactivate', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
      );
      this.setState({ accountIsActivated: !accountIsActivated });
    } else {
      return false;
    }
  };

  reactivateProfile = () => {
    const { dispatch, accessToken } = this.props;
    const { accountIsActivated } = this.state;

    if (
      window.confirm(I18n.t('profile.editProfile.profileDetails.reactivateWarning'))
    ) {
      dispatch(
        fetchAuthorizedApiRequest('/v1/account/reactivate', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
      );
      this.setState({ accountIsActivated: !accountIsActivated });
    } else {
      return false;
    }
  };

  deleteProfile = () => {
    const { dispatch, accessToken } = this.props;

    if (
      window.confirm(I18n.t('profile.editProfile.profileDetails.deleteWarning'))
    ) {
      dispatch(
        fetchAuthorizedApiRequest('/v1/account/delete', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
      );
      localStorage.clear();
      window.location.href = '/';
    } else {
      return false;
    }
  };

  render() {
    const { user, location } = this.props;

    const {
      popupIsOpen,
      language,
      role,
      defaultProfile,
      accountIsActivated
    } = this.state;

    const canHaveGetPowerButton = user.roles.find(
      r => !r.canInviteMember && r.code === 'professional'
    );

    return (
      <Settings
        apiUrl={config.apiUrl}
        accountIsActivated={accountIsActivated}
        onSubmit={this.submitFormData}
        optionsLanguages={this.optionsLanguages()}
        optionsRoles={this.optionsRoles()}
        user={user}
        open={location.state ? location.state.data : null}
        popupIsOpen={popupIsOpen}
        getPowerToPros={this.getPowerToPros}
        showGetPowerButton={canHaveGetPowerButton}
        switchPasswordPopup={() => this.setState({ popupIsOpen: !popupIsOpen })}
        language={language}
        role={role}
        onDeactivateProfile={this.deactivateProfile}
        onReactivateProfile={this.reactivateProfile}
        onDeleteProfile={this.deleteProfile}
        defaultProfile={defaultProfile}
        optionsDefaultProfile={this.optionsDefaultProfile()}
        onLanguageChange={language => this.setState({ language })}
        onRoleChange={role => this.setState({ role })}
        onDefaultProfileChange={defaultProfile =>
          this.setState(
            {
              defaultProfile,
              role: []
            },
            () => this.optionsRoles()
          )
        }
      />
    );
  }
}

function mapStateToProps(store) {
  return {
    accessToken: store.auth.accessToken,
    user: store.user,
    languages: store.languages.list
  };
}

export default withRouter(connect(mapStateToProps)(SettingsContainer));
