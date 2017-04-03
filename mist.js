var Twit = require('twit');
var Tumblr = require('tumblrwks');
var fs = require('fs');
var vapoursPath = "PATH TO IMAGES";
// var vapoursPath = "/Users/vapour/Dropbox/flame/vapours";

process.stdout.write('\x1B[2J\x1B[0f'); //CLEAR TERMINAL
console.log("summoning...")




summon();

// setInterval(summon, 5000); //FOR TESTING
setInterval(summon, 60*60*1000*3);




function summon() {

	var vapourImg = pick(fs.readdirSync(vapoursPath));

	twitter(vapourImg);
	tumblr(vapourImg);
};




function twitter(image) {

	var T = new Twit(
		{
		consumer_key: '',
		consumer_secret: '',
		access_token: '',
		access_token_secret: ''
		}
	);

	var vapourName = 'vapour '+image.slice(0, -4)+'— #vapours';
	var b64content = fs.readFileSync(vapoursPath+'/'+image, { encoding: 'base64' })

	T.post('media/upload', { media_data: b64content }, uploaded);

	function uploaded(err, data, response) {
	  var mediaIdStr = data.media_id_string;
	  var params = { status: vapourName, media_ids: [mediaIdStr] }
	  T.post('statuses/update', params, tweeted);
	};

	function tweeted(err, data, response) {
	  if (err) {
		console.log(err);
	  } else {
		var now=getDateTime()
		console.log('posted '+now+": " + data.text);
		// MOVE TO ANOTHER FOLDER AFTER TWEETING
		fs.rename(vapoursPath+"/"+image,vapoursPath+"/seen/"+image);
	  }
	};
};




function tumblr(image) {

	var tumblr = new Tumblr(
	{
		consumerKey: '',
		consumerSecret: '',
		accessToken: '',
		accessSecret: ''
	}, "YOURBLOG.tumblr.com"
	);

	var photo = fs.readFileSync(vapoursPath+'/'+image);
	var vapourName = 'vapour '+image.slice(0, -4)+'—';

	//POST IMAGE AND THEN ADD CAPTION+TAGS
	tumblr.post('/post', {type: 'photo', data: [photo]}, function(err, json){
		var blog_id = json.id;
        tumblr.post('/post/edit', {id: blog_id, caption: vapourName,tags:'vapour,veil,mist,vapours,art,visualart,abstract,abstractart,abstractartist,generative,generativeart,fractal,fractalart,procgen,glitch,glitchart,modern,modernart,render,everyday,daily,terragen,aftereffects,dailyrender,digitalart'}, function(err, json){
			console.log(json);
		});
	});
}




function getDateTime() {
    var date	= new Date();
	var hour	= date.getHours(); hour = (hour < 10 ? "0" : "") + hour;
	var min 	= date.getMinutes(); min = (min < 10 ? "0" : "") + min;
	var sec 	= date.getSeconds(); sec = (sec < 10 ? "0" : "") + sec;
	var year	= date.getFullYear();
	var month	= date.getMonth() + 1; month = (month < 10 ? "0" : "") + month;
	var day		= date.getDate(); day = (day < 10 ? "0" : "") + day;
	return hour + ":" + min + ":" + sec;
}




function pick(arr) {
  try {
    var index = Math.floor(Math.random() * arr.length);
    return arr[index];
  } catch (e) {
    return arr;
  }
}
