
const fs = require('fs');
const Lame = require("node-lame").Lame;
export const toWav = require('audiobuffer-to-wav');
const testFileName = './test.ogg'
import { create, trim, concat } from 'audio-buffer-utils';
import { min,max, mean, chunk, flattenDeep} from 'lodash';
const decode = require('audio-decode');
require('opus.js');
require('ogg.js');

// export const SILENCE_LEVEL = 0;
export const SILENCE_LEVEL = 0.00003;

export const toBuffer = (ab: any) => {
    var buf = Buffer.alloc(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}

function load(file: string) {
    return new Promise(function (done, reject) {
        fs.readFile(file, function (err: any, file: any) {
            err ? reject(err) : done(file)
        })
    })
}

//This function returns an AudioBuffer that has all 'silences' below the threshold removed
//please note this is only working on the first channel
const removeSilenceFromAudioData = async (soundfile: any, threshold: any) => {
    const inputAudioBuffer = await decode(soundfile);
    const no_silences = 
    await silenceRemovalAlgorithm(inputAudioBuffer
        .getChannelData(0))
    const output = create(no_silences,{
        channels: inputAudioBuffer.numberOfChannels,
        length: inputAudioBuffer.length,
        sampleRate: inputAudioBuffer.sampleRate
    });
    return output;
}

export const silenceRemovalAlgorithm = async (channelData:any) => {
    //split this into seperate chunks of a certain amount of samples
    const step = 160;
    const threshold = 0.4;
    const output:any = [];
    let _silenceCounter = 0;
    //now chunk channelData into 
    chunk(channelData,step).map((frame:any)=>{
        //square every value in the frame
        const squaredFrame = frame.map((x:number)=>x**2);
        const _min : number = min(squaredFrame) || 0;
        const _max : number = max(squaredFrame) || 0;
        const _ptp = _max-_min;
        const _avg = mean(squaredFrame);
        const thd = (_min+_ptp)*threshold;
            if(_avg<=thd){
                _silenceCounter++;
            } else {
                _silenceCounter=0;
            }
        //if there are 20 or more consecutive 'silent' frames then ignore these frames, do not return
            if(_silenceCounter>=20) {
                //dont append to the output
            } 
            else {
                //append to the output
                output.push([...frame]);
            }
    })
    console.log("TCL: result -> result", flattenDeep(output).length)
    return flattenDeep(output);
}

//This function returns an AudioBuffer that has all 'silences' below the threshold removed
//please note this is only working on the first channel
export const removeSilenceFromAudio = async (filename: any, threshold: any) => {
    const soundfile = await load(filename);
    return await removeSilenceFromAudioData(soundfile, threshold)
}

export const removePausesAndAddPadding = async (audioData: any, threshold?:any) => {
    const clean_audio = await removeSilenceFromAudioData(audioData, SILENCE_LEVEL);
    const rate = clean_audio.sampleRate;
    const padding = create(2 * rate, 1, rate);
    const all = concat(padding,clean_audio,padding);
    return all;
}

const start = async () => {
    try {
        const output = await removePausesAndAddPadding(testFileName, SILENCE_LEVEL);
        const outputBuffer = toBuffer(toWav(output));
        const encoder = new Lame({
            "output": "./output-file.mp3",
            "bitrate": 320
        }).setBuffer(outputBuffer);
        encoder.encode();
    } catch (error) {
        console.error(error)
    }
}

// start();