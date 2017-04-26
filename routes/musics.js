const Music = require('../models/music');


let paths = [];
const get = {
  method: 'GET',
  path: '/hello/{id}'
};
get.handler = (req, reply) => {
  reply();
};
paths.push(get);
const getAll = {
  method: 'GET',
  path: '/hello'
};
getAll.handler = (req, reply) => {
  reply();
};
paths.push(getAll);
const post = {
  method: 'POST',
  path: '/hello'
};
post.handler = (req, reply) => {
  reply();
};
paths.push(post);

module.exports = paths;