// import React, { Component } from "react";
// import ReactDOM from 'react-dom';
// import {I18n} from 'react-redux-i18n';
// import classes from 'classnames';
// import { withRouter } from 'react-router';
// import { connect } from 'react-redux';
// import withStyles from 'isomorphic-style-loader/lib/withStyles';
// import s from './Create.scss';
// import Layout from '../../../components/_layout/Layout/Layout';
// import {actionIsAllowed} from "../../../helpers/permissions";
// import Forbidden from '../../_errors/Forbidden/Forbidden';
//
// class Create extends Component {
//   constructor(props, context) {
//     super(props, context);
//
//     this.state = {
//       isFetching: false,
//     };
//
//     this.goBackTogGroups = this.goBackTogGroups.bind(this);
//   }
//
//   goBackTogGroups() {
//     const {
//       history,
//     } = this.props;
//
//   return (
//     history.push(`/profile/groups`)
//     )
//   }
//
//   render() {
//     const { permissions } = this.props;
//     const { isFetching } = this.state;
//
//     if ( ! actionIsAllowed(permissions, {
//         module: 'groups',
//         action: 'create',
//       })) {
//       return <Forbidden />;
//     }
//
//     return (
//       <Layout
//         hasSidebar
//         whichSidebar='My Profile'
//         contentHasBackground
//       >
//         <div className={s.root}>
//           <div className={s.title}>
//             <h4>{I18n.t('groups.addGroupButton')}</h4>
//           </div>
//
//           <div className={s.button}>
//             <button
//               className={classes('btn btn-red', {
//                 [s.disabled]: isFetching
//               })}
//               onClick={() => {
//                 if (this.createGroupForm) {
//                   ReactDOM
//                     .findDOMNode(this.createGroupForm)
//                     .dispatchEvent(new Event('submit'));
//                 }
//               }}
//               disabled={isFetching}
//             >
//               {I18n.t('general.elements.submit')}
//             </button>
//             <button
//               className={classes('btn btn-default', {
//                 [s.disabled]: isFetching
//               })}
//               onClick={this.goBackTogGroups}
//               disabled={isFetching}
//             >
//               {I18n.t('general.elements.cancel')}
//             </button>
//           </div>
//
//         </div>
//       </Layout>
//     );
//   }
// }
//
// function mapStateToProps(state) {
//   return {
//     permissions: state.user.permissions,
//   };
// }
//
// export default withRouter(connect(mapStateToProps)(withStyles(s)(Create)));
