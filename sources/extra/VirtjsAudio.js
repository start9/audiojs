import { createAudioServer } from '../createAudioServer';

export class VirtjsAudio {

    constructor( { } = { } ) {

        this.volume = 1.0;

        this._flagstone = null;
        this._server = null;

    }

    setVolume( volume ) {

        if ( this._server )
            this._server.setVolume( volume );

        this.volume = volume;

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

            this._server.setVolume( this.volume );

        } );

    }

    pushSampleBatch( samples ) {

        if ( ! this._server )
            return ;

        this._server.writeAudioNoCallback( samples );

    }

}
