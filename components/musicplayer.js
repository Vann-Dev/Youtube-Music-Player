import Script from 'next/script'
import { useState } from 'react'
import MusicManager, { back, getCurrentPosition, getCurrentTrack, getLoop, loop, pause, setVolume, shuffle, skip } from '../lib/musicManager'
import { toMilliseconds } from "colon-notation";

export default function Musicplayer() {
    const [currentTrackTitle, setCurrentTrackTitle] = useState('Nothing Playing')
    const [currentTrackAuthor, setcurrentTrackAuthor] = useState('')
    const [currentVolume, setcurrentVolume] = useState('50')
    const [currentPosition, setcurrentPosition] = useState('0%')

    setInterval(() => {
        if (!getCurrentTrack().title || !getCurrentTrack().author) {
            setCurrentTrackTitle('Nothing Playing')
            setcurrentTrackAuthor('')
        } else {
            setcurrentTrackAuthor(getCurrentTrack().author)
            setCurrentTrackTitle(getCurrentTrack().title)
        }
    }, 500);

    function setLoop() {
        if (getLoop() === 0) {
            document.getElementById('loopButtons').className = 'opacity-100'
            loop(1)
        } else if (getLoop() === 1) {
            document.getElementById('loopButton').classList.add('hidden')
            document.getElementById('loopButton1').classList.remove('hidden')
            loop(2)
        } else {
            document.getElementById('loopButtons').className = 'opacity-75'
            document.getElementById('loopButton').classList.remove('hidden')
            document.getElementById('loopButton1').classList.add('hidden')
            loop(0)
        }
    }

    function showVolumeInput() {
        document.getElementById('inputVolume').classList.remove('hidden')
        document.getElementById('inputVolume').classList.add('flex')
    }

    function HideVolumeInput() {
        document.getElementById('inputVolume').classList.add('hidden')
        document.getElementById('inputVolume').classList.remove('flex')
    }

    function changeVolume() {
        document.getElementById('volume').addEventListener("input", function (e) {
            setVolume(e.currentTarget.value)
            setcurrentVolume(e.currentTarget.value)
        })
    }

    setInterval(() => {
        if (getCurrentTrack().tracks) {
            const time = Math.floor(getCurrentPosition() / toMilliseconds(getCurrentTrack().tracks.duration) * 100)
            setcurrentPosition(time + '%')
        } else {
            setcurrentPosition('0%')
        }
    }, 5000);

    return (
        <>
            <MusicManager />
            <Script src="https://kit.fontawesome.com/c6b3c624ab.js" crossOrigin="anonymous"></Script>
            <nav className="fixed bottom-0 w-full bg-[#222527] space-y-2">
                <div id='playingStats' style={{ 'width': currentPosition }} className={`h-[2px] bg-indigo-500`}></div>
                <div className='flex items-center flex-row w-full md:justify-between gap-5 py-4 px-4 md:px-7 h-16'>
                    <div className='flex gap-7 md:gap-10 text-2xl text-gray-200/80'>
                        <button onClick={back} className=' hover:opacity-75'>
                            <i className="fas fa-step-backward"></i>
                        </button>
                        <button id='playIcon' onClick={() => pause(0)} className='text-3xl hover:opacity-75'>
                            <i className="fas fa-play"></i>
                        </button>
                        <button id='pauseIcon' onClick={() => pause(1)} className='hidden text-3xl hover:opacity-75'>
                            <i className="fas fa-pause"></i>
                        </button>
                        <button onClick={skip} className=' hover:opacity-75'>
                            <i className="fas fa-step-forward"></i>
                        </button>
                    </div>
                    <div className='flex flex-col w-56 h-10 shrink'>
                        <h2 id='title' className='text-gray-200 text-sm text-center shrink font-semibold truncate ...'>{currentTrackTitle}</h2>
                        <p id='author' className='text-gray-200/75 shrink text-sm text-center truncate ...'>{currentTrackAuthor}</p>
                    </div>
                    <div className='hidden md:flex gap-7 md:gap-10 text-2xl text-gray-200/80'>
                        <button onMouseOver={showVolumeInput} onMouseOut={HideVolumeInput} className=''>
                            <div onMouseOver={showVolumeInput} onMouseOut={HideVolumeInput} id='inputVolume' className='bg-[#222527] items-center gap-x-4 text-sm rounded px-7 py-5 pr-16 hidden absolute right-[160px] bottom-0'>
                                <p>{currentVolume}</p>
                                <input id='volume' onInput={changeVolume} className='sliderVolume cursor-pointer' type={'range'}></input>
                                <p>100</p>
                            </div>
                            <i className="fas fa-volume-up opacity-60"></i>
                        </button>
                        <button id='loopButtons' onClick={setLoop} className='opacity-60'>
                            <svg className='' id='loopButton' height={'30px'} width={'30px'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill='currentColor'>
                                <path fill="currentColor" d="M464,210.511V264A112.127,112.127,0,0,1,352,376H78.627l44.686-44.687-22.626-22.626L56,353.373l-4.415,4.414L18.019,391.354,92.041,474.63l23.918-21.26L75.63,408H352c79.4,0,144-64.6,144-144V178.511Z" />
                                <path fill="currentColor" d="M48,256A112.127,112.127,0,0,1,160,144H433.373l-44.686,44.687,22.626,22.626L456,166.627l4.117-4.116,33.864-33.865L419.959,45.37,396.041,66.63,436.37,112H160C80.6,112,16,176.6,16,256v85.787l32-32Z" />
                            </svg>
                            <svg className='hidden' id='loopButton1' height={'30px'} width={'30px'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill='currentColor'>
                                <polygon fill="currentColor" points="208 312 208 344 320 344 320 312 280 312 280 176 248 176 248 200 216 200 216 232 248 232 248 312 208 312" />
                                <path fill="currentColor" d="M464,210.511V264A112.127,112.127,0,0,1,352,376H78.627l44.686-44.687-22.626-22.626L56,353.373l-4.415,4.414L18.019,391.354,92.041,474.63l23.918-21.26L75.63,408H352c79.4,0,144-64.6,144-144V178.511Z" />
                                <path fill="currentColor" d="M48,256A112.127,112.127,0,0,1,160,144H433.373l-44.686,44.687,22.626,22.626L456,166.627l4.117-4.116,33.864-33.865L419.959,45.37,396.041,66.63,436.37,112H160C80.6,112,16,176.6,16,256v85.787l32-32Z" />
                            </svg>
                        </button>
                        <button onClick={shuffle} className='opacity-60'>
                            <i className="fas fa-random"></i>
                        </button>
                    </div>
                </div>

            </nav>
        </>
    )
}