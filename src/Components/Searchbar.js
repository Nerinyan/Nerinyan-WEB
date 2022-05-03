import React, { Fragment, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { setGlobalState, useGlobalState } from '../store'
import { Input } from 'antd'
import { GeneralMixins } from "."

var delay = null;

function Searchbar() {
    const [apiJson] = useGlobalState("apiJson")
    const [searchParams] = useSearchParams()
    var tempApiJon = apiJson

    function getUserRequestParams() {
        setGlobalState('loading', true)
        // Creator
        // if (searchParams.get("creator") !== null) tempApiJon.creator = Number(searchParams.get("creator")) API 서버에서 지원 안함(?)

        // Extra
        if (searchParams.get("e") !== null) {
            if (searchParams.get("e") === "video") tempApiJon.extra = "video"
            else if (searchParams.get("e") === "storyboard") tempApiJon.extra = "storyboard"
            else if (searchParams.get("e") === "storyboard.video" || searchParams.get("e") === "video.storyboard") tempApiJon.extra = "storyboard.video"
        } 

        // Mode
        if (searchParams.get("m") !== null) {
            if (searchParams.get("m") === "-1" || searchParams.get("m") === "any") tempApiJon.m = ""
            else if (searchParams.get("m") === "0" || searchParams.get("m") === "osu") tempApiJon.m = "0"
            else if (searchParams.get("m") === "1" || searchParams.get("m") === "taiko") tempApiJon.m = "1"
            else if (searchParams.get("m") === "2" || searchParams.get("m") === "catch") tempApiJon.m = "2"
            else if (searchParams.get("m") === "3" || searchParams.get("m") === "mania") tempApiJon.m = "3"
        }

        // Categories (status)
        if (searchParams.get("s") !== null) {
            if (searchParams.get("s") === "any") tempApiJon.ranked = "any"
            else if (searchParams.get("s") === "ranked") tempApiJon.ranked = "ranked"
            else if (searchParams.get("s") === "qualified") tempApiJon.ranked = "qualified"
            else if (searchParams.get("s") === "loved") tempApiJon.ranked = "loved"
            else if (searchParams.get("s") === "pending") tempApiJon.ranked = "pending"
            else if (searchParams.get("s") === "graveyard") tempApiJon.ranked = "graveyard"
        }

        // Sort by
        if (searchParams.get("sort") !== null) {
            if (searchParams.get("sort") === "title_desc") tempApiJon.sort = "title_desc"
            else if (searchParams.get("sort") === "title_asc") tempApiJon.sort = "title_asc"
            else if (searchParams.get("sort") === "artist_desc") tempApiJon.sort = "artist_desc"
            else if (searchParams.get("sort") === "artist_asc") tempApiJon.sort = "artist_asc"
            else if (searchParams.get("sort") === "difficulty_desc") tempApiJon.sort = "difficulty_desc"
            else if (searchParams.get("sort") === "difficulty_asc") tempApiJon.sort = "difficulty_asc"
            else if (searchParams.get("sort") === "ranked_desc") tempApiJon.sort = ""
            else if (searchParams.get("sort") === "ranked_asc") tempApiJon.sort = "ranked_asc"
            else if (searchParams.get("sort") === "updated_desc") tempApiJon.sort = "updated_desc"
            else if (searchParams.get("sort") === "updated_asc") tempApiJon.sort = "updated_asc"
            else if (searchParams.get("sort") === "plays_desc") tempApiJon.sort = "plays_desc"
            else if (searchParams.get("sort") === "plays_asc") tempApiJon.sort = "plays_asc"
            else if (searchParams.get("sort") === "favourites_desc") tempApiJon.sort = "favourites_desc"
            else if (searchParams.get("sort") === "favourites_asc") tempApiJon.sort = "favourites_asc"
        }

        // Explicit Content (nsfw)
        if (searchParams.get("nsfw") !== null) {
            if (searchParams.get("nsfw") === "1") tempApiJon.nsfw = "true"
            else if (searchParams.get("nsfw") === "0") tempApiJon.nsfw = "false"
        }

        if (searchParams.get("mid") !== null) tempApiJon.mi = searchParams.get("mid")
        
        setGlobalState("apiJson", tempApiJon) // update api request body
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
        tempApiJon.query = event.target.value
        tempApiJon.page = String(0)
        setGlobalState("apiJson", tempApiJon)
        delay = setTimeout(function() {
            setGlobalState("apiResult", [])
            GeneralMixins.getApiData(false)
        }, 500)
    }

    return (
        <Fragment>
            <Input onChange={searchbarChangeHandler} placeholder="Search...." />
        </Fragment>
    )
}

export default Searchbar