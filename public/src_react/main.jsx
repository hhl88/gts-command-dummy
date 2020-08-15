/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

// things for bootstrap
import 'jquery';
import 'bootstrap';

// we use a theme manager for bootstrap
import 'bootswatch/united/bootstrap.css';

import '!style!css!sass!./main.sass';

import factory from '../src_ng/lib/factory';

import React from 'react';
import App from './pages/App';
import Index from './pages/Index';

import NotFoundPage from './pages/NotFoundPage';
import ErrorPage from './pages/ErrorPage';

import {Router, Route, browserHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';

// Declarative route configuration (could also load this config lazily
// instead, all you really need is a single root route, you don't need to
// colocate the entire config).
render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Index}/>
    </Route>
  </Router>
  ), document.getElementById('app'));
