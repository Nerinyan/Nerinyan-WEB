import React, { useEffect, Fragment } from "react"
import { useSearchParams } from "react-router-dom"
import { Navbar, Footer, Searchbar, Beatmap, GeneralMixins, MusicPlayer } from "../Components"
import { getGlobalState, useGlobalState } from '../store'
import { message, notification } from 'antd' 

import '../assets/css/components/beatmap.css'

function Beatmaps() {
    const [apiResult] = useGlobalState("apiResult")
    const [noResult] = useGlobalState("noResult")
    const [loading] = useGlobalState("loading")
    const [searchParams] = useSearchParams()
    const AlertKey = 'alertMsg'

    function scrollHandler() {
        const documentData = document.documentElement
        if (documentData.scrollTop + documentData.clientHeight + (documentData.clientHeight*2) >= documentData.scrollHeight && !getGlobalState('loading') && !getGlobalState('firstLoad')) {
            // BeatmapListCreator(true)
            GeneralMixins.getApiData()
        }
    }

    const LoadingAlertHandler = () => {
        if (loading === true) {
            message.loading({
                content: 'Loading...',
                AlertKey,
                duration: 3,
            })
        }
        if (loading !== true) {
            message.success({
                content: 'Loaded!',
                AlertKey,
                duration: 2,
            })
        }
    }

    const GetNotification = () => {
        const noti = GeneralMixins.getNotificationFromSubAPI()
        noti.then((val) => {
            if (Boolean(val.visible) === true) {
                notification[val.type]({
                    message: val.message,
                    description: val.description
                })
            }
        })
        console.log("Notification Loaded.")
    }

    let renderBeatmaps = []
    apiResult.forEach((bmap, index) => {
        renderBeatmaps.push(<li key={index}><Beatmap bmap={bmap}/></li>)
    })

    useEffect(() => {
        GetNotification()
        GeneralMixins.getUserRequestParams(searchParams)
        window.addEventListener("scroll", scrollHandler) // Add scroll Event
        return () => {
          window.removeEventListener("scroll", scrollHandler) // Delete scroll Event
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    useEffect(() => {
        LoadingAlertHandler()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading])

    return (
        <Fragment>
            <Navbar />
            <div className="container">
                <Searchbar/>
                <ul className="beatmap-list">
                    {noResult &&
                        <li className="notfound">
                            <p>
                                Oops... <br/>
                                Search results do not exist :(
                            </p>
                        </li>
                    }
                    {!noResult &&
                        renderBeatmaps
                    }
                </ul>
                <p href="#top" className="backToTop" onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    window.scrollTo({top: 0, behavior: 'smooth'})
                }}>
                    <i className="fa-solid fa-circle-arrow-up"></i>
                </p>
                <MusicPlayer />
            </div>
            <Footer />
        </Fragment>
    )
}

export default Beatmaps
