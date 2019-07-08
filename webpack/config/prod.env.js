let opt = {};
let ingress = process.env.TEU_API || 'http://localhost:3030'
opt.NODE_ENV = '"production"';
opt.TEU_API = JSON.stringify(ingress);

module.exports = opt;
