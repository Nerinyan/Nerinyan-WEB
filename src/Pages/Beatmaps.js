import React, { useEffect, Fragment } from "react"
import { useSearchParams } from "react-router-dom"
import { Navbar, Searchbar, Beatmap, GeneralMixins, MusicPlayer } from "../Components"
import { getGlobalState, useGlobalState } from '../store'
import { message, notification } from 'antd' 

function Beatmaps() {
    const [apiResult] = useGlobalState("apiResult")
    const [loading] = useGlobalState("loading")
    const [firstLoad] = useGlobalState("firstLoad")
    const [searchParams] = useSearchParams()
    var sendtime = 0
    const AlertKey = 'alertMsg'

    function scrollHandler() {
        const documentData = document.documentElement
        if (documentData.scrollTop + documentData.clientHeight + (documentData.clientHeight*2) >= documentData.scrollHeight && !getGlobalState('loading')) {
            GeneralMixins.getApiData()
        }
    }

    let renderBeatmaps = []
    apiResult.forEach((bmap, index) => {
        renderBeatmaps.push(<li key={index}><Beatmap bmap={bmap}/></li>)
    })

    useEffect(() => {
        GeneralMixins.getUserRequestParams(searchParams)
        window.addEventListener("scroll", scrollHandler) // Add scroll Event
        return () => {
          window.removeEventListener("scroll", scrollHandler) // Delete scroll Event
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const LoadingAlertHandler = () => {
        if (loading === true) {
            message.loading({
                content: 'Loading...',
                AlertKey,
                duration: loading ? 1 : 0,
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
                });
            }
        })
        console.log("Notification Loaded.")
    }


    useEffect(() => {
        LoadingAlertHandler()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading])

    useEffect(() =>{
        GetNotification()
    }, [])

    return (
        <Fragment>
            <Navbar />
            <div className="container">
                <Searchbar />
                <ul className="beatmap-list">
                    {renderBeatmaps}
                </ul>
                <a href="#top" className="backToTop">
                    <i className="fa-solid fa-circle-arrow-up"></i>
                </a>
                <MusicPlayer />
            </div>
        </Fragment>
    )
}

export default Beatmaps
