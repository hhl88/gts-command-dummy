/* global User */

const jwt = require('jsonwebtoken');
const secret = 'V62HuT2EFx68';

export default async function(req, res, next) {
  if (!req.cookies.accept_token) {
    res.send(401);
  }

  try {
    jwt.verify(req.cookies.accept_token, secret);
    next();
    return;
  } catch (e) {
    console.log(e);
    res.send(401);
    return;
  }
}
