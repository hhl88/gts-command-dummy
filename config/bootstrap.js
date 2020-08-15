/**
* @Author: Igor Fischer <igor>
* @Date:   2016-03-01T17:08:20+01:00
* @Last modified by:   igor
* @Last modified time: 2016-04-14T13:00:01+02:00
*/

/* global sails, User */

/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = (cb) => {
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server
  // will never lift, since it's waiting on the bootstrap)
  cb();
};
