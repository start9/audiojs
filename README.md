# Taisel Audio

This library is a fork from [taisel/XAudioJS](https://github.com/taisel/XAudioJS). It doesn't yet implement any other renderer than WebAudio, so you have to use a polyfill if you expect it to work on older browser.

## Usage

```js
import { createAudioServer } from 'taisel/createAudioServer';

createAudioServer( { inputSampleRate : 32768, channelCount : 2 } ).then( server => {

    someAudioStream.on( 'data', samples => {
        server.writeAudioNoCallback( samples );
    } );

} );
```

## Example

A demo is available [here](http://start9.github.io/taisel/example/) (the source code is [there](https://github.com/start9/taisel/blob/gh-pages/example/main.js)).

## License

> Copyright © 2011-2015 Taisel

> Copyright © 2015 Maël Nison
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
