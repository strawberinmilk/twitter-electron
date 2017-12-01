let text = "https://t.co/713qBWUNBo"

var webclient = require("request");		
if(text.match(/https:\/\/t.co\/(\w)+/)[0] != null){
  webclient.get({
    url: text.match(/https:\/\/t.co\/(\w)+/)[0],
    qs: {
      testkey: "testvalue",
      hoge: "hoge"
    }
   }, function (error, response, body) {
    console.log(body.match(/https:\/\/www.youtube.com\/watch\?v=(-|\w)+/i)[0].split("v=")[1])
   });
}
 
/*
webclient.get({
 url: "https://t.co/713qBWUNBo",
 qs: {
   testkey: "testvalue",
   hoge: "hoge"
 }
}, function (error, response, body) {
 console.log(body.match(/https:\/\/www.youtube.com\/watch\?v=(-|\w)+/i)[0])
});
/*
//https://t.co/713qBWUNBo
//console.log(JSON.parse(fs.readFileSync("testvideo.json")).extended_entities.media[0].video_info.variants[0].url)
/*
let fs = require("fs");
let temp = "https://www.youtube.coM/watch?v=eOkEroGjdfk aaa";
temp = temp.match(/https:\/\/www.youtube.com\/watch\?v=(\w)+/i)[0]
console.log(temp)
*/