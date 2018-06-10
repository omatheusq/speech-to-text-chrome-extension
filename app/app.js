$(document).ready(function () {
	setTimeout(function () {
		var menu = $('.k1feT');
		menu.on('click', (e) => {
			setTimeout(() => {
				var audios = $('audio');
				addButton(audios)
			}, 1000)
		})
	}, 2000)
});

function addButton(audios) {
	$('.teste').remove();
	audios.each(function (index) {
		var button = $('<div class="message-in teste"> Speech to Text</div>');
		button.on('click', parseAudioToText.bind(this))
		$(this).after(button);
	});
}

function parseAudioToText(event) {
	var audio = $(this),
	 	audioLink = audio.prop('src'),
		xhr = new XMLHttpRequest();

	$(event.target).html('<span class="spinner"></span>')

	xhr.open('GET', audioLink, true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function (e) {
		if (this.status == 200) {
			var uInt8Array = new Uint8Array(this.response);
			var i = uInt8Array.length;
			var binaryString = new Array(i);
			while (i--) {
				binaryString[i] = String.fromCharCode(uInt8Array[i]);
			}
			var data = binaryString.join('');
			var base64 = window.btoa(data);

			$.post( "http://localhost:3001/parseAudioToText", { audioContent: base64 } ).then(function(res){
				$(event.target).text(res.transcript)
			});

		}
	}
	xhr.send();
}


