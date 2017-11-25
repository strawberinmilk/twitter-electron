"use strict";
function escape( str )
{
    if( str == null ) return '';
    str = str.toString();
    str = str.replace( /&/g,'&amp;' );
    str = str.replace( /</g,'&lt;' );
    str = str.replace( />/g,'&gt;' );
    str = str.replace( / /g,'&nbsp;' );
    str = str.replace( /\t/g,'&nbsp;&nbsp;&nbsp;&nbsp;' ); // Tabをスペース4つに..
    str = str.replace( /\r?\n/g, "<br />\n");
    return str;
}

function makeDom(tltext) {
	let div = document.createElement('div');
	div.className = "timeline";
	let text0 = document.createElement("p");
	let text1 = document.createElement("p");
	let text2 = document.createElement("p");
	let text3 = document.createElement("p");
	text0.innerHTML = escape(tltext[0]);
	text1.innerHTML = escape(tltext[1]);
	text2.innerHTML = escape(tltext[2]);
	text3.innerHTML = escape(tltext[3]);
	div.appendChild(text0);
	div.appendChild(text1);
	div.appendChild(text2);
	div.appendChild(text3);	

	let tlarea = document.getElementById("tlarea");
	tlarea.insertBefore(div, tlarea.firstChild);
}


const twitter = require("twitter")
const fs = require("fs")
let key = fs.readFileSync(__dirname + "/key.txt", "utf8");
if (key === "") {
	console.log("https://apps.twitter.com/ からapi-keyを取得し,keyset.jsを使用してキーを登録してください。");
	process.exit();
} else {
	key = key.split(",");
	key = new twitter({
		consumer_key: key[0],
		consumer_secret: key[1],
		access_token_key: key[2],
		access_token_secret: key[3]
	});
};

document.onkeydown = function(e){
	if(e.ctrlKey==true&&e.keyCode==13){
		sendTweet()
	}
}

let tweetbutton = document.getElementById("posttweetbutton")
tweetbutton.onclick = function (){
	sendTweet()
}


function sendTweet() {

	key.post('statuses/update',
		{ status: document.getElementById("posttweettext").value },
		function (error, tweet, response) {
			if (error) {
				window.alert("tweet error")
			};
		document.getElementById("posttweettext").value = ""
		
		});

}
key.stream('user', function (stream) {

	stream.on("data", function (data) {

		let tmp = data.source;
		tmp = tmp.split('">');
		tmp = tmp[1].split('</a>');

		let temp = []
		temp.push(data.user.name + " @" + data.user.screen_name)
		temp.push(data.text)
		temp.push("via " + tmp)
		temp.push(data.user.created_at)
		temp.push(data.id_str)
		makeDom(temp)
	})
})
