import { createAudioServer } from 'audiojs/createAudioServer';

// Virtjs-compatible
// http://arcanis.github.io/virtjs/documentation/Audio.html

export class AudiojsAudio {

    constructor({} = {}) {

        this.volume = 1.0;

        this.flagstone = null;
        this.server = null;

    }

    setVolume(volume) {

        if (this.server)
            this.server.setVolume(volume);

        this.volume = volume;

    }

    validateInputFormat() {

        return true;

    }

    setInputFormat({ sampleRate, channelCount, formatCallback }) {

        let flagstone = this.flagstone = {};

        createAudioServer({

            inputSampleRate: sampleRate,

            channelCount: channelCount,

            formatCallback: formatCallback

        }).then(server => {

            if (this.flagstone !== flagstone)
                return;

            this.server = server;

            this.server.setVolume(this.volume);

        });

    }

    pushSampleBatch(samples) {

        if (!this.server)
            return;

        this.server.writeAudioNoCallback(samples);

    }

}
