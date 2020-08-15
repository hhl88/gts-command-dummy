/* global User */

declare var User, require, process;

const request = require('request');
const config = require('../../config');

const jwt = require('jsonwebtoken');
const secret = 'V62HuT2EFx68';

async function _createSession(req, res) {
  console.log('Requesting auth from', config.domain);
  request.post(`${config.domain}/api/createSessionCommandApp`, {form: req.body}, (err, resp, result) => {
    if (err) {
      console.log(err);
      res.badRequest(400);
      return;
    }

    res.cookie('accept_token', result, {maxAge: 100000000 * 60000 * 60000})
    res.ok();
  })
}

async function _getSession(req, res) {
  if (!req.cookies.accept_token) { // jscs:disable
    res.send(401);
  }

  try {
    const decoded = jwt.verify(req.cookies.accept_token, secret);
    res.json(decoded.user);
    return;
  } catch (e) {
    console.log(e);
    res.send(401);
    return;
  }
}

function createSession(req, res) {
  _createSession(req, res).catch(err => {console.log(err); res.serverError();});
}

function getSession(req, res) {
  _getSession(req, res).catch(err => {console.log(err); res.serverError();});
}

export default {
  createSession,
  getSession,
};
