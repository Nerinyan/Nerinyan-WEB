/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react"
import { useSpring, animated } from 'react-spring'
import { getGlobalState, setGlobalState, useGlobalState } from '../store'
import { Input, Slider, message } from 'antd'
import { GeneralMixins } from "."

import '../assets/css/components/searchbar.css'

var delay = null;


function Devbar() {
    const { Search } = Input

    const [apiJson] = useGlobalState("apiJson")
    const [apiURL] = useGlobalState("apiURL")

    const [devurl, setDevurl] = useState(apiURL)

    const [tmp, setTmp] = useState(0)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function devbarHandler(val, event) {
        event.stopPropagation()
        event.preventDefault()
        console.log(`gdgd -> ${devurl}`)
        setGlobalState("apiURL", devurl)
        
        requestNewBeatmapData(false)
    }

    function devbarChangeHandler(event) {
        event.stopPropagation()
        event.preventDefault()
        setDevurl(event.target.value)
        
        setTmp(new Date().getMilliseconds())
        // searchParamHandler("q", apiJson.query)
    }

    function requestNewBeatmapData(append=true) {
        setGlobalState("musicPlayerIsPlaying", false)
        setGlobalState("musicPlayerIsPaused", true)
        setGlobalState("apiResult", [])

        apiJson.page = String(0)

        GeneralMixins.getApiData(append)
    }

    return (
        <div className="searchbar-block">
            <Search className={"searchbar-input"} onSearch={devbarHandler} onChange={devbarChangeHandler} size="large" enterButton="CHANGE API URL" placeholder="change api url :3" allowClear="true" value={devurl}/>
            {/* <p className="searchbar-detail-reset" data-show={detailSearchChange === true ? true : false} onClick={(e) => searchbarDetailOptionsReset()}>Reset</p> */}
        </div>
    )
}

export default Devbar