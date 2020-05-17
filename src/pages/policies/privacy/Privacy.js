import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import Layout from '../../../components/_layout/Layout/Layout';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './privacy.scss';
import { connect } from 'react-redux';
import { MOBILE_VERSION } from '../../../actions/app';

class Privacy extends Component {
  render() {
    const {history,UIVersion} = this.props;


    return (
      <Layout
        contentHasBackground
      >
        <div className={s.root}>
          <ul className="breadcrumb">
            <li>
              <span className="text-muted">
                <Link to="/policies/">
                  {I18n.t('general.policies.policies')}
                </Link>
              </span>
            </li>
            <li className="active">
              {I18n.t('general.policies.privacy')}
            </li>
          </ul>
            <h1>Introduction</h1>
            <p>
              The QOOD is committed to Member privacy.
              <hr />
              The QOOD is a social networking platform, which enables Members, Professional Members and Businesses to join and create networks.
              <hr />
              Subject to your pre-selected choices, we show you personalized content (e.g. events, places, services, products, activities) we think you will be interested in based on information we collect from you and third parties. We only use that information where we have a proper legal basis for doing so.
              <hr />
              This Privacy Policy applies to QOOD, communications and Services (“Services”).
              <hr />
              We offer our Members choices about the data we process as described in this Privacy Policy, Settings and Help Desk. Personal data on some of our Services is viewable to non-members (“Visitors”), subject to conditions detailed in this Privacy Policy and Settings.
              <hr />
              QOOD LIMITED will be the controller of your personal data processed in connection with our Services. In your capacity as a Visitor or Member of our Services, processing of your personal data is subject to this Privacy Policy and updates.
              <hr />
              QOOD can update this Privacy Policy. We will provide system notice the opportunity to review the changes before they become effective through our Services. If you object to any amendments, you may close your account. You acknowledge that your continued use of our Services after we publish or send a notice about our changes to this Privacy Policy means that the processing of your personal data is subject to the amended Privacy Policy.
            </p>



            <h2>1. Information we process</h2>
                <div className={s.subContent}>
                  <h3>1.1  Information you provide to us</h3>
                  <p>
                    QOOD processes your personal data only to the extent necessary to fulfil a precise purpose related to our Services. The types of personal data we process depends on how our Services is used.
                    <hr />
                    To register an account, you give us data voluntarily, including your e-mail address and password.
                    If you register for a professional Member Service, you give us e-mail and password.
                    <hr/>
                    You create your own profile. You have choices about the data you include on you profile, such as your pseudonym, photo, city, country, date of birth, gender, number of children, hobbies.
                    <hr/>
                    Please do not post or add postings, stories to your profile that you would not want to be publicly available.
                    <hr/>
                    You may choose to complete a professional profile. In this case, you may choose to give us additional information on your profile like e-mail address, year of birth, work experience, skills, short description. Mandatory fields for professional profile, nevertheless, are the name and surname, education, foto, professional activity.
                    <hr/>
                    We process personal data from you when you provide, post or upload it to our Services. Your ability to engage with your network over our Services will depend on the personal data you upload.
                    <hr/>
                    Profile information helps you to get more from our Services.
                  </p>

                  <h3>1.2  Service use</h3>
                  <p>We log usage data when you visit or otherwise use our Services.
                    We use log-ins, cookies and internet protocol (“IP”) addresses to identify you and log your use (subject to your settings).
                  </p>

                  <h3>1.3 Cookies</h3>
                  We use cookies and similar technologies to recognize you and/or your device on, off and across different Services and devices. We also allow some third parties to use cookies. You can control cookies through your browser settings and other tools. You can also opt-out from our use of cookies and similar technologies that track your behavior on the sites of others for third party advertising. For Visitors, the opt-out is <span className={s.logout} onClick={() => { history.push('/logout'); localStorage.setItem('POLICY', 'false');}}>here</span>.
                  <hr />
                  {
                    (UIVersion === MOBILE_VERSION &&(
                      <div>
                      <p>Google Analytics - Google Analytics is a tool that helps Qood measure how users interact with website content.</p>
                      <a target="_blank" rel="noopener noreferrer" href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage">
                        Click here for read more about Google Analytics
                      </a>
                        <p>Google Authentication - Cookie-based authentication scenarios:</p>
                        <a target="_blank" rel="noopener noreferrer" href="https://support.google.com/gsa/answer/6329217?hl=en">
                          Click here for read more about Google Authentication
                        </a>
                        <p>Stripe - Online payment transactions tool: </p> <a target="_blank" rel="noopener noreferrer"
                                                                          href="https://stripe.com/cookies-policy/legal">
                        Click here for read more about Stripe
                        </a>
                        <p>Access Token in Local Storage - When registering or signing up, cookies may be saved in the local storage for 30 days.</p>
                      </div>
                    )) || (
                      <table>
                        <tr>
                          <th>Tool</th>
                          <th>Description</th>
                        </tr>
                        <tr>
                          <td>Google Analytics</td>
                          <td>Google Analytics is a tool that helps Qood measure how users interact with website content. <br />
                            <a target="_blank" rel="noopener noreferrer" href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage">
                              https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td>Google Authentication</td>
                          <td>Cookie-based authentication scenarios:
                            <a target="_blank" rel="noopener noreferrer" href="https://support.google.com/gsa/answer/6329217?hl=en">
                              https://support.google.com/gsa/answer/6329217?hl=en
                            </a>

                          </td>
                        </tr>
                        <tr>
                          <td>Stripe</td>
                          <td>Online payment transactions tool:  <a target="_blank" rel="noopener noreferrer"
                                                                    href="https://stripe.com/cookies-policy/legal">
                            https://stripe.com/cookies-policy/legal
                          </a></td>
                        </tr>
                        <tr>
                          <td>Access Token in Local Storage</td>
                          <td>When registering or signing up, cookies may be saved in the local storage for 30 days. </td>
                        </tr>
                      </table>
                    )
                  }
                  <h3>1.4 Your device and location</h3>
                  <p>
                    When you visit or leave our Services (including our plugins or cookies or similar technology on the sites of others), the service receives the URL of both the site you came from and the one you go to next. We also get information about your IP address, web browser, and/or ISP or your mobile carrier (subject to your settings).
                    <hr/>
                    If you use our Services from a mobile device, that device will send us data about your location based on your phone settings. We will ask you to opt-in before we use GPS or other tools to identify your precise location.
                  </p>
                  <h3>1.5 Other</h3>
                  <p>Our Services are dynamic, and we often introduce new features, which may require the processing of new information. We will notify you and may also modify this Privacy Policy should that be the case. </p>
                </div>

          <h2>2. How we process your data</h2>
          <div className={s.subContent}>
          <p>
            How we use your personal data will depend on how you use our Services and the choices you make in your default settings.
            <hr/>
            We also process data that we have about you to provide and personalize our Services.
          </p>
            <h3>2.1 Services</h3>
            <p>
              Our Services allow you to stay in touch and up to date with products and services offered by Professional Members and Business relevant to your interests. You will “connect” with Members whom you choose.
              <hr/>
              We process data to identify you when you use our service.
              <hr/>
              You can also opt-in to allow us to use your precise location for specific tasks.
              <hr/>
              Our Services allows you to stay informed about events, places, services, products, activities of interest to you based on your activity on QOOD and interests you preselect.
              <hr/>
              Our Service allows you to learn about actual events, places, services, products, activities and hobbies (subject to your settings).
            </p>
            <h2>2.2 Communications</h2>
            <p>
              We will contact you through notices through our Services. We will send you messages about the availability of our Services, security, or other service-related issues. We also send messages about how to use the Services, network updates, reminders. Please be aware that you cannot opt-out of receiving service information from us, including security and legal notices.
              <hr/>
              We also enable communications between you and others through our Services, including for example and messages between Members. You may change your communication preferences at any time.
              <hr/>
              Please note that we may still send you updates about your account, such as when another Member comments on one of your post.
            </p>
            <h3>2.3 Use of data</h3>
            <p>Data and content about Members are used for invitations and communications promoting membership and network growth, engagement and our Services.</p>
            <h3>2.4 Developing services </h3>
            <p>
              We use data to further development of our Services in order to provide you and others with a better, more intuitive and personalized experience, drive membership growth and engagement on our Services, and help connect members to each other and to economic opportunity.
            </p>
            <h3>2.5 Customer support</h3>
            <p>
              We use the data to investigate, respond to and resolve complaints and Service matters.
            </p>
            <h3>2.6 Security and investigations</h3>
            <p>We use your data (including your communications) if we think it’s necessary for security purposes or to investigate possible fraud or this Privacy Policy and/or attempts to harm our Members or Visitors.</p>
          </div>

          <h2>3. How we share information </h2>
          <div className={s.subContent}>
            <h3>3.1 Our services</h3>
            <p>
              Your profile is fully visible to all Members of our Services. Subject to your settings, it can also be visible to others on or off of our Services (e.g., Visitors to our Services or Member of third- party search engines). Your settings, their usage of our Services, impact the availability of your profile and whether they can view certain fields in your profile.
            </p>

            <hr/>
            <p>
              Our Services allow viewing and sharing information, including through posts, comments and messages.
            </p>
            <ul>
              <li>When you share a post publicly it can be viewed by everyone and re-shared anywhere (subject to your settings). Members and Visitors will be able to find and see your publicly-shared content, including your name (and photo if you have provided one).</li>
              <li>When you comment on another’s content, others will be able to view your profile these actions and associate it with you.</li>
            </ul>

            <h3>3.2 Service providers</h3>
            <p>Our Services (e.g., maintenance, audit, payments, fraud detection, development) may be provided by other service providers. They will have access to your information as reasonably necessary to perform these tasks on our behalf and are obligated not to disclose or use it for other purposes.</p>

            <h3>3.3 Legal disclosure</h3>
            <p>
              It is possible that we will need to disclose information about you when required by law and only if we have a good faith belief that disclosure is reasonably necessary to (1) investigate, prevent, or take action regarding suspected or actual illegal activities or to assist law enforcement bodies; (2) enforce our agreements with you, (3) investigate and defend ourselves against any third-party claims or allegations, (4) protect the security or integrity of our Service; or (5) exercise or protect the rights and safety of QOOD, our Members, personnel, or others. We attempt to notify Members about legal demands for their personal data when appropriate in our judgment, unless prohibited by law or court order or when the request is an emergency. We may dispute such demands when we believe, in our discretion, that the requests are overbroad, vague or lack proper authority.
            </p>

            <h3>3.4 Change in control</h3>
            <p>
              We can share your personal data as part of a sale, merger or change in control, or in preparation for any of these events. Any other entity which buys the Service will have the right to continue to use your data, but only in the manner set out in the legal framework unless you agree otherwise.
            </p>
          </div>

          <h2>4. Your choices and obligations</h2>
          <div className={s.subContent}>
            <h3>4.1 Data retention </h3>
            <p>
              We retain your personal data while your account is in existence or as needed to provide you Services. This includes data you or others provided to us and data generated or inferred from your use of our Services. We will retain your information and keep your profile open until you decide to close your account. Then we will retain your personal data in an anonymised or aggregated form.
            </p>

            <p>
              We will delete your account as soon as either the Member or the Service decides to delete the account. Information deleted by a Member, when updating his account, will not be retained. In specific cases, however, for security and legal reasons, we may store updated or deleted data and accounts for a specific period of time in order to help prevent malicious operations resulting from offences or crimes.
            </p>

            <h3>4.2 Rights</h3>
            <p>
              We provide choices about the processing, from deleting or correcting data you include in your profile and controlling the visibility of your posts to communication controls. We offer you settings to control and manage the personal data we have about you.
            </p>

            <p>For personal data that we have about you:</p>
            <ul>
              <li>You can ask us to delete all or some of your personal data (e.g., if it is no longer necessary to provide Services to you).</li>
              <li>You can edit some of your personal data through your account. You can also ask us to change, update or fix your data in certain cases, particularly if it’s inaccurate.</li>
              <li>You can ask us to stop using all or some of your personal data (e.g., if we have no legal right to keep using it) or to limit our use of it (e.g., if your personal data is inaccurate or unlawfully held).</li>
              <li>You have the right to know whether we are processing your personal data. </li>
              <li>You have the right to be told about the collection and use of the personal data you provide. This privacy policy sets out the purpose for which we process your personal data, how long we will keep your data, who we will share your data with.</li>
            </ul>

            <h3>4.3 Account closure</h3>
            <p>
              If you choose to close your QOOD account, your personal data will generally stop being visible to others on our Services within 24 hours. We generally delete closed account information within 14 days of account closure, except as noted this Privacy Policy.
              We retain your personal data even after you have closed your account if reasonably necessary to comply with our legal obligations (including law enforcement requests), meet regulatory requirements, resolve disputes, maintain security, prevent illegal activities or fulfill your request to “unsubscribe” from further messages from us. We will retain anonymised information after your account has been closed.
              <hr/>
              Information you have shared with others (e.g., group posts) will remain visible after you closed your account or deleted the information from your own profile. Your profile may continue to be displayed in the services of others (e.g., search engine results) until they refresh their cache.
            </p>
          </div>

          <h2>5. Other information</h2>
          <div className={s.subContent}>
            <h3>5.1 Security</h3>
            <p>
              We implement security safeguards designed to protect your data, such as HTTPS. We regularly monitor our systems for possible vulnerabilities and attacks and try to prevent security breaches.
            </p>

            <h3>5.2 Cross border data transfer</h3>
            <p>
              We process data both inside and outside of the European Union Member States and rely on legally-provided mechanisms to lawfully transfer data across borders. By using our services, you authorize us to transfer and store your information outside your home country.
            </p>

            <h3>5.3 Lawful base for processing </h3>
            <p>
              We will only process personal data about you where we have lawful bases. Lawful bases include consent and “legitimate interests”.
              <hr/>
              Where we rely on your consent to process personal data, you have the right to withdraw or decline your consent at any time. If you have any questions about the lawful bases upon which we process and use your personal data, please contact us: <strong>privacy@qood.life</strong>
            </p>
            <h3>5.4 Direct marketing and do not track signals</h3>
            <p>
              We currently do not share personal data with third parties for their direct marketing purposes without your consent.
            </p>
            <h3>5.5 Contact information</h3>
            <p>If you have questions or complaints regarding this Policy, please first contact:</p>
            <strong>QOOD LIMITED</strong><br/>
            <strong>14a Mary Rose Mall,</strong><br/>
            <strong>London, United Kingdom,</strong><br/>
            <strong>E6 5LX</strong><br/>
            <strong>Email: privacy@qood.life</strong><br/>
            <hr/>
            <p>
              Thank you for using QOOD!
              <hr/>
              Last updated: January 18, 2019
            </p>
          </div>
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    UIVersion: state.app.UIVersion,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(Privacy)));
