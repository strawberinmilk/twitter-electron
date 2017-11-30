let fs = require("fs");
//console.log(JSON.parse(fs.readFileSync("testvideo.json")).extended_entities.media[0].video_info.variants[0].url)
let temp = "https://www.youtube.coM/watch?v=eOkEroGjdfk aaa";
temp = temp.match(/https:\/\/www.youtube.com\/watch\?v=(\w)+/i)[0]
console.log(temp)