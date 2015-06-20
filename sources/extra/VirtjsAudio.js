import { createAudioServer } from '../createAudioServer';

export class VirtjsAudio {

    constructor( { } = { } ) {

        this._flagstone = null;
        this._server = null;

    }

    validateInputFormat( ) {

        return true;

    }

    setInputFormat( { sampleRate, channelCount, formatCallback } ) {

        let flagstone = this._flagstone = { };

        createAudioServer( {

            inputSampleRate : sampleRate,

            channelCount : channelCount,

            formatCallback : formatCallback

        } ).then( server => {

            if ( this._flagstone !== flagstone )
                return ;

            this._server = server;

        } );

    }

    pushSampleBatch( samples ) {

        if ( ! this._server )
            return ;

        this._server.writeAudioNoCallback( samples );

    }

}
