const restify = require('restify');
const ctrl = require('./domain/complains.controller');

const server = restify.createServer({
  name: 'complains-ms'
});

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

server.get(
  {
    name: 'list',
    path: '/complains'
  },
  ctrl.list
);
server.get(
  {
    name: 'findById',
    path: '/complains/:id'
  },
  ctrl.findById
);
server.post(
  {
    name: 'create',
    path: '/complains'
  },
  ctrl.create
);
server.put(
  {
    name: 'update',
    path: '/complains/:id'
  },
  ctrl.update
);
server.del(
  {
    name: 'update',
    path: '/complains/:id'
  },
  ctrl.remove
);

server.get('/', (req, res) => {
  res.send({
    self: server.router.render('list')
  });
});

server.listen(process.env.PORT || 3000, process.env.HOST || '127.0.0.1', () => {
  console.info(`${server.name} up and running on ${server.url}`);
});

module.exports = server;
