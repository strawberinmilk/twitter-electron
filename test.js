let fs = require("fs");
try {
console.log(JSON.parse(fs.readFileSync("test.json")).extended_entities.media[2].media_url_https)
}catch(e){
}