var data_dir = process.env.OPENSHIFT_DATA_DIR || "./";
var fs = require('fs');
var login = JSON.parse(fs.readFileSync(data_dir+'/infojobs.json').toString());
console.log(login);
