import React, { useEffect, Fragment } from "react"
import { useSearchParams } from "react-router-dom"
import { Navbar, Footer, Devbar, Searchbar, Beatmap, GeneralMixins, MusicPlayer, Settings } from "../Components"
import { getGlobalState, useGlobalState, setGlobalState } from '../store'
import { message, notification } from 'antd' 
import { useTranslation } from "react-i18next"

import '../assets/css/components/beatmap.css'

function Beatmaps({ dev }) {
    const { t } = useTranslation()
    const [settingTab] = useGlobalState("settingTab")
    const [apiResult] = useGlobalState("apiResult")
    const [noResult] = useGlobalState("noResult")
    const [loading] = useGlobalState("loading")
    const [searchParams] = useSearchParams()
    const AlertKey = 'alertMsg'

    function scrollHandler() {
        const documentData = document.documentElement
        // console.log(documentData.scrollTop + documentData.clientHeight + (documentData.clientHeight*2) >= documentData.scrollHeight && !getGlobalState('loading') && !getGlobalState('firstLoad') )
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
        if (bmap.beatmaps.length > 0)
            renderBeatmaps.push(<li key={index}><Beatmap bmap={bmap}/></li>)
        else
            console.log(`Null Beatmaps Detected. -> ${bmap.id} ${bmap.artist} - ${bmap.title} Mapped by ${bmap.creator}`)
    })

    const portalCloseEventController = () => {
        document.body.addEventListener("click" , (e) => {
            if (!document.querySelector("#portal").contains(e.target) || !document.getElementsByClassName("ant-dropdown").contains(e.target)) {
                if (document.getElementById("beatmap-portal"))
                    document.getElementById("beatmap-portal").style.animation = "close forwards 200ms"
                
                //for animation
                setTimeout(() => {
                    setGlobalState('currentExpandedID', 0)
                }, 200)
            }
            if (!document.querySelector("#settings-area").contains(e.target)) {
                setGlobalState("settingTab", false)
            }
        })
    }

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
        portalCloseEventController()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading])

    return (
        <Fragment>
            <Navbar />
            <div className="container">
                {
                    dev &&
                    <Devbar/>
                }
                {/* <Searchbar/> */}
                <ul className="beatmap-list">
                    {noResult &&
                        <li className="notfound">
                            <p>
                                {t("oops")} <br/>
                                {t("search_results_do_not_exist")}
                            </p>
                        </li>
                    }
                    {!noResult &&
                        renderBeatmaps
                    }
                </ul>
                <div className="settings-button" onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    if (!settingTab) {
                        setGlobalState("settingTab", true)
                    }
                }}>
                    <i className="fa-solid fa-filter"></i>
                </div>
                <p href="#top" className="backToTop" onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    window.scrollTo({top: 0, behavior: 'smooth'})
                }}>
                    <i className="fa-solid fa-circle-arrow-up"></i>
                </p>
                <Settings />
                <MusicPlayer />
            </div>
            <Footer />
        </Fragment>
    )
}

export default Beatmaps
