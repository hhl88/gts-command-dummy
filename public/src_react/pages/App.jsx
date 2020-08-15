/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, {PropTypes, Component} from 'react';
import withStyles from '../decorators/withStyles';
import Link from '../components/Link';

const styles = css`
#mainApp {
  margin: 0 auto;
  max-width: 1200px;
}

#appBody {
  background-color: lightblue;
}
`;

const PersonComponent = ({name}) => <div>Hi, {name}!</div>;
const IgorComponent = () => <PersonComponent name="Igor"/>;

@withStyles(styles)
class App extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    error: PropTypes.object,
  };

  render() {
    return !this.props.error
      ? (
        <div id="appBody">
          <div id="mainApp" className="container">
            {this.props.children}
            <Link to="/angular"> Hier hier für Angular</Link>
            <PersonComponent name="Niklas"/> and <IgorComponent/>
          </div>
        </div>
      )
      : this.props.children;
  }
}

export default App;
