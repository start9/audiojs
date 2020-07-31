function range(from, to) {

    return Array.from(new Array(to - from), (x, i) => from + i);

}

function compilePassthroughResampler() {

    return this.returnSlice ? buffer => {

        return buffer;

    } : buffer => {

        this.outputBuffer = buffer;

        return this.outputBuffer.length;

    };

}

function compileLinearInterpolationResampler() {

    // eslint-disable-next-line no-new-func
    return Function(`buffer`, `

        var bufferLength = buffer.length;
        var outputLength = this.outputBufferSize;

        if ( bufferLength > 0 ) {

            var weight = this.lastWeight;

            var firstWeight = 0;
            var secondWeight = 0;

            var inputOffset = 0;
            var outputOffset = 0;

            for ( ; weight < 1; weight += ${this.ratioWeight} ) {

                secondWeight = weight % 1;
                firstWeight = 1 - secondWeight;

                ${range(0, this.channelCount).map(t => `
                    this.outputBuffer[ outputOffset ++ ] = ( this.lastOutput[ ${t} ] * firstWeight ) + ( buffer[ ${t} ] * secondWeight );
                `).join(``)}

            }

            weight -= 1;

            bufferLength -= ${this.channelCount};
            inputOffset = Math.floor( weight ) * ${this.channelCount};

            while ( outputOffset < outputLength && inputOffset < bufferLength ) {

                secondWeight = weight % 1;
                firstWeight = 1 - secondWeight;

                ${range(0, this.channelCount).map(t => `
                    this.outputBuffer[ outputOffset ++ ] = ( buffer[ inputOffset${t > 0 ? ` + ${t}` : ``} ] * firstWeight ) + ( buffer[ inputOffset + ${this.channelCount + t} ] * secondWeight );
                `).join(``)}

                weight += ${this.ratioWeight};
                inputOffset = Math.floor( weight ) * ${this.channelCount};

            }

            ${range(0, this.channelCount).map(t => `
                this.lastOutput[ ${t} ] = buffer[ inputOffset ++ ];
            `).join(``)}

            this.lastWeight = weight % 1;

            ${this.returnSlice ? `
                return this.outputBuffer.subarray( 0, outputOffset );
            ` : `
                return outputOffset;
            `}

        } else {

            ${this.returnSlice ? `
                return this.outputBuffer.subarray( 0, 0 );
            ` : `
                return 0;
            `}

        }

    `);

}

function compileMultiTapResampler() {

    // eslint-disable-next-line no-new-func
    return Function(`buffer`, `

        var bufferLength = buffer.length;
        var outputLength = this.outputBufferSize;

        if ( bufferLength > 0 ) {

            var weight = 0;

            ${range(0, this.channelCount).map(t => `
                var output${t} = 0;
            `).join(``)}

            var actualPosition = 0;
            var amountToNext = 0;
            var alreadyProcessedTail = !this.tailExists;
            var outputBuffer = this.outputBuffer;
            var outputOffset = 0;
            var currentPosition = 0;

            this.tailExists = false;

            do {

                if ( alreadyProcessedTail ) {

                    weight = ${this.ratioWeight};

                    ${range(0, this.channelCount).map(t => `
                        output${t} = 0;
                    `).join(``)}

                } else {

                    alreadyProcessedTail = true;
                    weight = this.lastWeight;

                    ${range(0, this.channelCount).map(t => `
                        output${t} = this.lastOutput[ ${t} ];
                    `).join(``)}

                }

                while ( weight > 0 && actualPosition < bufferLength ) {

                    amountToNext = 1 + actualPosition - currentPosition;

                    if ( weight >= amountToNext ) {

                        ${range(0, this.channelCount).map(t => `
                            output${t} += buffer[ actualPosition ++ ] * amountToNext;
                        `).join(``)}

                        currentPosition = actualPosition;
                        weight -= amountToNext;

                    } else {

                        ${range(0, this.channelCount).map(t => `
                            output${t} += buffer[ actualPosition${t > 0 ? ` + ${t}` : ``} ] * weight;
                        `).join(``)}

                        currentPosition += weight;
                        weight = 0;

                        break ;

                    }

                    if ( weight <= 0 ) {

                        ${range(0, this.channelCount).map(t => `
                            outputBuffer[ outputOffset ++ ] = output${t} / ${this.ratioWeight};
                        `).join(``)}

                    } else {

                        this.lastWeight = weight;

                        ${range(0, this.channelCount).map(t => `
                            this.lastOutput[ ${t} ] = output${t};
                        `).join(``)}

                        this.tailExists = true;

                        break ;

                    }

                }

            } while ( actualPosition < bufferLength && outputOffset < outputLength );

            ${this.returnSlice ? `
                return this.outputBuffer.subarray( 0, outputOffset );
            ` : `
                return outputOffset;
            `}

        } else {

            ${this.returnSlice ? `
                return this.outputBuffer.subarray( 0, 0 );
            ` : `
                return 0;
            `}

        }

    `);

}

export class Resampler {

    constructor({

        inputSampleRate,
        outputSampleRate,

        channelCount,

        outputBufferSize,

        returnSlice = true

    } = { }) {

        this.inputSampleRate = inputSampleRate;
        this.outputSampleRate = outputSampleRate;

        this.channelCount = channelCount;

        this.outputBufferSize = outputBufferSize;

        this.outputBuffer = new Float32Array(this.outputBufferSize);
        this.lastOutput = new Float32Array(this.channelCount);

        this.returnSlice = returnSlice;

        if (this.inputSampleRate === this.outputSampleRate) {

            this.resample = Reflect.apply(compilePassthroughResampler, this, []);

            this.ratioWeight = 1;

        } else {

            this.ratioWeight = this.inputSampleRate / this.outputSampleRate;

            if (this.inputSampleRate < this.outputSampleRate) {

                this.resample = Reflect.apply(compileLinearInterpolationResampler, this, []);

                this.lastWeight = 1;

            } else if (this.inputSampleRate > this.outputSampleRate) {

                this.resample = Reflect.apply(compileMultiTapResampler, this, []);

                this.tailExists = false;
                this.lastWeight = 0;

            }

        }

    }

}
