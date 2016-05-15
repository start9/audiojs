import { WebAudioServer } from 'audiojs/implementations/WebAudioServer';

export function createAudioServer(options) {

    return WebAudioServer.create(options);

}
