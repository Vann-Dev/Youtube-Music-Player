import axios from "axios";
import crypto from "crypto";

let queue = [];
let currentTrack = {};
let repeatNumber = 0;
let previousTrack = {};
let volume = 0.5
let playing = false
let position = 0

export default function MusicManager() {
    return (
        <audio onTimeUpdate={timeUpdate} onLoadStart={trackStart} onEnded={trackEnd} id="audio">
            <source type="audio/ogg"></source>
            <source type="audio/mpeg"></source>
            <source type="audio/mp4"></source>
            <source type="audio/webm"></source>
            Your browser does not support the audio format.
        </audio>
    )
}

function timeUpdate() {
    position = Math.floor(document.getElementById('audio').currentTime)
}

export function getCurrentPosition() {
    return position;
}

export function repeat(number = 0) {
    repeatNumber = number;
}

export function play() {
    const track = queue.shift();
    if (!track) return;
    currentTrack = track
    axios.get(`/api/stream?id=${track.id}`).then(x => {
        document.querySelector('#audio').src = x.data;
        document.querySelector('#audio').load();
        document.querySelector('#audio').play();
        document.querySelector('#audio').volume = volume;
    });
    document.getElementById('image').src = `https://i.ytimg.com/vi/${currentTrack.id}/hqdefault.jpg`
}

export function setVolume(number = 50) {
    document.querySelector('#audio').volume = number / 100
    volume = number / 100
}

export function pause(number = 1) {
    if (!currentTrack) return
    if (number == 1) {
        document.querySelector('#audio').pause()
        document.getElementById('pauseIcon').classList.add('hidden')
        document.getElementById('playIcon').classList.remove('hidden')
    } else if (number == 0) {
        document.querySelector('#audio').play()
        document.getElementById('playIcon').classList.add('hidden')
        document.getElementById('pauseIcon').classList.remove('hidden')
    }
}

export function addTrack(track) {
    queue.push({
        title: track.title,
        author: track.channel.name,
        id: track.id,
        tracks: track,
        key: crypto.randomBytes(16).toString('hex')
    })
    if (!playing) play()
}

export function getCurrentTrack() {
    return currentTrack
}

export function getCurrentQueue() {
    return queue
}

export function skip() {
    document.querySelector('#audio').src = ''
    playing = false
    trackEnd()
}

export function back() {
    if (currentTrack) {
        queue.unshift(previousTrack)
        skip()
    } else {
        queue.push(previousTrack)
        play()
    }
}

export function shuffle() {
    for (let i = queue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [queue[i], queue[j]] = [queue[j], queue[i]];
    }
}

export function getLoop() {
    return repeatNumber
}


export function removeTrack(id) {
    const track = queue.find(x => x.key === id)
    const index = queue.indexOf(track)
    if (index !== -1) {
        queue.splice(index, 1)
    }
}

export function loop(number = 0) {
    repeatNumber = number
}

function trackStart() {
    if (!currentTrack.title) return;
    document.getElementById('playIcon').classList.add('hidden')
    document.getElementById('pauseIcon').classList.remove('hidden')
    playing = true
}

function trackEnd() {
    previousTrack = currentTrack
    if (repeatNumber === 1) queue.push(previousTrack)
    else if (repeatNumber === 2) queue.unshift(previousTrack);
    currentTrack = {}
    playing = false
    document.getElementById('pauseIcon').classList.add('hidden')
    document.getElementById('playIcon').classList.remove('hidden')
    document.querySelector('#audio').removeAttribute('src');
    document.querySelector('#audio').load();
    document.getElementById('image').src = `data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==`
    if (queue.length) play()
} 
