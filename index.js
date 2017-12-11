"use strict";
var webclient = require("request");

//エスケープ
function escape(str) {
	if (str == null) return '';
	str = str.toString();
	/*
	str = str.replace(/&/g, '&amp;');
	str = str.replace(/</g, '&lt;');
	str = str.replace(/>/g, '&gt;');
	str = str.replace(/ /g, '&nbsp;');
*/
	str = str.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;'); // Tabをスペース4つに..
	str = str.replace(/\r?\n/g, "<br />\n");
	return str;
}

let replyid


function makeDom(tltext) {
	let div = document.createElement('div');
	div.className = "timeline";

	//RTの場合RTした人を表示
	if (tltext[10]) {
		let rtby = document.createElement("p")
		rtby.innerHTML = tltext[10];
		div.appendChild(rtby)
	}
	//アイコン
	let icon = document.createElement("img");
	icon.className = "icon"
	icon.src = `http://furyu.nazo.cc/twicon/${tltext[5]}/bigger`
	div.appendChild(icon);

	//IDとかハンネ
	let profile = document.createElement("p");
	profile.innerHTML = `${escape(tltext[0])}<br>@${escape(tltext[5])}<br clear="left">`;
	div.appendChild(profile);
	//本文
	let maintext = document.createElement("p");
	maintext.innerHTML = escape(tltext[1]);
	div.appendChild(maintext);
	//データとか
	let tweetdata = document.createElement("p");
	tweetdata.innerHTML = escape(tltext[2]);
	tweetdata.innerHTML += "<br>";
	tweetdata.innerHTML += escape(tltext[3]);
	div.appendChild(tweetdata);
	


	//画像orビデオ
	switch (tltext[6]) {
		case "pic":
			let pictemp = tltext[7]
			for (let i = 0; i < 4; i++) {
				if (pictemp[i]) {
					let domimg = document.createElement("img");
					domimg.src = pictemp[i]
					domimg.className = "pic"
					domimg.onclick = function () {
						if (domimg.classList.contains("pic")) {
							domimg.className = "video2"
						} else {
							if (domimg.classList.contains("video2")) {
								domimg.className = "video3"
							} else {
								domimg.className = "pic"
							}
						}
					}
					div.appendChild(domimg);
				}
			}
			break;
		case "video":
			let video = document.createElement("video");
			video.src = tltext[7];
			video.setAttribute("controls", "");
			video.className = "video1";
			video.onclick = function () {
				if (video.classList.contains("video1")) {
					video.className = "video2"
				} else {
					if (video.classList.contains("video2")) {
						video.className = "video3"
					} else {
						video.className = "video1"
					}
				}
			}

			div.appendChild(video);
			break;
	}

	//再生画面生成、IDだけもらってくるよ
	if (tltext[8] == "youtube") {
		let youtube = document.createElement("p");	
		youtube.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${tltext[9]}" frameborder="0" allowfullscreen></iframe>`
		div.appendChild(youtube)
	}
	if (tltext[8] == "niconico") {
		let niconico = document.createElement("script")
		niconico.src = `https://embed.nicovideo.jp/watch/${tltext[9]}/script?w=640&h=360`
		div.appendChild(niconico)
	}
	
	/*
	if(tltext[8] == "url"){
		let domurl = document.createElement("a");
		domurl.innerHTML = "test"
		domurl.href = tltext[9]
		domurl.target = "_blank"
		div.appendChild(domurl)
	}
	*/
	

	//ボタン生成
	let reply = document.createElement("button");
	let rt = document.createElement("button");
	let fav = document.createElement("button");
	let copy = document.createElement("button");

	reply.innerHTML = "reply";
	reply.onclick = function () {
		document.getElementById("posttweettext").value = "@" + escape(tltext[5]) + " "
		replyid = [tltext[4], tltext[5]]
		document.getElementById("mode").innerHTML = "reply"
	};

	rt.innerHTML = "RT";
	rt.onclick = function () {
		key.post('statuses/retweet/' + tltext[4] + '.json',
			function (error) {
				if (error) {
					window.alert("RT error")
				};
			}
		);
	}

	fav.innerHTML = "fav";
	fav.onclick = function () {
		key.post('favorites/create.json?id=' + tltext[4] + "&include_entities=true",
			function (error) {
				if (error) {
					window.alert("Fav error")
				}
			}
		)
	}

	copy.innerHTML = "copy"
	copy.onclick = function () {
		document.getElementById("posttweettext").value = tltext[1]
		if (document.getElementById("copytweet").checked) {
			setTimeout(() => {
				sendTweet()
			}, 20);
		}
		if (document.getElementById("copyfav").checked) {
			key.post('favorites/create.json?id=' + tltext[4] + "&include_entities=true",
				function (error) {
					if (error) {
						window.alert("Fav error")
					}
				}
			)
		}
	}

	div.appendChild(document.createElement("br"))
	div.appendChild(reply);
	div.appendChild(rt);
	div.appendChild(fav);
	div.appendChild(copy);

	let tlarea = document.getElementById("tlarea");
	tlarea.insertBefore(div, tlarea.firstChild);
	if (window.pageYOffset > 10) {
		scrollBy(0, div.clientHeight + 16)
	}
}
//テスト用
makeDom(["username", "text", "via", "time", "id", "krt6006" ,"pic",[ "https://pbs.twimg.com/media/DPiJl1QVQAAQrhQ.jpg", "https://pbs.twimg.com/media/DPiJl1QVQAAQrhQ.jpg"],"url","https://www.google.com"])
//makeDom(["username", "text", "via", "time", "id", "krt6006", "video", "https://video.twimg.com/ext_tw_video/936016211816497152/pu/vid/180x320/v29_p8YnUiPvQ7hh.mp4", "youtube", "bUc5bpOSFqA"])
//makeDom(["username", "text", "via", "time", "id", "krt6006", "video", "https://video.twimg.com/ext_tw_video/936016211816497152/pu/vid/180x320/v29_p8YnUiPvQ7hh.mp4", "youtube", "bUc5bpOSFqA"])

const twitter = require("twitter")
const fs = require("fs")
let key = fs.readFileSync(__dirname + "/key.txt", "utf8");
if (key === "") {
	window.alert("https://apps.twitter.com/ からapi-keyを取得し,keyset.jsを使用してキーを登録してください。");
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


//ctrl+enterでツイート
document.onkeydown = function (e) {
	if (e.ctrlKey == true && e.keyCode == 13) {
		sendTweet()
	}
	setTimeout(() => {
		document.getElementById("textnumber").innerHTML = 140 - document.getElementById("posttweettext").value.length;
	}, 5);
}

//ツイートボタン
let tweetbutton = document.getElementById("posttweetbutton")
tweetbutton.onclick = function () {
	sendTweet()
}

//クリアボタン
let replycansel = document.getElementById("replycansel")
replycansel.onclick = function () {
	replyid = undefined
	document.getElementById("mode").innerHTML = "tweet"
	document.getElementById("posttweettext").value = ""
}

//送信処理
function sendTweet() {
	if (replyid === undefined) {

		key.post('statuses/update',

			{ status: document.getElementById("posttweettext").value },
			function (error, tweet, response) {
				if (error) {
					window.alert("tweet error")
				};
				document.getElementById("posttweettext").value = ""

			});
	} else {
		key.post('statuses/update',
			{ status: document.getElementById("posttweettext").value, in_reply_to_status_id: replyid[0] },
			function (error, tweet, response) {
				if (error) {
					window.alert("reply error")
				};
				replyid = undefined;
				document.getElementById("mode").innerHTML = "tweet"
				document.getElementById("posttweettext").value = ""
			}
		);
	}
}


//認証試験
let mydata
key.get("account/verify_credentials", function (error, data) {
	mydata = data
	new Notification("認証成功", { body: `@${data.screen_name} ${data.name}` })
})


//ストリーム
key.stream('user', function (stream) {

	stream.on("data", function (data) {

		let tmp = data.source;
		tmp = tmp.split('">');
		tmp = tmp[1].split('</a>');

		if (data.retweeted_status == undefined) {

			let temp = []
			temp.push(data.user.name)
			temp.push(data.text)
			temp.push("via " + tmp)
			temp.push(data.user.created_at)
			temp.push(data.id_str)
			temp.push(data.user.screen_name)
			temp.push(undefined)
			let mediatemp
			//メディアがあるか
			try {
				if (data.extended_entities.media[0].type == "photo") {
					temp[6] = "pic"
					mediatemp = [];
					try {
						mediatemp.push(data.extended_entities.media[0].media_url_https)
					} catch (e) {
					}
					try {
						mediatemp.push(data.extended_entities.media[1].media_url_https)
					} catch (e) {
					}
					try {
						mediatemp.push(data.extended_entities.media[2].media_url_https)
					} catch (e) {
					}
					try {
						mediatemp.push(data.extended_entities.media[3].media_url_https)
					} catch (e) {
					}
				}
			} catch (e) {
			}

			try {
				if (data.extended_entities.media[0].type == "video") {
					temp[6] = "video"
					mediatemp = data.extended_entities.media[0].video_info.variants[0].url
				}
			} catch (e) {
			}

			temp.push(mediatemp)
			temp.push(undefined)
			temp.push(undefined)
			//リンクがあるか
			let reg = data.text.match(/https:\/\/t.co\/(\w)+/i)
			if (reg != null) {
				webclient.get({
					url: reg[0]
				}, function (error, response, body) {
					try {
						let regyoutube = body.match(/https:\/\/www.youtube.com\/watch\?v=(-|\w)+/i)
						if (regyoutube[0].split("v=")[1] != null) {
							temp[8] = "youtube"
							temp[9] = regyoutube[0].split("v=")[1]
						}
						makeDom(temp)
					} catch (e) {
						try {
							//niconico
							let regnico = body.match(/http:\/\/www.nicovideo.jp\/watch\/(\w)+/i)
							if (regnico[0].split("watch/")[1]) {
								temp[8] = "niconico"
								temp[9] = regnico[0].split("watch/")[1]
							}
							makeDom(temp)
						} catch (e) {
							makeDom(temp)
						}
					}
				});

			} else {
				makeDom(temp)
			}

		} else {
			if (data.retweeted_status.user.screen_name == mydata.screen_name) {
				//被RT
				new Notification("RT", { body: `by:${data.user.name} @${data.user.screen_name} target:${data.retweeted_status.user.name} @${data.retweeted_status.user.screen_name}\r\n${data.retweeted_status.text}` });
			} else {
				//関係ないRT
				let temp = []
				temp.push(data.retweeted_status.user.name)
				temp.push(data.retweeted_status.text)
				temp.push("via " + tmp)
				temp.push(data.retweeted_status.user.created_at)
				temp.push(data.retweeted_status.id_str)
				temp.push(data.retweeted_status.user.screen_name)
				temp.push(undefined)
				temp.push(undefined)
				temp.push(undefined)
				temp.push(undefined)
				temp.push(`RT by:@${data.user.screen_name} ${data.user.name}`)
				let mediatemp

				try {
					if (data.extended_entities.media[0].type == "photo") {
						temp[6] = "pic"
						mediatemp = [];
						try {
							mediatemp.push(data.extended_entities.media[0].media_url_https)
						} catch (e) {
						}
						try {
							mediatemp.push(data.extended_entities.media[1].media_url_https)
						} catch (e) {
						}
						try {
							mediatemp.push(data.extended_entities.media[2].media_url_https)
						} catch (e) {
						}
						try {
							mediatemp.push(data.extended_entities.media[3].media_url_https)
						} catch (e) {
						}
					}
				} catch (e) {
				}

				try {
					if (data.extended_entities.media[0].type == "video") {
						temp[6] = "video"
						mediatemp = data.extended_entities.media[0].video_info.variants[0].url
					}
				} catch (e) {
				}

				temp[7] = mediatemp

				let reg = data.text.match(/https:\/\/t.co\/(\w)+/i)
				if (reg != null) {
					webclient.get({
						url: reg[0]
					}, function (error, response, body) {
						try {
							let regyoutube = body.match(/https:\/\/www.youtube.com\/watch\?v=(-|\w)+/i)
							if (regyoutube[0].split("v=")[1] != null) {
								temp[8] = "youtube"
								temp[9] = regyoutube[0].split("v=")[1]
							}
							makeDom(temp)
						} catch (e) {
							try {
								//niconico
								let regnico = body.match(/http:\/\/www.nicovideo.jp\/watch\/(\w)+/i)
								if (regnico[0].split("watch/")[1]) {
									temp[8] = "niconico"
									temp[9] = regnico[0].split("watch/")[1]
								}
								makeDom(temp)
							} catch (e) {
								makeDom(temp)
							}
						}
					});

				} else {
					makeDom(temp)
				}
			}
		}
	})//stream on
	let eventreturn = "a"
	stream.on("event", function (data) {
		let eventdata = JSON.stringify(data)

		switch (data.event) {



			case "favorite":
			case "unfavorite":
				eventreturn = `by: ${data.source.name} @${data.source.screen_name}\ntarget: ${data.target_object.text}`
				new Notification(data.event, { body: eventreturn });

				break;

			case "follow":
			case "unfollow":
				eventreturn = data.source.name + "\n" + "@" + data.source.screen_name
				new Notification(data.event, { body: eventreturn });

				break;

			case "retweeted_retweet":
				eventreturn = `by ${data.source.name} @${data.source.screen_name} target:${data.target_object.entities.user_mentions[0].name} ${data.target_object.entities.user_mentions[0].screen_name}\n${data.target_object.retweeted_status.text}`;
				new Notification(data.event, { body: eventreturn });

				break;


			default:
				new Notification(data.event);

				break;

		}


	})

})
