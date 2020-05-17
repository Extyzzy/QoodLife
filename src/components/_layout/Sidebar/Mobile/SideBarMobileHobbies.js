import React  from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { SIDEBAR_GROUP_ALL, SIDEBAR_GROUP_RELATED } from '../../../../actions/navigation';
import {FaClose} from "react-icons/lib/fa/index";
import {I18n} from 'react-redux-i18n';
import classes from 'classnames';
import Group from '../Group';
import s from './SidebarMobile.scss';

const SideBar = ({
   showCloseButton,
   userHobbies,
   hobbies,
   isAuthenticated,
   viewSwitchMode,
   sideBar,
   showSideBar,
}) => (
   <div className={s.root}>
     <div className={
       classes({
         [s.backgroundShadow]: showSideBar,
       })
     }
     onClick={sideBar}
     />

     <div className={
       classes(s.containnerCategory, {
         [s.showSideBar]: showSideBar,
       })
     }>
       <div className={s.buttonsCategory}>
        {
          isAuthenticated  && (
           <Group
            name={SIDEBAR_GROUP_RELATED}
            title={I18n.t('general.sidebar.myHobbies')}
            list={userHobbies}
            sideBar={sideBar}
          />
          )
        }
        <Group
          name={SIDEBAR_GROUP_ALL}
          title={I18n.t('general.sidebar.allHobbies')}
          list={hobbies}
          sideBar={sideBar}
        />
       </div>

       <div className={s.containerCloseButton}>
         <div className={s.closeButton} onClick={sideBar}>
           <FaClose className={s.icon} size={20}/>
         </div>
       </div>

     </div>

     {
       showCloseButton && (
         <div className={s.swith}>
           <div className={s.containerButton} onClick={sideBar}>
             <div className={s.button}>
               Hobbies
             </div>
           </div>
           {viewSwitchMode}
         </div>
       )
     }
   </div>
);

export { SideBar as SideBarWithoutStyles };
export default withStyles(s)(SideBar);
