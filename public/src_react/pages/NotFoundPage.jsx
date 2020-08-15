/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, {Component } from 'react';
import withStyles from '../decorators/withStyles';

const styles = `
/* React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

`;

@withStyles(styles)
class NotFoundPage extends Component {

  render() {
    const title = 'Page Not Found';
    return (
      <div id="idid">
        <h1>{title}</h1>
        <p>Sorry, but the page you were trying to view does not exist.</p>
      </div>
    );
  }

}

export default NotFoundPage;
