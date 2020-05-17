import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import FastClick from 'fastclick';
import history from './history';
import App from './components/App';
import configureStore from './store/configureStore';
import { syncTranslationWithStore } from 'react-redux-i18n';
import theme from './styles/theme.scss';

// eslint-disable-next-line no-underscore-dangle
theme._insertCss();

// Global (context) variables that can be easily accessed from any React component
// https://facebook.github.io/react/docs/context.html
const context = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: (...styles) => {
    // eslint-disable-next-line no-underscore-dangle
    const removeCss = styles.map(x => x._insertCss());
    return () => { removeCss.forEach(f => f()); };
  },
  // Initialize a new Redux store
  // http://redux.js.org/docs/basics/UsageWithReact.html
  store: configureStore(window.Store, { history }),
  storeSubscription: null,
};

syncTranslationWithStore(context.store);

// Switch off the native scroll restoration behavior and handle it manually
// https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
const scrollPositionsHistory = {};
if (window.history && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

let onRenderComplete = function initialRenderComplete() {
  const elem = document.getElementById('css');
  if (elem) elem.parentNode.removeChild(elem);

  // This method updates scroll position and handles google analytics
  onRenderComplete = function renderComplete(location) {
    let scrollX = 0;
    let scrollY = 0;
    const pos = scrollPositionsHistory[location.key];

    if (pos) {
      scrollX = pos.scrollX;
      scrollY = pos.scrollY;
    }
    else {
      const targetHash = location.hash.substr(1);

      if (targetHash) {
        const target = document.getElementById(targetHash);

        if (target) {
          scrollY = window.pageYOffset + target.getBoundingClientRect().top;
        }
      }
    }

    // Restore the scroll position if it was saved into the state
    // or scroll to the given #hash anchor
    // or scroll to top of the page
    window.scrollTo(scrollX, scrollY);

  };
};

// Make taps on links and buttons work fast on mobiles
FastClick.attach(document.body);

let currentLocation = history.location;

// Re-render the app when window.location changes
async function onLocationChange(location, action) {
  // Remember the latest scroll position for the previous location
  scrollPositionsHistory[currentLocation.key] = {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset,
  };

  // Delete stored scroll position for next page if any
  if (action === 'PUSH') {
    delete scrollPositionsHistory[location.key];
  }

  currentLocation = location;

  try {
    // Prevent multiple page renders during the routing process
    if (currentLocation.key !== location.key) {
      return;
    }

    const container = document.getElementById('app');

    ReactDOM.render(
      <Router history={history} >
        <App store={context.store} context={context} />
      </Router>,
      container,
      () => onRenderComplete(location),
    );
  } catch (error) {
    console.error(error);

    // Do a full page reload if _errors occurs during client-side navigation
    if (action && currentLocation.key === location.key) {
      window.location.reload();
    }
  }
}

// Handle client-side navigation by using HTML5 History API
// For more information visit https://github.com/mjackson/history#readme
history.listen(onLocationChange);
onLocationChange(currentLocation);
