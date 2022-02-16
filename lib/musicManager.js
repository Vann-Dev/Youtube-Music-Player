
import axios from "axios";

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
    axios.get(track.audio).then(x => {
        document.querySelector('#audio').src = x.data;
        document.querySelector('#audio').load();
        document.querySelector('#audio').play();
        document.querySelector('#audio').volume = volume;
    })
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
        audio: `https://express-1.stevanvincent.repl.co/track/${track.videoId}`,
        author: track.author,
        id: track.videoId,
        tracks: track,
        key: (Math.random() * 999).toString()
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

export function search(title) {
    return fetch(`https://invidious.snopyta.org/api/v1/search?q=${title}`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 7.0; SM-G930VC Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36"
        }
    }).then(res => res.json()).then(res => {
        return res
    })
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
    if (queue.length) play()
} 
