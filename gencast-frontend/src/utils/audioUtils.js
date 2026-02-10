export const decodeBase64 = (base64) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

// Manually decode raw PCM 16-bit data from Gemini
export const decodeAudioData = async (
    data,
    ctx,
    sampleRate = 24000,
    numChannels = 1
) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            // Convert int16 to float [-1.0, 1.0]
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
};

export const concatenateAudioBuffers = (
    buffers,
    ctx,
    pauseDuration = 0.5
) => {
    if (buffers.length === 0) return null;

    // Use the sample rate of the segments, not the context, to prevent speed issues
    const sampleRate = buffers[0].sampleRate;
    const pauseLength = Math.floor(pauseDuration * sampleRate);

    // Calculate total length including pauses
    const totalLength = buffers.reduce((acc, b) => acc + b.length, 0) + (buffers.length - 1) * pauseLength;

    const result = ctx.createBuffer(
        buffers[0].numberOfChannels,
        totalLength,
        sampleRate
    );

    let offset = 0;

    for (let i = 0; i < buffers.length; i++) {
        const buffer = buffers[i];
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const resultData = result.getChannelData(channel);
            const bufferData = buffer.getChannelData(channel);
            resultData.set(bufferData, offset);
        }
        offset += buffer.length;

        // Add silence (pause) if not the last buffer
        if (i < buffers.length - 1) {
            offset += pauseLength;
        }
    }

    return result;
};

export const playBuffer = (
    buffer,
    ctx
) => {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
    return source;
};
