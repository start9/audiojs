import { Resampler } from 'audiojs/Resampler';

export let MIN_SAMPLE_COUNT_PER_CALLBACK = 2048;
export let MAX_SAMPLE_COUNT_PER_CALLBACK = 4096;

export let DEFAULT_CHANNEL_COUNT = 1;
export let DEFAULT_SAMPLE_COUNT_PER_CALLBACK = MIN_SAMPLE_COUNT_PER_CALLBACK;

// https://github.com/taisel/XAudioJS/commit/12116b160d67d736c75388a7780d05311c77774a#diff-8440541ee2e9f7bc08b588c334d05df9R164
// https://github.com/taisel/XAudioJS/commit/6dd5f53774705c60ca6215ec8ca4937f360a09bc
export let MAGIC_NUM = 1.000000476837158203125;

export class AudioServer {

    constructor({

        inputSampleRate,
        outputSampleRate,

        channelCount = 1,

        minBufferSize = null,
        maxBufferSize = null,

        sampleCountPerCallback = MIN_SAMPLE_COUNT_PER_CALLBACK,

        formatCallback = null,
        underrunCallback = null

    } = {}) {

        if (channelCount < 1)
            throw new Error(`channelCount (${channelCount}) shouldn\'t be lower than 1`);

        if (sampleCountPerCallback < MIN_SAMPLE_COUNT_PER_CALLBACK) // eslint-disable-next-line no-console
            console.warn(`sampleCountPerCallback (${sampleCountPerCallback}) shouldn\'t be lower than ${MIN_SAMPLE_COUNT_PER_CALLBACK} - silence will be added`);

        if (sampleCountPerCallback > MAX_SAMPLE_COUNT_PER_CALLBACK) // eslint-disable-next-line no-console
            console.warn(`sampleCountPerCallback (${sampleCountPerCallback}) shouldn\'t be greater or equal than ${MAX_SAMPLE_COUNT_PER_CALLBACK} - extra samples will be ignored`);

        if (minBufferSize === null)
            minBufferSize = sampleCountPerCallback * channelCount;

        if (maxBufferSize === null)
            maxBufferSize = minBufferSize * channelCount;

        if (minBufferSize >= maxBufferSize)
            throw new Error(`minBufferSize (${minBufferSize}) should be greater than maxBufferSize (${maxBufferSize})`);

        if (isNaN(inputSampleRate))
            throw new Error(`inputSampleRate cannot be NaN`);

        if (isNaN(outputSampleRate))
            throw new Error(`outputSampleRate cannot be NaN`);

        this.inputSampleRate = Math.abs(inputSampleRate);
        this.outputSampleRate = Math.abs(outputSampleRate);

        this.inputRatio = this.inputSampleRate / this.outputSampleRate;
        this.outputRatio = this.outputSampleRate / this.inputSampleRate;

        this.channelCount = channelCount;

        this.minBufferSize = minBufferSize;
        this.maxBufferSize = maxBufferSize;

        this.sampleCountPerCallback = sampleCountPerCallback;

        this.audioBuffer = new Float32Array(this.maxBufferSize);
        this.audioBufferSize = 0;

        this.resampleBufferStart = this.resampleBufferEnd = 0;
        this.resampleBufferSize = Math.ceil(this.maxBufferSize * this.outputRatio / this.channelCount * MAGIC_NUM) * this.channelCount + this.channelCount;

        this.resampleBuffer = new Float32Array(this.resampleBufferSize);
        this.resampleControl = new Resampler({ inputSampleRate: this.inputSampleRate, outputSampleRate: this.outputSampleRate, channelCount: this.channelCount, outputBufferSize: this.resampleBufferSize, returnSlice: false });

        this.formatCallback = formatCallback;
        this.underrunCallback = underrunCallback;

        this.volume = 1.0;

    }

    setVolume(volume) {

        this.volume = Math.max(0.0, Math.min(volume, 1.0));

    }

    writeAudio(samples) {

        throw new Error(`Not implemented`);

    }

    writeAudioNoCallback(samples) {

        throw new Error(`Not implemented`);

    }

    remainingBuffer() {

        throw new Error(`Not implemented`);

    }

    executeCallback() {

        throw new Error(`Not implemented`);

    }

    refillResampleBuffer() {

        if (this.audioBufferSize === 0)
            return;

        let resampleLength = this.resampleControl.resample(this.audioBuffer.subarray(0, this.audioBufferSize));
        let resampleResult = this.resampleControl.outputBuffer;

        for (let t = 0; t < resampleLength;) {

            this.resampleBuffer[this.resampleBufferEnd ++] = resampleResult[t++];

            if (this.resampleBufferEnd === this.resampleBufferSize)
                this.resampleBufferEnd = 0;

            if (this.resampleBufferStart === this.resampleBufferEnd) {
                this.resampleBufferStart += this.channelCount;
                if (this.resampleBufferStart === this.resampleBufferSize) {
                    this.resampleBufferStart = 0;
                }
            }

        }

        this.audioBufferSize = 0;

    }

}
