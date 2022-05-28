import React from "react"
import Head from 'next/head'
import { useRouter } from "next/router"
import axios from "axios"

import { GeneralMixins } from "../../components"
import { getGlobalState } from '../../store'

function Download({ BEATMAPDATA }) {
    const { useEffect } = React
    
    const router = useRouter()

    if (router.isFallback) return <div>Loading...</div>

    function generateDESC() {
        var desc = `${GeneralMixins.convertStatus(BEATMAPDATA.ranked)} osu! beatmap by ${BEATMAPDATA.creator}.\n`
        desc += `${GeneralMixins.convertStatusWithIcon(BEATMAPDATA.ranked)} · 📚 ${BEATMAPDATA.beatmaps.length} Difficulties · 🎵 ${Math.round(parseFloat(BEATMAPDATA.bpm))} · ❤️ ${BEATMAPDATA.favourite_count}\n\n` 
        BEATMAPDATA.beatmaps.forEach(bmap => {
            desc += `    (${GeneralMixins.convertMode(bmap.mode_int)}) ${bmap.version} - ⭐ ${bmap.difficulty_rating} · ⏳ ${GeneralMixins.secondsToTime(bmap.total_length)} | CS ${bmap.cs} · AR ${bmap.ar}\n`
        })
        return desc
    }

    function generateDownloadURL() {
        if (router.query.novideo === "1" || router.query.novideo === "true") {
            return GeneralMixins.generateDownloadURL(BEATMAPDATA.id, false)
        } else {
            return GeneralMixins.generateDownloadURL(BEATMAPDATA.id)
        }
    }


    useEffect(() => {
        if (router.query.novideo) console.log(router.query.novideo)
    })
    
    return (
        <>
            <div className="container">
                <Head>
                    <meta property="title" content={`${BEATMAPDATA.artist} - ${BEATMAPDATA.title}`} />
                    <meta property="og:title" content={`${BEATMAPDATA.artist} - ${BEATMAPDATA.title}`} />
                    <meta property="twitter:title" content={`${BEATMAPDATA.artist} - ${BEATMAPDATA.title}`} />
                    <meta name="description" content={generateDESC()} />
                    <meta name="og:description" content={generateDESC()} />
                    <meta name="twitter:description" content={generateDESC()} />
                    <meta property="image" content={`https://b.ppy.sh/thumb/${BEATMAPDATA.id}l.jpg`} />
                    <meta property="og:image" content={`https://b.ppy.sh/thumb/${BEATMAPDATA.id}l.jpg`} />
                    <meta property="twitter:image" content={`https://b.ppy.sh/thumb/${BEATMAPDATA.id}l.jpg}`} />
                    <meta property="vk:image" content={`https://b.ppy.sh/thumb/${BEATMAPDATA.id}l.jpg`} />
                    <meta httpEquiv="refresh" content={`0; url=${generateDownloadURL()}`} />
                </Head>
                <div className="download-page">
                    <div className="owo">
                        <h1>Thank you for using Nerinyan!🐈</h1>
                        <h2>잠시후, 비트맵 다운로드가 시작됩니다. 다운로드가 시작되지 않을 경우 <a href={generateDownloadURL()}>여기를 클릭해주세요.</a></h2>
                        <h2>Your Requested Beatmapset will download in seconds... Download failed? <a href={generateDownloadURL()}>Click Here to download manually.</a></h2>
                    </div>
                    <a href="/main">
                        <button>
                            Return to Main Page
                        </button>
                    </a>
                </div>
            </div>
        </>
    )
}

Download.getInitialProps = async function(context) {
    const id = context.query.id
    if (id !== null) {
        const response = await axios.get(
        `${getGlobalState("apiURL")}/search?q=${id}&option=s`
        )
        if (response.data.length > 0) return {BEATMAPDATA: response.data[0]}
    }
  }

export default Download