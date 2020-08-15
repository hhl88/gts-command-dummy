import toastr from 'toastr';
import 'toastr/build/toastr.css';

angular.module('app.factories', [])

  .factory('visualEffects', () => {
    function withStyles(css_, namespace = '', componentName = '&') {
      const name = namespace;
      let style = name && document.getElementById(name);
      const css = css_.// Prettier output.
      replace(/}\s*/ig, '\n}\n')
        .// Regular rules are namespaced.
        replace(
          /(^|{|}|;|,)\s*([&a-z0-9\-_\.:#\(\),>*\s]+)\s*(\{)/ig, (matched) =>
            matched.replace(new RegExp(componentName, 'g'), namespace || `[ng-controller="${name}"]`),
        );

      if (style) {
        if ('textContent' in style) {
          style.textContent = css;
        } else {
          style.styleSheet.cssText = css;
        }
      } else {
        style = document.createElement('style');
        style.setAttribute('id', name);
        style.setAttribute('type', 'text/css');

        if ('textContent' in style) {
          style.textContent = css;
        } else {
          style.styleSheet.cssText = css;
        }

        document.getElementsByTagName('head')[0].appendChild(style);
      }

      // return Component;
    }

    return {
      toast: toastr,
      withStyles,
    };
  })

  .factory('restApi', (visualEffects, $ionicLoading, $state) => {
    const V1 = false;

    async function executeCommand(com, withLoading = true, showToast = true) {
      if (withLoading) $ionicLoading.show();
      let res;
      try {
        res = await Promise
          .resolve($.get('/api/executeCommand', com));
      } catch (error) {
        if (error.status === 401) {
          visualEffects.toast.error('Keine Berechtigung');
          $state.go('login');
          return {};
        }
      }

      if (res.err) {
        visualEffects.toast.error(res.err.cmd);
      } else if (showToast) {
        visualEffects.toast.info(`Result: <br/><pre>${res.out}</pre>`);
      }

      if (withLoading) $ionicLoading.hide();

      const resTrimmed = Object.assign({}, res, {
        out: res.out.trim(),
      });
      return resTrimmed;
    }

    async function checkCommandAppOnline(url) {
      try {
        const p = await fetch(url, {method: 'GET', mode: 'cors'});
        switch (p.status) {
          case 200:
            return true;
          default:
            console.log('Bad status:', p);
            return false;
        }
      } catch (e) {
        console.log('Error', e);
        return false;
      }
    }

    async function resetPi() {
      try {
        await fetch('/api/resetPi', {method: 'PUT', credentials: 'same-origin'});
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }

    async function getMeta() {
      try {
        const res = await fetch('/api/getPiMetaData', {method: 'GET', credentials: 'same-origin'});
        switch (res.status) {
          case 200:
            return await res.json();
          default:
            console.log(res);
            return {};
        }
      } catch (e) {
        console.log(e);
        return false;
      }
    }

    async function executeMultiCommands(coms, withLoading = true) {
      if (withLoading) $ionicLoading.show();
      const res = await Promise.all(coms.map(e => executeCommand(e, false)));
      if (withLoading) $ionicLoading.hide();
      return res;
    }

    return {
      V1,
      getMeta,
      resetPi,
      executeCommand,
      executeMultiCommands,
      checkCommandAppOnline,
    };
  });
