import React, { Fragment, useState, useLayoutEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import { GeneralMixins, Navbar } from "../Components"
import { getGlobalState } from '../store'
import axios from "axios"

function Download() {
    let { beatmapsetid } = useParams()
    const [searchParams] = useSearchParams()
    const [dlURL, setDlURL] = useState('')
    const [B_DATA, set_B_DATA] = useState({})
    const [DESC, setDESC] = useState()

    function generateDownloadURL() {
        if (searchParams.novideo !== null) {
            if (searchParams.novideo === 'true' || searchParams.novideo === '1') setDlURL(GeneralMixins.generateDownloadURL(beatmapsetid, false))
            else setDlURL(GeneralMixins.generateDownloadURL(beatmapsetid))
        }
        setDlURL(GeneralMixins.generateDownloadURL(beatmapsetid))

        try {
            axios.get(
                `${getGlobalState("apiURL")}/search`, {
                    params: {
                        q: String(beatmapsetid),
                        option: 's'
                    }
                }
            ).then(function (response) {
                var B_DATA = response.data[0]
                set_B_DATA(B_DATA)

                var desc = `${GeneralMixins.convertStatus(B_DATA.ranked)} osu! beatmap by ${GeneralMixins.convertStatus(B_DATA.creator)}.\n`
                desc += `${GeneralMixins.convertStatusWithIcon(B_DATA.ranked)} · 📚 ${B_DATA.length} Difficulties · 🎵 ${Math.round(parseFloat(B_DATA.bpm))} · ❤️ ${B_DATA.favourite_count}\n` 
                B_DATA.beatmaps.forEach(bmap => {
                    desc += `    (${GeneralMixins.convertMode(bmap.mode_int)}) ${bmap.version} - ⭐ ${bmap.difficulty_rating} · ⏳ ${GeneralMixins.secondsToTime(bmap.total_length)} | CS ${bmap.cs} · AR ${bmap.ar}`
                })
                setDESC(desc)
            })
        }
        catch(e) {
            console.log(e)
        }
    }

    useLayoutEffect(() => {
        generateDownloadURL()
    })

    return (
        <Fragment>
            <Helmet>
                <meta property="title" content={`${B_DATA.artist} - ${B_DATA.title}`} />
                <meta property="twitter:title" content={`${B_DATA.artist} - ${B_DATA.title}`} />
                <meta name="description" content={DESC} />
                <meta name="twitter:description" content={DESC} />
                <meta property="vk:image" content={`https://b.ppy.sh/thumb/${B_DATA.id}l.jpg`} />
                <meta property="twitter:image" content={`https://b.ppy.sh/thumb/{${B_DATA.id}l.jpg}`} />
                <meta property="og:image" content={`https://b.ppy.sh/thumb/${B_DATA.id}l.jpg`} />
                <meta httpEquiv="refresh" content={`0; url=${dlURL}`} />
            </Helmet>
            <Navbar/>
            <div className="container">
                <div className="download-page">
                    <div className="owo">
                        <h1>Thank you for using Nerinyan!🐈</h1>
                        <h2>잠시후, 비트맵 다운로드가 시작됩니다. 다운로드가 시작되지 않을 경우 <a href={dlURL}>여기를 클릭해주세요.</a></h2>
                        <h2>Your Requested Beatmapset will download in seconds... Download failed? <a href={dlURL}>Click Here to download manually.</a></h2>
                    </div>
                    <a href="/main">
                        <button>
                            Return to Main Page
                        </button>
                    </a>
                </div>
            </div>
        </Fragment>
    )
}

export default Download
