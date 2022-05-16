import React, { useState, useEffect } from "react"
// import Head from 'next/head'
import { Helmet } from 'react-helmet'
import { useRouter } from 'next/router'
import { GeneralMixins } from "../../components"
import { getGlobalState } from '../../store'
import axios from "axios"
import useSWR from 'swr'


const fetcher = async (url) => {
    const res = await fetch(url)
    const data = await res.json()
  
    if (res.status !== 200) {
      throw new Error(data.message)
    }
    return data[0]
  }

export default function Download() {
    const { query } = useRouter()
    // const { data } = useSWR(
    //     () => query.id && `${getGlobalState("apiURL")}/search?q=${query.id}&option=s`,
    //     fetcher
    // )

    // const [beatmapsetid, setBeatmapsetid] = useState(router.query.id)
    // const [dlURL, setDlURL] = useState('')
    const [B_DATA, set_B_DATA] = useState({})
    const [DESC, setDESC] = useState()

    // if (router.novideo !== null) {
    //     if (router.novideo === 'true' || router.novideo === '1') setDlURL(GeneralMixins.generateDownloadURL(beatmapsetid, false))
    //     else setDlURL(GeneralMixins.generateDownloadURL(beatmapsetid))
    // }
    // setDlURL(GeneralMixins.generateDownloadURL(beatmapsetid))


    useEffect(() => {
        axios.get(
            `${getGlobalState("apiURL")}/search`, {
                params: {
                    q: String(query.id),
                    option: 's'
                }
            }
        ).then(function (response) {
            var B_DATA = response.data[0]
            set_B_DATA(B_DATA)

            var desc = `${GeneralMixins.convertStatus(B_DATA.ranked)} osu! beatmap by ${B_DATA.creator}.\n`
            desc += `${GeneralMixins.convertStatusWithIcon(B_DATA.ranked)} · 📚 ${B_DATA.beatmaps.length} Difficulties · 🎵 ${Math.round(parseFloat(B_DATA.bpm))} · ❤️ ${B_DATA.favourite_count}\n` 
            B_DATA.beatmaps.forEach(bmap => {
                desc += `    (${GeneralMixins.convertMode(B_DATA.mode_int)}) ${bmap.version} - ⭐ ${bmap.difficulty_rating} · ⏳ ${GeneralMixins.secondsToTime(bmap.total_length)} | CS ${bmap.cs} · AR ${bmap.ar}`
            })
            setDESC(desc)
        })

        
    })
    
    return (
        <>
            <div className="container">
                <Helmet>
                    {/* <meta property="title" content={`${B_DATA.artist} - ${B_DATA.title}`} />
                    <meta property="twitter:title" content={`${B_DATA.artist} - ${B_DATA.title}`} /> */}
                    <meta name="description" content={DESC} />
                    <meta name="twitter:description" content={DESC} />
                    {/* <meta property="vk:image" content={`https://b.ppy.sh/thumb/${data.id}l.jpg`} />
                    <meta property="twitter:image" content={`https://b.ppy.sh/thumb/${data.id}l.jpg}`} />
                    <meta property="og:image" content={`https://b.ppy.sh/thumb/${data.id}l.jpg`} /> */}
                    {/* <meta httpEquiv="refresh" content={`0; url=${GeneralMixins.generateDownloadURL(router.query.id)}`} /> */}
                </Helmet>
                <div className="download-page">
                    <div className="owo">
                        <h1>Thank you for using Nerinyan!🐈</h1>
                        <h2>잠시후, 비트맵 다운로드가 시작됩니다. 다운로드가 시작되지 않을 경우 <a href={GeneralMixins.generateDownloadURL(B_DATA.id, false)}>여기를 클릭해주세요.</a></h2>
                        <h2>Your Requested Beatmapset will download in seconds... Download failed? <a href={GeneralMixins.generateDownloadURL(B_DATA.id, false)}>Click Here to download manually.</a></h2>
                        <h2>{B_DATA.id}</h2>
                        <h2>{DESC}</h2>
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