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
        delay = setTimeout(function() {
            requestNewBeatmapData(false)
        }, 500)
    }

    function searchbarOptionChangeHandler(event, target, value) {
        event.stopPropagation()
        event.preventDefault()
        apiJson[target] = value

        setTmp(new Date().getMilliseconds())

        requestNewBeatmapData(false)
    }

    function searchbarOptionChangeHandlerForSortBy(event, target) {
        event.stopPropagation()
        event.preventDefault()
        if (apiJson.sort.includes(target)) {
            if (apiJson.sort.includes('desc')) apiJson.sort = `${target}_asc`
            else apiJson.sort = `${target}_desc`
        } else apiJson.sort = `${target}_desc`

        setTmp(new Date().getMilliseconds())

        requestNewBeatmapData(false)
    }

    function searchbarOptionChangeHandlerForExtra(event, target) {
        event.stopPropagation()
        event.preventDefault()
        if (target === "video") {
            if (apiJson.extra.includes('video')) {
                if (apiJson.extra.includes('storyboard')) apiJson.extra = apiJson.extra.replace('.video', '')
                else apiJson.extra = apiJson['extra'].replace('video', '')
            } else if ((apiJson.extra.includes('storyboard'))) apiJson.extra += ".video"
            else apiJson.extra += "video"
        } else 
        if (apiJson.extra.includes('storyboard')) {
            if (apiJson.extra.includes('video')) apiJson.extra = apiJson.extra.replace('storyboard.', '')
            else apiJson.extra = apiJson.extra.replace('storyboard', '')
        } else if (apiJson.extra.includes('video')) apiJson.extra = 'storyboard.video'
        else apiJson.extra = 'storyboard'

        setTmp(new Date().getMilliseconds())

        requestNewBeatmapData(false)
    }

    function requestNewBeatmapData(append=true) {
        setGlobalState("musicPlayerIsPlaying", false)
        setGlobalState("musicPlayerIsPaused", true)
        setGlobalState("apiResult", [])

        apiJson.page = String(0)

        GeneralMixins.getApiData(append)
    }

    return (
        <Fragment>
            <Input onChange={searchbarChangeHandler} placeholder="Search...." />
            <ul className="searchbar-options">
                <li className="searchbar-option">
                    <strong>Mode</strong>
                    <ul>
                        <li onClick={(e) => searchbarOptionChangeHandler(e, 'm', '')}>
                            <p data-active={apiJson.m === '' ? true : false}>Any</p>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandler(e, 'm', '0')}>
                            <p data-active={apiJson.m === '0' ? true : false}>osu!</p>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandler(e, 'm', '1')}>
                            <p data-active={apiJson.m === '1' ? true : false}>osu!taiko</p>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandler(e, 'm', '2')}>
                            <p data-active={apiJson.m === '2' ? true : false}>osu!catch</p>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandler(e, 'm', '3')}>
                            <p data-active={apiJson.m === '3' ? true : false}>osu!mania</p>
                        </li>
                    </ul>
                </li>
                <li className="searchbar-option">
                    <strong>Categories</strong>
                    <ul>
                        <li onClick={(e) => searchbarOptionChangeHandler(e, 'ranked', 'any')}>
                            <p data-active={(apiJson.ranked === 'any' || apiJson.ranked === '') ? true : false}>Any</p>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandler(e, 'ranked', 'ranked')}>
                            <p data-active={apiJson.ranked === 'ranked' ? true : false}>Ranked</p>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandler(e, 'ranked', 'qualified')}>
                            <p data-active={apiJson.ranked === 'qualified' ? true : false}>Qualified</p>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandler(e, 'ranked', 'loved')}>
                            <p data-active={apiJson.ranked === 'loved' ? true : false}>Loved</p>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandler(e, 'ranked', 'pending')}>
                            <p data-active={apiJson.ranked === 'pending' ? true : false}>Pending</p>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandler(e, 'ranked', 'graveyard')}>
                            <p data-active={apiJson.ranked === 'graveyard' ? true : false}>Graveyard</p>
                        </li>
                    </ul>
                </li>
                <li className="searchbar-option">
                    <strong>Explicit Content</strong>
                    <ul>
                        <li onClick={(e) => searchbarOptionChangeHandler(e, 'nsfw', 'false')}>
                            <p data-active={(apiJson.nsfw === 'false' || apiJson.nsfw === '') ? true : false}>Hide</p>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandler(e, 'nsfw', 'true')}>
                            <p data-active={apiJson.nsfw === 'true' ? true : false}>Show</p>
                        </li>
                    </ul>
                </li>
                <li className="searchbar-option">
                    <strong>Extra</strong>
                    <ul>
                        <li onClick={(e) => searchbarOptionChangeHandlerForExtra(e, 'video')}>
                            <p data-active={(apiJson.extra === 'storyboard.video' || apiJson.extra === 'video') ? true : false}>Has Video</p>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandlerForExtra(e, 'storyboard')}>
                            <p data-active={apiJson.extra === 'storyboard.video' || apiJson.extra === 'storyboard' ? true : false}>Has Storyboard</p>
                        </li>
                    </ul>
                </li>
                <li className="searchbar-option">
                    <strong>Sort by</strong>
                    <ul>
                        <li onClick={(e) => searchbarOptionChangeHandlerForSortBy(e, 'title')}>
                            <p data-active={apiJson.sort.includes('title') ? true : false}>Title</p>
                            <i data-asc={apiJson.sort.includes('title') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('title') ? '' : 'none')}}></i>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandlerForSortBy(e, 'artist')}>
                            <p data-active={apiJson.sort.includes('artist') ? true : false}>Artist</p>
                            <i data-asc={apiJson.sort.includes('artist') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('artist') ? '' : 'none')}}></i>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandlerForSortBy(e, 'difficulty')}>
                            <p data-active={apiJson.sort.includes('difficulty') ? true : false}>Difficulty</p>
                            <i data-asc={apiJson.sort.includes('difficulty') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('difficulty') ? '' : 'none')}}></i>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandlerForSortBy(e, 'ranked')}>
                            <p data-active={apiJson.sort.includes('ranked') || apiJson.sort === '' ? true : false}>Ranked</p>
                            <i data-asc={apiJson.sort.includes('ranked') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('ranked') ? '' : 'none')}}></i>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandlerForSortBy(e, 'updated')}>
                            <p data-active={apiJson.sort.includes('updated') ? true : false}>Updated</p>
                            <i data-asc={apiJson.sort.includes('updated') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('updated') ? '' : 'none')}}></i>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandlerForSortBy(e, 'plays')}>
                            <p data-active={apiJson.sort.includes('plays') ? true : false}>Plays</p>
                            <i data-asc={apiJson.sort.includes('plays') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('plays') ? '' : 'none')}}></i>
                        </li>
                        <li onClick={(e) => searchbarOptionChangeHandlerForSortBy(e, 'favourites')}>
                            <p data-active={apiJson.sort.includes('favourites') ? true : false}>Favourites</p>
                            <i data-asc={apiJson.sort.includes('favourites') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('favourites') ? '' : 'none')}}></i>
                        </li>
                    </ul>
                </li>
            </ul>
        </Fragment>
    )
}

export default Searchbar