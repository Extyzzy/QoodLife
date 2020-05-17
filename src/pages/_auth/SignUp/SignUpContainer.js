import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router';
import { appendToFormData } from '../../../helpers/form';
import {
  signUpUser,
  loginUser,
  clearSignUpErrors,
} from '../../../actions/user';
import SignUp from './SignUp';

class SignUpContainer extends Component {
  constructor(props, context) {
    super(props, context);

    const {location} = this.props;
    const data = location.state ? location.state.data : null;

    this.state = {
      ...(data ? {
        __password: null,
        __passwordConfirmation: null,
        __firstName: data.firstName,
        __lastName: data.lastName,
        __email: data.email || null,
        __provider: data.provider,
        __providerId: data.providerId,
        __token: data.token,
        __profileLanguage: null,
      } : {
        __email: '',
        __password: '',
        __passwordConfirmation: '',
        __firstName: null,
        __lastName: null,
        __provider: null,
        __providerId: null,
        __token: null,
      }),
    }

    this.doSignUp = this.doSignUp.bind(this);
  }

  // componentDidMount() {
  //   const {
  //     dispatch,
  //     profileLanguagesList,
  //   } = this.props;
  //
  //   const {
  //     __profileLanguage,
  //   } = this.state;
  //
  //   const browserLang = navigator.language.replace(/-|[A-Z]/g, '') || navigator.userLanguage;
  //   const [defaultProfileLanguage] = profileLanguagesList;
  //
  //   if (!profileLanguagesList || !profileLanguagesList.length) {
  //     dispatch(
  //       fetchLanguages()
  //     );
  //   }
  //
  //   if (defaultProfileLanguage !== undefined && __profileLanguage === null) {
  //     const userLanguage = profileLanguagesList.find(l => l.short === browserLang);
  //
  //     if(!!userLanguage){
  //       this.setState({
  //         __profileLanguage: {
  //           value: defaultProfileLanguage.id,
  //           label: defaultProfileLanguage.full,
  //         },
  //       })
  //     } else {
  //       this.setState({
  //         __profileLanguage: {
  //           value: userLanguage.id,
  //           label: userLanguage.full,
  //         },
  //       })
  //     }
  //   }
  // }
  //
  // componentWillReceiveProps(nextProps) {
  //   const {
  //     profileLanguagesList,
  //   } = nextProps;
  //
  //   const [defaultProfileLanguage] = profileLanguagesList;
  //
  //   if (defaultProfileLanguage !== undefined) {
  //     this.setState({
  //       __profileLanguage: {
  //         value: defaultProfileLanguage.id,
  //         label: defaultProfileLanguage.full,
  //       },
  //     })
  //   }
  // }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(
      clearSignUpErrors()
    );
  }

  getFormData() {
    const {
      __email: email,
      __password: password,
      __passwordConfirmation: password_confirmation,
      __provider: provider,
      __providerId: providerId,
      __token: token,
    } = this.state;

    return appendToFormData(
      new FormData(),
      {
        ...(provider ? {
          provider,
          providerId,
          token,
          email,
          language: 'NKl6GYL2',
        } : {
          email,
          password,
          password_confirmation,
          firstName: null,
          lastName: null,
          language: 'NKl6GYL2',
        }),
      },
      'user'
    );
  }

  doSignUp(e) {
    e.preventDefault();

    const {
      dispatch,
      isFetching,
    } = this.props;

    if (isFetching) {
      return false;
    }

    dispatch(
      signUpUser(
        this.getFormData()
      )
    );
  }

  doSocialLogin(data) {
    const {
      dispatch,
      isFetching,
    } = this.props;

    if (isFetching) {
      return false;
    }

    const {
      provider,
      providerId,
      token,
    } = data;

    dispatch(
      loginUser(
        appendToFormData(
          new FormData(),
          {
            provider,
            providerId,
            token,
          }
        ), () => {
          this.setState({
            __password: null,
            __passwordConfirmation: null,
            __email: data.email || null,
            __provider: data.provider,
            __providerId: data.providerId,
            __token: data.token,
          })
        }
      )
    );
  }

  render() {
    const {
      location,
      isFetching,
      isAuthenticated,
      errors,
      history,
    } = this.props;

    const { from } = location.state || { from: { pathname: '/login' } };

    if (isAuthenticated) {
      return (
        <Redirect to={from}/>
      );
    }

    const {
      __firstName,
      __lastName,
      __email,
      __password,
      __passwordConfirmation,
      __provider,
    } = this.state;

    return (
      <SignUp
        requestLoginWithFacebook={({
           email,
           id: providerId,
           accessToken: token,
         }) => {
          if (providerId) {
            this.doSocialLogin({
              email,
              provider: 'facebook',
              providerId,
              token,
            });
          }
        }}

        requestLoginWithGoogle={({
           El: providerId,
           w3: {
             U3: email,
           },
           Zi: {
             access_token: token,
           },
         }) => {
          if (providerId) {
            this.doSocialLogin({
              email,
              provider: 'google',
              providerId,
              token,
            });
          }
        }}

        isFetching={isFetching}
        logUsingSocial={!!__provider}

        onSubmit={this.doSignUp}
        onCancelSignup={() => {
          history.push('/login', { from: '/signup' })
        }}

        __provider={__provider}
        __email={__email}
        __firstName={__firstName}
        __lastName={__lastName}
        __password={__password}
        __passwordConfirmation={__passwordConfirmation}

        onFirstNameChange={({target: {value: __firstName}}) => {
          this.setState({__firstName});
        }}

        onLastNameChange={({target: {value: __lastName}}) => {
          this.setState({__lastName});
        }}

        onEmailChange={({target: {value: __email}}) => {
          this.setState({__email});
        }}

        onPasswordChange={({target: {value: __password}}) => {
          this.setState({__password});
        }}

        onPasswordConfirmationChange={({target: {value: __passwordConfirmation}}) => {
          this.setState({__passwordConfirmation});
        }}

        errors={errors}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.auth.signUpIsFetching,
    isAuthenticated: state.auth.isAuthenticated,
    errors: state.auth.signUpErrors,
    profileLanguagesList: state.languages.list,
  };
}

export default withRouter(connect(mapStateToProps)(SignUpContainer));
