function loadData(url) {

    return new Promise(function (resolve, reject) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send(null);

        xhr.addEventListener('load', () => {
            resolve(JSON.parse(xhr.responseText));
        });

    });

}

Promise.all([

    Audiojs.createAudioServer({ inputSampleRate : 32768, channelCount : 2, formatCallback : n => n / 0x8000 }),

    loadData('./audio.json')

]).then(([ audioServer, samples ]) => {

    window.play = function () {

        var index = 0;

        var playNextSamples = function () {
            if (index + 1 < samples.length) window.setTimeout(playNextSamples, samples[ index + 1 ][ 0 ]);
            audioServer.writeAudioNoCallback(samples[ index ++ ][ 1 ]);
        };

        playNextSamples();

    };

    window.play();

});
