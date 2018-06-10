var express = require('express'),
	cors = require('cors'),
	bodyParser = require('body-parser'),
	SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1'),
	fs = require('fs'),
	app = express(),
	port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var speechToText = new SpeechToTextV1({
	username: '<username>',
	password: '<password>',
	url: 'https://stream.watsonplatform.net/speech-to-text/api/',
	model_id: 'en-US_NarrowbandModel'
});

app.listen(port);

app.post('/parseAudioToText', async function (req, res) {

	var audioContent = req.body.audioContent;

	fs.writeFileSync('../resources/speech.ogg', Buffer.from(audioContent.replace('data:audio/ogg; codecs=opus;base64,', ''), 'base64'));

	var params = {
		audio: fs.createReadStream('../resources/speech.ogg'),
		content_type: 'audio/ogg; rate=44100'
	};

	speechToText.recognize(params, function (err, response) {
		if (err)
			console.log(err);
		else
			res.json({ transcript: response.results[0].alternatives[0].transcript });
	});
});