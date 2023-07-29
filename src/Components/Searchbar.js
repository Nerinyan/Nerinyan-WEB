/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react"
import { useSpring, animated } from 'react-spring'
import { getGlobalState, setGlobalState, useGlobalState } from '../store'
import { Input, Slider, message } from 'antd'
import { GeneralMixins } from "."

import '../assets/css/components/searchbar.css'

var delay = null;


function Searchbar() {
    const { Search } = Input

    const [apiJson] = useGlobalState("apiJson")

    const [tmp, setTmp] = useState(0)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function searchHandler(val, event) {
        event.stopPropagation()
        event.preventDefault()
        
        requestNewBeatmapData(false)
        searchParamHandler("q", apiJson.query)
    }

    function searchbarChangeHandler(event) {
        event.stopPropagation()
        event.preventDefault()
        apiJson.query = event.target.value
        
        setTmp(new Date().getMilliseconds())
        // searchParamHandler("q", apiJson.query)
    }

    function searchParamHandler(target, value) {
        var uri = "/main"
        if (window.location.search === "") {
            uri += `?${target}=${value}`    
        } else {
            var tmp = window.location.search.replace("?", "").split("&")
            var searchs = []

            tmp.map(function (v) {
                    if (v.includes(`${target}=`))
                        return searchs.push(`${target}=${value}`)
                    else
                        return searchs.push(v)
                })

            if (!window.location.search.includes(`${target}=`)) {
                searchs.push(`${target}=${value}`)
            }
            
            searchs.map(function (v, k) {
                if (k === 0)
                    uri += "?"
                else
                    uri += "&"
                return uri += v
            })
        }

        window.history.replaceState("", document.title, uri);
    }

    function requestNewBeatmapData(append=true) {
        setGlobalState("musicPlayerIsPlaying", false)
        setGlobalState("musicPlayerIsPaused", true)
        setGlobalState("apiResult", [])

        apiJson.page = 0

        GeneralMixins.getApiData(append)
    }

    return (
        <div className="searchbar-block">
            <Search className={"searchbar-input"} onSearch={searchHandler} onChange={searchbarChangeHandler} size="large" enterButton="Search" placeholder="Search...." allowClear="true" value={apiJson.query}/>
            {/* <p className="searchbar-detail-reset" data-show={detailSearchChange === true ? true : false} onClick={(e) => searchbarDetailOptionsReset()}>Reset</p> */}
        </div>
    )
}

export default Searchbar