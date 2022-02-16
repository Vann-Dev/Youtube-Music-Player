import axios from "axios";
import { useState } from "react"
import { addTrack } from "../lib/musicManager";

export default function Search() {
    const [searchResult, setSearchResult] = useState()

    async function searchTrack() {
        if (!document.getElementById('search').value) return setSearchResult()
        let result = []

        searchTrack(encodeURIComponent(document.getElementById('search').value))
            .then(function (response) {
                const res = response.data.filter(x => !x.liveNow && x.title && x.type === 'video')
                res.map(x => {
                    result.push(
                        <div key={x.id} onClick={() => [addTrack(x), setSearchResult()]} className="bg-[#1e2429] hover:bg-[#3c4044] cursor-pointer p-3 border-y-2 rounded border-[#09111a] flex gap-x-4 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 text-gray-200/70 transition duration-300 hover:text-gray-200/100" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                            <div className="grid px-1">
                                <h3 className="text-gray-200/75 font-semibold truncate ...">{x.title}</h3>
                                <p className="truncate ... text-gray-200/40 mr-10">{x.author.name}</p>
                            </div>
                        </div>
                    )
                })
                setSearchResult(<div className="h-64 overflow-y-scroll w-full scroll-hide">{result}</div>)
            })
    }

    function buttonDown(e) {
        if (e.code === 'Enter') {
            searchTrack()
        }
    }

    return (
        <div className="overflow-hidden">
            <div className="flex flex-shrink">
                <div className="flex justify-between items-center gap-3 rounded px-5 py-3 bg-[#1e2429] w-[700px]">
                    <input onKeyDown={buttonDown} autoComplete="off" placeholder="Search..." id="search" className="rounded-md bg-transparent focus:outline-none w-full select-auto text-gray-200"></input>
                    <button onClick={searchTrack} className="">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-200/70 transition duration-300 hover:text-gray-200/100" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="z-50 max-w-[700px]">
                {searchResult}
            </div>
        </div>
    )

}