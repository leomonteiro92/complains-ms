const restify = require("restify");
const ctrl = require("./domain/complains.controller");

const server = restify.createServer({
  name: "complains-ms"
});

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

server.get("/", ctrl.list);
server.get("/:id", ctrl.findById);
server.post("/", ctrl.create);
server.put("/:id", ctrl.update);
server.del("/:id", ctrl.remove);

server.listen(process.env.PORT || 3000, process.env.HOST || "127.0.0.1", () => {
  console.info(`${server.name} up and running on ${server.url}`);
});

module.exports = server;
