#!/home/ubuntu/.nodebrew/current/bin/node
const fs = require("fs");
const util = require("util");
const twitter = require("twitter");
let path = require("path");
const readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout
});

let pathdata = process.argv[1];
pathdata = path.dirname(pathdata);
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

//文字色
const black = '\u001b[30m';
const red = '\u001b[31m';
const green = '\u001b[32m';
const yellow = '\u001b[33m';
const blue = '\u001b[34m';
const magenta = '\u001b[35m';
const cyan = '\u001b[36m';
const white = '\u001b[37m';
const reset = '\u001b[0m';
//記憶域
let twinum = -1;
let twiid = [];
let twitxt = [];
let twiname = [];
let twiscname = [];
let replynum = "";
let mode = undefined;

let shell = [];
shell = process.argv;
console.log(shell[2])
switch (shell[2]) {
	case "h":
		//ヘルプ
		console.log("h:ヘルプ\r\ntl:TLを流す\r\n一致しない場合:第二引数をツイート後即終了");
		break;
	case undefined:
	case "tl":
		//TLを流す
		console.log(green + " #    #  " + cyan + "######  " + yellow + "#       " + red + " ####   " + white + " ####   " + yellow + "#    #  " + blue + "######" + reset);
		console.log(green + " #    #  " + cyan + "#       " + yellow + "#       " + red + "#    #  " + white + "#    #  " + yellow + "##  ##  " + blue + "#     " + reset);
		console.log(green + " #    #  " + cyan + "#####   " + yellow + "#       " + red + "#       " + white + "#    #  " + yellow + "# ## #  " + blue + "##### " + reset);
		console.log(green + " # ## #  " + cyan + "#       " + yellow + "#       " + red + "#       " + white + "#    #  " + yellow + "#    #  " + blue + "#     " + reset);
		console.log(green + " ##  ##  " + cyan + "#       " + yellow + "#       " + red + "#    #  " + white + "#    #  " + yellow + "#    #  " + blue + "#     " + reset);
		console.log(green + " #    #  " + cyan + "######  " + yellow + "######  " + red + " ####   " + white + " ####   " + yellow + "#    #  " + blue + "######" + reset);
		console.log("\r\ntimeline mode\r\n");

		key.stream('user', function (stream) {

			stream.on("data", function (data) {

				let tmp = data.source;
				tmp = tmp.split('">');
				tmp = tmp[1].split('</a>');

				twinum = twinum + 1;
				twiid.push(data.id_str);
				twitxt.push(data.text);
				twiname.push(data.user.name);
				twiscname.push(data.user.screen_name);


				let temp = "No." + twinum + "\r\n";
				temp += cyan + data.user.name + " @" + data.user.screen_name + "\r\n";
				temp += white + data.text + "\r\n";
				temp += green + "via " + tmp + "\r\n";
				temp += data.user.created_at + reset + "\r\n";

				console.log(temp);
			})

			//ツイ消し通知
			stream.on("delete", function (data) {
				for (let i = twiid.length; i > 0; i--) {
					if (twiid[i] === data.delete.status.id_str) {
						let temp = ""
						temp += red + "delete\r\n";
						temp += twiname[i] + " " + twiscname[i] + "\r\n";
						temp += twitxt[i] + reset + "\r\n";
						console.log(temp);
						break;
					}
				}
			})

			stream.on("event", function (data) {
				let temp = red				
				switch (data.event) {
					case "follow":
						temp += "follow \r\n"
						temp += data.source.name + "\r\n";
						temp += "@" + data.source.screen_name + "\r\n" + reset
						console.log(temp);
						break;
					case "favorite":
						temp += "favorite" + "\r\n";
						temp += "source\r\n"
						temp += data.source.name +" @"+ data.source.screen_name + "\r\n";
						temp += "target\r\n"
						temp += data.target.name + " @" + data.target.screen_name + "\r\n";
						temp += data.target_object.text + reset + "\r\n"
						console.log(temp);
						break;
					case "unfavorite":
					  temp += "unfavorite" + "\r\n";
					  temp += "source\r\n"
					  temp += data.source.name +" @"+ data.source.screen_name + "\r\n";
					  temp += "target\r\n"
					  temp += data.target.name + " @" + data.target.screen_name + "\r\n";
					  temp += data.target_object.text + reset + "\r\n"
						console.log(temp);
						break;
					default:
						temp += "未知のイベントが検出されました。プログラムの機能拡充の為、以下のメッセージを開発者に伝えていただけると幸いです。\r\n\r\n"
						temp += data + reset
						console.log(temp);
						break;
				}	
			})

		});

		//↓TLモード内コマンド判定式------------------
		readline.on('line', function (line) {

			if (line === "q") {
				mode = ""
				console.log("cancel")
			} else {
				switch (mode) {
					case "replynum":
						mode = "replymsg";
						replynum = line;
						console.log("repry msg?");
						break;

					case "replymsg":
						mode = undefined;
						console.log(cyan + "send...")
						key.post('statuses/update',
							{ status: "@" + twiscname[replynum] + " " + line, in_reply_to_status_id: twiid[replynum] },
							function (error, tweet, response) {
								if (!error) {
									//console.log(tweet);
									console.log(green + "tweet success\r\n" + reset);
								} else {
									console.log(red + "tweet error\r\n" + reset);
								};
								replyid = "";
							}
						);
						break;
					case "rt":
						//RT
						mode = undefined;
						key.post('statuses/retweet/' + twiid[line] + '.json',
							function (error) {
								if (!error) {
									console.log(green + "\r\nRT success\r\n" + reset);
								} else {
									console.log(red + "\r\nRT error\r\n" + reset);
								};
							});
						break;
					case "fav":
						//ふぁぼ
						mode = undefined;
						key.post('favorites/create.json?id=' + twiid[line] + "&include_entities=true",
							function (error) {
								if (!error) {
									console.log(green + "\r\nFav success\r\n" + reset);
								} else {
									console.log(red + "\r\nFav error\r\n" + reset);
								};
							});
						break;
					case "copy":
						//パクツイ
						mode = "";
						console.log(cyan + "send...");
						key.post('statuses/update',
							{ status: twitxt[line] },
							function (error, tweet, response) {
								if (!error) {
									//console.log(tweet);
									console.log(green + "tweet success\r\n" + reset);
								} else {
									console.log(red + "tweet error\r\n" + reset);
								};
							}
						);
						break;
					default:
						switch (line) {
							case "h":
								if (mode === undefined) {
									console.log(" r=retweet \r\n f=Favorite \r\n c=copy \r\n m=reply(message) \r\n q=cancel");
								} else {
									console.log("Number=No,*");
								};
								break;
							case "r":
								mode = "rt";
								console.log("RT Number?");
								break;
							case "f":
								mode = "fav";
								console.log("Fav Number?");
								break;
							case "c":
								mode = "copy";
								console.log("Copy Number?");
								break;
							case "m":
								mode = "replynum";
								console.log("reply Number?");
								break;
							default:
								console.log(cyan + "send...");
								key.post('statuses/update',
									{ status: line },
									function (error, tweet, response) {
										if (!error) {
											//console.log(tweet);
											console.log(green + "tweet success\r\n" + reset);
										} else {
											console.log(red + "tweet error\r\n" + reset);
										};
									}
								);
								break;
						}//swich mode
						break;
				};//switch line
			}
		});//入力
		//↑TLモード内コマンド判定式----------------------------
		break;
	default:
		//ツイート後即終了
		console.log(cyan + 'send...' + reset);
		key.post('statuses/update',
			{ status: shell[2] },
			function (error, tweet, response) {
				if (!error) {
					//console.log(tweet);
					console.log(green + "success" + reset);
				} else {
					console.log(red + "error" + reset);
					console.log(error);
				};
				process.exit();
			});
		break;

};//switch shell

/*
licenses

mitライセンスのnode-twitterを利用させていただきました。

MIT License Copyright (c) 2016 Desmond Morris

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/