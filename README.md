#### CI-Status

[![Circle CI](https://circleci.com/gh/gts-software/gts-webservice.svg?style=shield&circle-token=35745e46a3a7422a253a4bef0e0c7e16fdce7f58)](https://circleci.com/gh/gts-software/gts-webservice)

#### Bit-Hound-Status

[![bitHound Overall Score](https://www.bithound.io/projects/badges/73831d70-d299-11e5-bc7e-111d3ef3bf50/score.svg)](https://www.bithound.io/github/gts-software/gts-webservice)
[![bitHound Dev Dependencies](https://www.bithound.io/projects/badges/73831d70-d299-11e5-bc7e-111d3ef3bf50/devDependencies.svg)](https://www.bithound.io/github/gts-software/gts-webservice/master/dependencies/npm)
[![bitHound Dependencies](https://www.bithound.io/projects/badges/73831d70-d299-11e5-bc7e-111d3ef3bf50/dependencies.svg)](https://www.bithound.io/github/gts-software/gts-webservice/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/projects/badges/73831d70-d299-11e5-bc7e-111d3ef3bf50/code.svg)](https://www.bithound.io/github/gts-software/gts-webservice)

# Starter Template combining SailsJS and Angular/ReactJS + PouchDB

Based on a small project to manage IoT devices and to allow them to be accepted or not.

### Why React and Angular in one Project?

We report good experience with building Admin/Backend-Systems with Angular and fast View-Frontends like Shops or Blogs with ReactJS

*Data/CRUD-Heavy parts* -> AngularJS

*View/Presentation-Heavy parts* -> ReactJS

An example of using this template in production is http://careiwo.de, where the car view consists only of ReactJS components and the admin site is powered by AngularJS.

## Start

Start with the following, presuming that NodeJS is installed:

    # install deps
    npm i

    # populate the DB (assuming that MongoDB is running)
    npm run populate

    # run this compiler in one window
    npm run dev

    # this in another window/terminal
    npm start

Go the default angular view to http://localhost:1339

# ReactView: http://localhost:1337/react

# AngularView (same as default): http://localhost:1337/angular

If you're wondering how we're achieving this, look at `./config/routes.js`

Production release:

    npm run build

This will produce minified files in `./assets`

### Which commands do work

These include some dummy tests just to demonstrate the idea

    # unit tests of server code
    npm run test-unit-server

    # integration tests of server code
    npm run test-integration-server

    # install selenium webdriver for integration tests
    npm run webdriver

    # integration test of client code (UI-tests)
    npm run test-integration-client


#### What does not work right now:

- Test coverage for __client__ code by Istanbul
- `npm run unittest` (unittest client code)

#### What is not included right now (but will be in the future):

- Authentification
- More Realtime (some is already provided by PouchDB)
- A good demonstration of ReactJS
- Responsivity
- Docker-Deployment
- Hot module replacement for ReactJS

### Patterns

- We put the test files in api folders under the `test`-dir of the corresponding component/functional domain:
- Unittests are suffixed with `.jstest`
- Integration tests are suffixed with `.jsitest`
- In Angular we put all templates inside the controller file and append them to the controller via a static variable  `MyController.Template = html...`


### Tooling with Atom

We recommend the following packages to work productively with this template:

To configure syntax for `.jstest` & `.jsitest` files, put that into your Atom config file:

```coffeescript
extname = require("path").extname
fileTypes =
  ".jstest": "source.js"
  ".jsitest": "source.js"

nullGrammar = atom.grammars.selectGrammar("text.plain.null-grammar")
atom.workspace.observeTextEditors (editor) ->
  grammar = atom.grammars.selectGrammar(fileTypes[extname(editor.getPath())])
  editor.setGrammar grammar  if editor.getGrammar() is nullGrammar and grammar isnt nullGrammar
```

To install the newest packages into Atom just type:

    # no, it won't overwrite the configs for the packages
    npm run import-atom-packages


If you updated some packages or installed new packages, feel free to run the following command:

    npm run export-atom-packages

This will write your current atom packages into this the `atom-package-list.txt` file

You may experience that the package `language-javascript` won't install,
in any case you need the newest version for better syntax highlighting (especially tagged css and html template strings).
So I recomend to uninstall the package and install a specified version

    apm uninstall language-javascript

    apm install language-javascript@0.109.0

### Structure of the folder:

```
├── README.md
├── api (http://sailsjs.org/documentation/anatomy/my-app/api)
│   ├── bootstrap.jsitest (boostraps integration tests)
│   ├── models
│   │   ├── BaseClass.js (this class contains some function to prepare the model for ag-grid and ng-formly)
│   │   ├── ... (different models)

├── app.js (starting point)
├── assets (will be automatically generated by webpack)
├── config (the sails config -> http://sailsjs.org/documentation/anatomy/my-app/config), here a summary of changes to the normal template
│   ├── babel.js (configured babel transpiler)
│   ├── blueprints.js (prefixed api calls by /api)
│   ├── connections.js (configured mongodb)
│   ├── models.js (set to mongodb)
│   ├── routes.js (set to serve index.ejs for almost all routes with exceptions like api calls)
│   └── views.js (set to ejs templating)
├── package.json
└── public
    ├── karma.conf.js (unittest config)
    ├── protractor.conf.js (ui-test config)
    ├── src_ng (angular part)
    │   ├── assets (assets like images)
    │   │   ├── ...
    │   ├── controller (MVC Controllers)
    │   │   ├── ...
    │   ├── index.html
    │   ├── lib (self explaining)
    │   │   ├── directive.js
    │   │   ├── factory.js
    │   │   └── service.js
    │   ├── main.js (entry point for angular app)
    │   ├── main.sass
    │   └── tests.webpack.js
    ├── src_react (react part)
    │   ├── README.md
    │   ├── assets
    │   │   └── README.md
    │   ├── components (components should be used like directives in Angular -  ideally pages should be made out of small components)
    │   │   └── Link.jsx
    │   ├── decorators (some more or less useful decorators)
    │   │   ├── withContext.js
    │   │   ├── withStyles.js
    │   │   └── withViewport.js
    │   ├── index.html
    │   ├── main.jsx (entry point for react app)
    │   ├── main.sass
    │   ├── pages (pages are containers for components: ideally a they behave like controllers in describing business logic: we have not introduced Redux/Flux yet, but ideally they should deal with business logic in the long run)
    │   │   ├── ...
    │   ├── stores (some static data stores to be included at compile time)
    │   │   ├── banner.js
    │   │   ├── filter.js
    │   │   └── news.js
    │   └── utils (small stateless functions like factories in Angular)
    │       ├── DOMUtils.js
    │       ├── formatters.js
    │       └── fs.js
    └── webpack.config.babel.js (configuration for webpack)
```

### Switching between ReactJS and Angular

If you need only one framework than go to `./public/webpack.config.babel.js` to the end of the file and comment out an item in the array

You can also use both frameworks but make sure to switch to desired main view (the default view when you visit http://localhost:1337 is the Angular View):

-> To React
- In `./public/webpack.config.babel.js` change line 143 to `./index.ejs` and line 176 to `./admin/index.ejs`

-> To Angular
- In `./public/webpack.config.babel.js` change line 143 to `./view/index.ejs` and line 176 to `./index.ejs`

# Details

This is a CRUD-Template on top of the following technologies:

The following linters can be used with this template:

- ESLint
- JSCS

(Both are configured to use the __airbnb__-Styleguide)

Backend:

- SailsJS
- MongoDB
- Waterline ORM
- Mocha/Chai test framework
- Test coverage by Istanbul

Frontend:

- SASS
- AngularJS with following Plugins
  - ag-grid (table rendering) - https://www.ag-grid.com/
  - ng-formly (Form-Rendering) - http://angular-formly.com/
  - Bootswatch (Bootstrap-Templates) - https://bootswatch.com/
- Webpack-Buildsystem - https://github.com/webpack/webpack
- ReactJS for purposes of the view
  - React Router - https://github.com/rackt/react-router
