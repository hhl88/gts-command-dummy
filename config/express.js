// /**
//  * Configure options for the Express server inside of Sails.
//  *
//  * For more information on configuration, check out:
//  * http://sailsjs.org/#documentation
//  */
// module.exports.express = {
//
//   // Configures the middleware function used for parsing the HTTP request body
//   // Defaults to the Formidable-based version built-in to Express/Connect
//   //
//   // To enable streaming file uploads (to disk or somewhere else)
//   // you'll want to set this option to `false` to disable the body parser.
//   //
//   // Defaults to `express.bodyParser`
//   //
//   // Alternatively, if you're comfortable with the bleeding edge,
//   // check out: https://github.com/mikermcneil/stream-debug
//   //
//   // Example override
//   // (for now-- still has the same problems since it's using the core Connect bodyParser)
//   bodyParser: () => {
//
//     // Uploader with NO FILE LIMITS
//     const rawUploaderMiddleware = require('express').bodyParser();
//
//     // Uploader which limits file uploads to files of a certain size
//     // const limitedUploaderMiddleware = require('express').bodyParser({
//     //   limit: 8248242,
//     // });
//
//     // Safe uploader (which defers stream processing of the HTTP body to your controllers/policies)
//     const safeUploaderMiddleware = require('express').bodyParser({
//       defer: true,
//     });
//
//     // e.g. if you want to use safe uploads globally
//     // (doesn't use tmp directory)
//     // use the safe/deferred uploader (see the links above for more info on how to do this.
//     // return safeUploaderMiddleware;
//
//     // e.g. if you want .tmp files with no file size limits, return:
//     // return rawUploaderMiddleware;
//
//     // e.g. if you want a global limit, you can just return the limited version here:
//     // (still USES TMP FILES!!!)
//     // return limitedUploaderMiddleware;
//
//     // e.g. if you want a per-route limit, configure that logic here:
//     return (req, res, next) => {
//       // If the route looks like a request you want to allow unbridled access to,
//       // call the raw body parser, or whatever you want, etc.
//       // if (req.method === 'get' && req.url.match(/\/admin/avatar/)) {
//       if (req.url.match(/\/dbapi/)) {
//         next();
//         return;
//       }
//
//       if (!req.url.match(/\/dbapi/)) {
//         rawUploaderMiddleware(req, res, next);
//         return;
//       } else {
//         // Otherwise, run the limited (or better yet, the safe/deferred) bodyParser
//         // limitedUploaderMiddleware(req,res,next);
//         // or
//         safeUploaderMiddleware;
//         return;
//       }
//     };
//   },
//
//   // If bodyParser doesn't understand the HTTP body request data,
//   // run it again with an artificial header, forcing it to try and parse
//   // the request body as JSON.
//   // (this allows JSON to be used as your request data without the need to
//   // specify a 'Content-type: application/json' header)
//   //
//   // Defaults to `true`.
//   //
//   // NOTE: If using the `file-parser` above, you'll want to explicitly disable this:
//   // retryBodyParserWithJSON: false,
//
//   // Cookie parser middleware to use
//   //          (or false to disable)
//   //
//   // Defaults to `express.cookieParser`
//   //
//   // Example override:
//   // cookieParser: (function customMethodOverride (req, res, next) {})(),
//
//   // HTTP method override middleware
//   //          (or false to disable)
//   //
//   // This option allows artificial query params to be passed to trick
//   // Express into thinking a different HTTP verb was used.
//   // Useful when supporting an API for user-agents which don't allow
//   // PUT or DELETE requests
//   //
//   // Defaults to `express.methodOverride`
//   //
//   // Example override:
//   // methodOverride: (function customMethodOverride (req, res, next) {})()
// };
//
// /**
//  * HTTP Flat-File Cache
//  *
//  * These settings are for Express' static middleware- stuff like your
//  * images, css, etc.
//  *
//  * In Sails, this is probably your app's `assets directory.
//  * By default, Sails uses your project's Gruntfile to compile/copy those
//  * assets to `.tmp/public`, where they're accessible to Express.
//  *
//  * The HTTP static cache is only active in a 'production' environment,
//  * since that's the only time Express will cache flat-files.
//  *
//  * For more information on configuration, check out:
//  * http://sailsjs.org/#documentation
//  */
// module.exports.cache = {
//
//   // The number of seconds to cache files being served from disk
//   // (only works in production mode)
//   maxAge: 31557600000,
// };
