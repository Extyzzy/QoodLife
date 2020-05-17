import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Layout from '../../../components/_layout/Layout/Layout';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './policies.scss';

class About extends Component {
  render() {
    return (
      <Layout
        contentHasBackground
      >
        <div className={s.root}>
          <h1>MISIUNE</h1>
          Portalul a fost gândit sa deschidă noi orizonturi, care să schimbe percepția generală despre calitatea vieții. În același timp, platforma îi ajută pe adepții unui mod sănătos și activ de viața să-și diversifice activitățile.<strong> qood.life </strong> oferă informații actualizate despre diferite evenimente, localuri, servicii, produse, activități și pasiuni.
          <br />
          <br />
          Astăzi, mai mult ca niciodată, cautăm informații cu caracter recreațional și spiritual, de reinventare personală, de cultivare a obiceiurilor sănătoase sau de relaționare calitativă cu oamenii.
          <br />
          <br />
          Platforma <strong> qood.life </strong>  este un produs complex, colorat și interactiv, cu variate posibilități de satisfacere a nevoilor și intereselor utilizatorilor.

          <br />
          <br />
          <span>Traieste-ti viata cu pasiune !</span>
        </div>
      </Layout>
    );
  }
}

export default withRouter(withStyles(s)(About));
