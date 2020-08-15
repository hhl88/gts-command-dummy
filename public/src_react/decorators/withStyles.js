/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react'; // eslint-disable-line no-unused-vars

const canUseDOM = true;
let count = 0;

function withStyles(styles) {
  return (ComposedComponent) => class WithStyles extends Component {

    constructor() {
      super();
      this.refCount = 0;
      ComposedComponent.prototype.renderCss = function render(css) {
        let style;
        if (canUseDOM) {
          style = this.styleId && document.getElementById(this.styleId);
          if (style) {
            if ('textContent' in style) {
              style.textContent = css;
            } else {
              style.styleSheet.cssText = css;
            }
          } else {
            this.styleId = `dynamic-css-${count++}`;
            style = document.createElement('style');
            style.setAttribute('id', this.styleId);
            style.setAttribute('type', 'text/css');

            if ('textContent' in style) {
              style.textContent = css;
            } else {
              style.styleSheet.cssText = css;
            }

            document.getElementsByTagName('head')[0].appendChild(style);
            this.refCount++;
          }
        } else {
          this.context.onInsertCss(css);
        }
      }.bind(this);
    }

    componentWillMount() {
      console.log('render:', ComposedComponent.name);
      if (canUseDOM) {
        if (typeof styles === 'string' || styles instanceof String) {
          ComposedComponent.prototype.renderCss(styles);
          return;
        }

        // invariant(styles.use, `The style-loader must be configured with reference-counted API.`);
        styles.use();
      } else {
        this.context.onInsertCss(styles.toString());
      }
    }

    componentWillUnmount() {
      if (typeof styles === 'string' || styles instanceof String) {
      } else {
        styles.unuse();
      }

      if (this.styleId) {
        this.refCount--;
        if (this.refCount < 1) {
          const style = document.getElementById(this.styleId);
          if (style) {
            style.parentNode.removeChild(style);
          }
        }
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }

  };
}

export default withStyles;
