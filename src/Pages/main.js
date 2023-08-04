import React, { Fragment, useState, useEffect } from "react"
import { getGlobalState, useGlobalState } from '../store'
import { GeneralMixins, Navbar, Footer } from "../Components"
import { useTranslation } from "react-i18next"
import axios from "axios"

function MainPage() {
    const { t } = useTranslation()
    const [Info, setInfo] = useState({})

    const [tmp, setTmp] = useState(0)

    function getServerData(storageURL) {
        axios.get(
            `${storageURL}/status`
        ).then(function (response) {
            setInfo(response.data)
        })

        setTmp(new Date().getMilliseconds())
    }

    useEffect(() => {
        getServerData(getGlobalState("apiURL"))
        // if (reqLoop !== undefined)
        //     console.log("clear interval")
        //     clearInterval(reqLoop)
        // setReqLoop(setInterval(() => {
        //     console.log(`req -> ${storageURL}/status`)
        //     axios.get(
        //         `${storageURL}/status`
        //     ).then(function (response) {
        //         setInfo(response.data)
        //     })
        //     setTmp(new Date().getMilliseconds())
        // }, 2000))
    }, [])

    return (
        <Fragment>
            <Navbar/>
            <div className="container">
                <div className="logo">
                    <h2>
                        logo
                    </h2>
                    <h3>
                        stable osu beatmap mirror
                    </h3>
                </div>
                <div className="features">
                    <ul>
                        <li>

                        </li>
                    </ul>
                </div>

                <div className="storages">
                    <ul className="storage-switch">
                        <li onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()

                            getServerData(getGlobalState("apiURL"))
                        }}>
                            Main Server (South Korea, busan)
                        </li>
                        <li onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()

                            getServerData(getGlobalState("ko2apiURL"))
                        }}>
                            Sub Server (South Korea, Gyeonggi)
                        </li>
                    </ul>
                    <ul className="storage-info">
                        <li className="beamapsets">
                            <strong>
                                count
                            </strong>
                            <p>BeatmapSets</p>
                        </li>
                        <li className="cached">
                            <strong>
                            {Info.fileSize} ({GeneralMixins.addCommas(Info.fileCount)} files)
                            </strong>
                            <p>BeatmapSets</p>
                        </li>
                    </ul>
                </div>
            </div>
            <Footer/>
        </Fragment>
    )
}

export default MainPage
