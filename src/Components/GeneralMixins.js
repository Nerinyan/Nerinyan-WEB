import { scaleLinear, interpolateRgb } from 'd3'
import { setGlobalState, getGlobalState } from '../store'
import axios from "axios"

var Data = []

const difficultyColorSpectrum = scaleLinear().domain([0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9])
    .clamp(true)
    .range(['#4290FB', '#4FC0FF', '#4FFFD5', '#7CFF4F', '#F6F05C', '#FF8068', '#FF4E6F', '#C645B8', '#6563DE', '#18158E', '#000000'])
    .interpolate(interpolateRgb.gamma(2.2))

export function convertMode(mode) {
    switch (Number(mode)) {
        case 0:
            return "osu!"
        case 1:
            return "taiko"
        case 2:
            return "catch"
        case 3:
            return "mania"
        default:
            return "osu!"
    }
}

export function convertRankedStatusToText(ranked) {
    var temp
    switch (ranked) {
        default:
            temp = "UNKNOWN"
            break
        case -2:
            temp = "GRAVEYARD"
            break
        case -1:
            temp = "WIP"
            break
        case 0:
            temp = "PENDING"
            break
        case 1:
            temp = "RANKED"
            break
        case 2:
            temp = "APPROVED"
            break
        case 3:
            temp = "QUALIFIED"
            break
        case 4:
            temp = "LOVED"
            break
    }
    return temp
}

export function convertStatus(status) {
    switch (Number(status)) {
        case 4:
            return "Loved"
        case 3:
            return "Qualified"
        case 2:
            return "Approved"
        case 1:
            return "Ranked"
        case 0:
            return "Pending"
        case -1:
            return "WIP"
        case -2:
            return "Graveyard"
        default:
            return "Ranked"
    }
}

export function convertStatusWithIcon(status) {
    switch (Number(status)) {
        case 4:
            return "💟 Loved"
        case 3:
            return "✅ Qualified"
        case 2:
            return "🔥 Approved"
        case 1:
            return "⏫ Ranked"
        case 0:
            return "❔ Pending"
        case -1:
            return "🛠️ WIP"
        case -2:
            return "⚰️ Graveyard"
        default:
            return "⏫ Ranked"
    }
}

export function addCommas(nStr) {
    nStr += ''
    var x = nStr.split('.')
    var x1 = x[0]
    var x2 = x.length > 1 ? '.' + x[1] : ''
    var rgx = /(\d+)(\d{3})/
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, `$1,$2`)
    }
    return x1 + x2
}

export function secondsToTime(time){
    var hrs = ~~(time / 3600)
    var mins = ~~((time % 3600) / 60)
    var secs = ~~time % 60
    var ret = ""

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "")
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "")
    ret += "" + secs
    return ret
}

export function getDiffColor(rating) {
    rating += 0
    if (rating < 0.1) return '#AAAAAA';
    if (rating >= 9) return '#000000';
    return difficultyColorSpectrum(rating);
}

export function modeToicon(mode){
    switch (mode) {
        case 0:
            return (<i className="faa fa-extra-mode-osu"></i>)
        case 1:
            return (<i className="faa fa-extra-mode-taiko"></i>)
        case 2:
            return (<i className="faa fa-extra-mode-furits"></i>)
        case 3:
            return (<i className="faa fa-extra-mode-mania"></i>)
        default:
            break
    }
}


export function getUserRequestParams(searchParams) {
    setGlobalState('loading', true)
    var apiJson = getGlobalState('apiJson')

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
    
    setGlobalState("apiJson", apiJson)
    getApiData() // get Beatmap Data From Nerinyan API
    setGlobalState('loading', false)
}

export async function getApiData(append=true) {
    var apiErrorCount = getGlobalState("apiErrorCount")
    var apiURL = getGlobalState("apiURL")
    var apiJson = getGlobalState("apiJson")

    if (append === false) {
        Data = []
    }

    setGlobalState("loading", true)



    console.log(`request - ${JSON.stringify(apiJson)}`)

    for (let i = 0; i < 5; i++) {
        if (apiErrorCount > 2 || i > 2) {
            setGlobalState("apiURL", "https://ko2.nerinyan.moe")
            apiURL = "https://ko2.nerinyan.moe"
        }
        try{
            await axios.get(
                `${apiURL}/search`, {
                    params: {
                        b64: btoa(JSON.stringify(apiJson)),
                        ps: 60
                    }
                }
            ).then(function (response) {
                if (Data.length < 1) {
                    setGlobalState("apiResult", response.data)
                    Data = response.data
                } else {
                    for (var bmp in response.data) {
                        Data.push(response.data[bmp])
                    }
                    setGlobalState("apiResult", Data)
                }

            })
        }
        catch (e) {
            var tempErrorCount = apiErrorCount
            setGlobalState("apiErrorCount", ++tempErrorCount)
            console.log(e.message)
            continue;
        }
        break;
    }



    var temp = apiJson
    var tempPage = Number(temp.page)
    temp.page = String(++tempPage)
        
    setGlobalState("apiJson", temp)
    setGlobalState("loading", false)
    if (getGlobalState("firstLoad")) setGlobalState("firstLoad", false)

    if (getGlobalState("apiResult").length < 1) { 
        return true
    } else {
        return false
    }
}

export function generateDownloadURL(bid, hasVideo=true){
    var downloadURL = `https://proxy.nerinyan.moe/d/${bid}`
    if (!hasVideo) {
        downloadURL += "?noVideo=1"
    }
    return downloadURL
}

export function genegratePreviewURL(bid){
    var previewURL = `https://osu.pages.dev/preview#${bid}`
    return previewURL
}