import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Layout from '../../../components/_layout/Layout/Layout';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './help.scss';
import {I18n} from "react-redux-i18n";
import Question from '../components/questions/Question';
import Vimeo from 'react-vimeo';
import connect from "react-redux/es/connect/connect";
import { MOBILE_VERSION } from '../../../actions/app';

class Help extends Component {

  render() {
    const {
      UIVersion
    } = this.props;

    return (
      <Layout>
        <div className={s.root}>
          <div className={UIVersion ===  MOBILE_VERSION ? s.mobile : s.name}>
            <h1>{I18n.t('help.questions')}</h1></div>
          <Question
            response={{
              title: I18n.t('help.whatIs'),
              content: (
                <div>
                  <p className={s.paragraph}>
                    {I18n.t('help.whatIsResponse')}
                  </p>

                  <ul style={UIVersion !==  MOBILE_VERSION ? {marginLeft: 120} : null}>
                    <li>{I18n.t('help.whatIsResponseEvents')}</li>
                    <li>{I18n.t('help.whatIsResponseGroups')}</li>
                    <li>{I18n.t('help.whatIsResponseProf')}</li>
                    <li>{I18n.t('help.whatIsResponsePlaces')}</li>
                    <li>{I18n.t('help.whatIsResponseProduse')}</li>
                    <li>{I18n.t('help.whatIsResponseArticole')}</li>
                    <li>{I18n.t('help.whatIsResponseAudience')}</li>
                  </ul>

                  <p className={s.paragraph}>{I18n.t('help.whatIsResponseFooter')}</p>
                </div>
              ),
            }}
          />

          <Question
            response={{
              title: I18n.t('help.who'),
              content: (
                <div>
                  <p className={s.paragraph}>
                    {I18n.t('help.whoDescription')}
                  </p>

                  <ul style={UIVersion !==  MOBILE_VERSION ? {marginLeft: 120} : null}>
                    <li>{I18n.t('help.whoUsers')}</li>
                    <li>{I18n.t('help.whoPersons')}</li>
                    <li>{I18n.t('help.whoParents')}</li>
                    <li>{I18n.t('help.whoProf')}</li>
                    <li>{I18n.t('help.whoOrg')}</li>
                  </ul>
                </div>
              ),
            }}
          />

          <Question
            response={{
              title: I18n.t('help.member'),
              content: (
                <div>
                  <p className={s.paragraph}>
                    {I18n.t('help.memberDescription')}
                  </p>
                </div>
              ),
            }}
          />

          <Question
            response={{
              title: I18n.t('help.prof'),
              content: (
                <div>
                  <p className={s.paragraph}>
                    {I18n.t('help.profDescription')}
                  </p>
                </div>
              ),
            }}
          />

          <Question
            response={{
              title: I18n.t('help.profNew'),
              content: (
                <div>
                  <p className={s.paragraph}>
                    {I18n.t('help.profD')}
                  </p>
                  <Vimeo
                    autoplay={true}
                    className={s.video}
                    videoId={303053590}
                  />
                </div>
              ),
            }}
          />

          <Question
            response={{
              title: I18n.t('help.place'),
              content: (
                <div>
                  <p className={s.paragraph}>
                    {I18n.t('help.placeDescription')}
                  </p>
                </div>
              ),
            }}
          />

          <Question
            response={{
              title: I18n.t('help.placeNew'),
              content: (
                <div>
                  <p className={s.paragraph}>
                    {I18n.t('help.placeNewDescription')}
                  </p>
                  <Vimeo
                    autoplay={true}
                    className={s.video}
                    videoId={303051449}
                  />
                </div>
              ),
            }}
          />

          <Question
            response={{
              title: I18n.t('help.events'),
              content: (
                <div>
                  <p className={s.paragraph}>
                    {I18n.t('help.eventsD')}
                  </p>
                </div>
              ),
            }}
          />

          <Question
            response={{
              title: I18n.t('help.images'),
              content: (
                <div>
                  <p className={s.paragraph}>
                    {I18n.t('help.imagesD')}
                  </p>
                </div>
              ),
            }}
          />

          <Question
            response={{
              title: I18n.t('help.public'),
              content: (
                <div>
                  <p className={s.paragraph}>
                    {I18n.t('help.publicD')}
                  </p>
                </div>
              ),
            }}
          />

          <Question
            response={{
              title: I18n.t('help.publicNon'),
              content: (
                <div>
                  <p className={s.paragraph}>
                    {I18n.t('help.publicNonD')}
                  </p>
                </div>
              ),
            }}
          />

          <Question
            response={{
              title: I18n.t('help.gest'),
              content: (
                <div>
                  <p className={s.paragraph}>
                    {I18n.t('help.gestDFirst')}
                    <strong>{I18n.t('help.gestBold')}</strong>
                    {I18n.t('help.gestDSecound')}
                  </p>
                </div>
              ),
            }}
          />

          <Question
            response={{
              title: I18n.t('help.children'),
              content: (
                <div>
                  <p className={s.paragraph}>
                    {I18n.t('help.childrenD')}
                    <strong>{I18n.t('help.childrenDProfile')}</strong>.
                  </p>
                </div>
              ),
            }}
          />

          <Question
            response={{
              title: I18n.t('help.hobby'),
              content: (
                <div>
                  <p className={s.paragraph}>
                    {I18n.t('help.hobbyD')}
                  </p>
                </div>
              ),
            }}
          />

          <Question
            response={{
              title: I18n.t('help.dvs'),
              content: (
                <div>
                  <p className={s.paragraph}>
                    {I18n.t('help.dvsD')}
                  </p>
                </div>
              ),
            }}
          />
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(store) {
  return {
    UIVersion: store.app.UIVersion,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(Help)));
