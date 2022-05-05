import React, { Fragment, useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { setGlobalState, useGlobalState } from '../store'
import { Input } from 'antd'
import { GeneralMixins } from "."

var delay = null;

function Searchbar() {
    const [apiJson] = useGlobalState("apiJson")
    const [searchParams] = useSearchParams()
    const [tmp, setTmp] = useState(0)

    function getUserRequestParams() {
        setGlobalState('loading', true)
        // Creator
        // if (searchParams.get("creator") !== null) tempApiJon.creator = Number(searchParams.get("creator")) API 서버에서 지원 안함(?)

        // Extra
        if (searchParams.get("e") !== null) {
            if (searchParams.get("e") === "video") apiJson.extra = "video"
            else if (searchParams.get("e") === "storyboard") apiJson.extra = "storyboard"
            else if (searchParams.get("e") === "storyboard.video" || searchParams.get("e") === "video.storyboard") apiJson.extra = "storyboard.video"
        } 

        // Mode
        if (searchParams.get("m") !== null) {
            if (searchParams.get("m") === "-1" || searchParams.get("m") === "any") apiJson.m = ""
            else if (searchParams.get("m") === "0" || searchParams.get("m") === "osu") apiJson.m = "0"
            else if (searchParams.get("m") === "1" || searchParams.get("m") === "taiko") apiJson.m = "1"
            else if (searchParams.get("m") === "2" || searchParams.get("m") === "catch") apiJson.m = "2"
            else if (searchParams.get("m") === "3" || searchParams.get("m") === "mania") apiJson.m = "3"
        }

        // Categories (status)
        if (searchParams.get("s") !== null) {
            if (searchParams.get("s") === "any") apiJson.ranked = "any"
            else if (searchParams.get("s") === "ranked") apiJson.ranked = "ranked"
            else if (searchParams.get("s") === "qualified") apiJson.ranked = "qualified"
            else if (searchParams.get("s") === "loved") apiJson.ranked = "loved"
            else if (searchParams.get("s") === "pending") apiJson.ranked = "pending"
            else if (searchParams.get("s") === "graveyard") apiJson.ranked = "graveyard"
        }

        // Sort by
        if (searchParams.get("sort") !== null) {
            if (searchParams.get("sort") === "title_desc") apiJson.sort = "title_desc"
            else if (searchParams.get("sort") === "title_asc") apiJson.sort = "title_asc"
            else if (searchParams.get("sort") === "artist_desc") apiJson.sort = "artist_desc"
            else if (searchParams.get("sort") === "artist_asc") apiJson.sort = "artist_asc"
            else if (searchParams.get("sort") === "difficulty_desc") apiJson.sort = "difficulty_desc"
            else if (searchParams.get("sort") === "difficulty_asc") apiJson.sort = "difficulty_asc"
            else if (searchParams.get("sort") === "ranked_desc") apiJson.sort = ""
            else if (searchParams.get("sort") === "ranked_asc") apiJson.sort = "ranked_asc"
            else if (searchParams.get("sort") === "updated_desc") apiJson.sort = "updated_desc"
            else if (searchParams.get("sort") === "updated_asc") apiJson.sort = "updated_asc"
            else if (searchParams.get("sort") === "plays_desc") apiJson.sort = "plays_desc"
            else if (searchParams.get("sort") === "plays_asc") apiJson.sort = "plays_asc"
            else if (searchParams.get("sort") === "favourites_desc") apiJson.sort = "favourites_desc"
            else if (searchParams.get("sort") === "favourites_asc") apiJson.sort = "favourites_asc"
        }

        // Explicit Content (nsfw)
        if (searchParams.get("nsfw") !== null) {
            if (searchParams.get("nsfw") === "1") apiJson.nsfw = "true"
            else if (searchParams.get("nsfw") === "0") apiJson.nsfw = "false"
        }

        if (searchParams.get("mid") !== null) apiJson.mi = searchParams.get("mid")
        
        GeneralMixins.getApiData() // get Beatmap Data From Nerinyan API
        setGlobalState('loading', false)
    }

    useEffect(() => {
        getUserRequestParams() // set user request search parameters.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function searchbarChangeHandler(event) {
        event.stopPropagation()
        event.preventDefault()
        clearTimeout(delay)
        apiJson.query = event.target.value
        apiJson.page = String(0)
        delay = setTimeout(function() {
            setGlobalState("apiResult", [])
            GeneralMixins.getApiData(false)
        }, 500)
    }

    function searchbarOptionChangeHandler(event, target, value) {
        event.stopPropagation()
        event.preventDefault()
        apiJson[target] = value

        setTmp(new Date().getMilliseconds())

        setGlobalState("apiResult", [])
        GeneralMixins.getApiData(false)
    }

    return (
        <Fragment>
            <Input onChange={searchbarChangeHandler} placeholder="Search...." />
            <ul className="searchbar-options">
                <li className="searchbar-option">
                    <strong>Mode</strong>
                    <ul>
                        <li onClick={(e) => searchbarOptionChangeHandler(e, 'm', '')}>
                            <p data-mode={apiJson.m} style={apiJson.m === '' ? {color: 'white'} : {color: 'hsl(var(--hsl-b1)'}}>Any</p>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandler(e, 'm', '0')}>
                            <p style={apiJson.m === '0' ? {color: 'white'} : {color: 'hsl(var(--hsl-b1)'}}>osu!</p>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandler(e, 'm', '1')}>
                            <p style={apiJson.m === '1' ? {color: 'white'} : {color: 'hsl(var(--hsl-b1)'}}>osu!taiko</p>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandler(e, 'm', '2')}>
                            <p style={apiJson.m === '2' ? {color: 'white'} : {color: 'hsl(var(--hsl-b1)'}}>osu!catch</p>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandler(e, 'm', '3')}>
                            <p style={apiJson.m === '3' ? {color: 'white'} : {color: 'hsl(var(--hsl-b1)'}}>osu!mania</p>
                        </li>
                    </ul>
                </li>
            </ul>
        </Fragment>
    )
}

export default Searchbar