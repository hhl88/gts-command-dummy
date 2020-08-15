/* global Device */

declare var User, require, process;

function errorHandler(res) {
  return (err) => {
    res.serverError(500);
    console.log(err);
  };
}

const request = require('request');
const config = require('../../config');

async function _index(req, res) {
  const id = process.env.DEVICE_ID;
  if (!id) {
    return res.send(400);
  }

  request.get(`${config.domain}/api/getPiMetaData?id=${id}`, (err, resp, result) => {
    console.log('getting meta for igot', resp.body);
    if (err) {
      return res.send(500);
    }
    return res.send(resp.body);
  });
}

async function index(req, res) {
  await _index(req, res).catch(errorHandler.bind(res));
}

export default {
  index,
};
