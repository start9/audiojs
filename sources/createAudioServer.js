import { WebAudioServer } from './implementations/WebAudioServer';

export function createAudioServer( options ) {

    return WebAudioServer.create( options );

}
