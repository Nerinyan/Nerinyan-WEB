/* eslint-disable array-callback-return */
import React from 'react'
import { scaleLinear, interpolateRgb } from 'd3'
import { setGlobalState, getGlobalState } from '../store'
import axios from "axios"


const modeMap = {
    0: "osu!",
    1: "taiko",
    2: "catch",
    3: "mania",
}

const rankedStatusMap = {
    '-3': "Unknown",
    '-2': "Graveyard",
    '-1': "WIP",
    '0': "Pending",
    '1': 'Ranked',
    '2': 'Approved',
    '3': 'Qualified',
    '4': 'Loved',
}

const iconMap = {
    0: (<i className="faa fa-extra-mode-osu"></i>),
    1: (<i className="faa fa-extra-mode-taiko"></i>),
    2: (<i className="faa fa-extra-mode-furits"></i>),
    3: (<i className="faa fa-extra-mode-mania"></i>),
}

const difficultyColorSpectrum = scaleLinear().domain([0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9])
    .clamp(true)
    .range(['#4290FB', '#4FC0FF', '#4FFFD5', '#7CFF4F', '#F6F05C', '#FF8068', '#FF4E6F', '#C645B8', '#6563DE', '#18158E', '#000000'])
    .interpolate(interpolateRgb.gamma(2.2))

const difficultyTextColorSpectrum = scaleLinear().domain([0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9])
    .clamp(true)
    .range(['#393939', '#393939', '#393939', '#393939', '#393939', '#393939', '#0e0e0e', '#000000', '#000000', '#000000', '#c5c5c5'])
    .interpolate(interpolateRgb.gamma(2.2))


export function convertMode(mode) {
    return modeMap[Number(mode)] || modeMap[0]
}

export function convertRankedStatusToText(ranked) {
    return rankedStatusMap[String(ranked)].toUpperCase() || rankedStatusMap["-3"].toUpperCase()
}

export function addCommas(nStr) {
    const formattedNumber = Number(nStr).toLocaleString('en-US')
    return formattedNumber
}

export function DateFormat(date) {
    const tmp = new Date(`${date}`)

    const months = [
        'Jan', 'Feb', 'Mar',
        'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep',
        'Oct', 'Nov', 'Dec'
    ]

    return `${tmp.getDate()} ${months[tmp.getMonth()]} ${tmp.getFullYear()}`
}

export function timeSince(date) {
    if (typeof date === "object") {
        date = date.getTime() / 1000
    }

    const now = new Date()
    const currentTime = now / 1000
    const seconds = Math.floor(currentTime - date)

    const intervals = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    }

    for (const [unit, secondsPerUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsPerUnit)
        if (interval > 1) {
            return interval + ` ${unit}s ago`
        } else if (interval === 1) {
            return `a ${unit} ago`
        }
    }

    return Math.floor(seconds) + " seconds ago"
}

export function secondsToTime(time, odometer = false) {
    const hrs = Math.floor(time / 3600)
    const mins = Math.floor((time % 3600) / 60)
    const secs = Math.floor(time % 60)

    const pad = value => (value < 10 ? "0" + value : "" + value)

    let ret = ""

    if (hrs > 0) {
        ret += `${hrs}${odometer ? "" : ":"}${pad(mins)}`
    } else {
        ret += `${mins}`
    }

    ret += `${odometer ? "" : ":"}${pad(secs)}`
    return ret
}

export function setCookie(name, value, daysToExpire=99999) {
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + daysToExpire)
  
    const cookieValue = encodeURIComponent(value) + (daysToExpire ? `; expires=${expirationDate.toUTCString()}` : '')
  
    document.cookie = `${name}=${cookieValue}; path=/`
}

export function getCookie(name) {
    const cookies = document.cookie.split(';')
    
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        
        if (cookieName === name) {
            return decodeURIComponent(cookieValue)
        }
    }
    
    return null
}

export function calcSuccessRate(pass, play) {
    if (play === 0) {
        return 0
    }

    const result = (pass / play) * 100
    return parseFloat(result.toFixed(2))
}

export function getDiffTextColor(rating) {
    if (rating < 0.1) return '#393939'
    if (rating >= 9) return '#d2d2d2'

    return difficultyTextColorSpectrum(rating)
}

export function getDiffColor(rating) {
    if (rating < 0.1) return '#AAAAAA'
    if (rating >= 9) return '#000000'

    return difficultyColorSpectrum(rating)
}

export function modeToicon(mode){
    return iconMap[mode]
}

export function getUserRequestParams(searchParams) {
    setGlobalState('loading', true)
    const apiJson = getGlobalState('apiJson')
    const uri = "/main"
    const params = []

    const paramMap = {
        m: {
            values: [
                "any", //any
                "osu", "taiko", "catch", "mania", //string
                "0", "1", "2", "3", // int
            ],
            key: "m"
        },
        s: {
            values: ["any", "", "ranked", "qualified", "loved", "pending", "wip", "graveyard"],
            key: "ranked",
            multi: true
        },
        nsfw: {
            values: ["1", "true", "0", "false"],
            key: "nsfw",
            type: "boolean"
        },
        e: {
            values: [
                "video", "storyboard",
                "storyboard.video", "video.storyboard"
            ],
            key: "extra"
        },
        sort: {
            values: [
                "title_desc", "title_asc",
                "artist_desc", "artist_asc", 
                "difficulty_desc", "difficulty_asc",
                "ranked_desc", "ranked_asc", 
                "updated_desc", "updated_asc",
                "plays_desc", "plays_asc", 
                "favourites_desc", "favourites_asc"
            ],
            key: "sort"
        },
        q: {
            key: "query"
        }
    }

    for (const key in paramMap) {
        const param = paramMap[key]
        const value = searchParams.get(key)

        if (value !== null) {
            if (key === "s" && (value === "any" || value === "")) {
                apiJson.ranked = "all"
                params.push({ [param.key]: "all" })
            } else {
                apiJson[param.key] = param.type === "boolean" ? value === "1" || value === "true" : value
                params.push({ [param.key]: apiJson[param.key] })
            }
        }
    }

    console.log('detact Params -', params)

    const paramString = params.map((v, k) => {
        const key = Object.keys(v)[0]
        const value = Array.isArray(v[key]) ? v[key].join(",") : v[key]
        return `${k === 0 ? '?' : '&'}${key === 'ranked' ? 's' : key}=${value}`
    }).join('')

    const newUri = `${uri}${paramString}`
    window.history.replaceState("", document.title, newUri)

    setGlobalState("apiJson", apiJson)
    getApiData()
    setGlobalState('loading', false)
    return newUri
}

const MAX_ERROR_COUNT = 2
const MAX_RETRY_COUNT = 5
const PAGE_SIZE = 60
let Data = []

export async function getApiData(append=true) {
    let apiErrorCount = getGlobalState("apiErrorCount")
    let apiURL = getGlobalState("apiURL")
    let apiJson = getGlobalState("apiJson")

    if (append === false) {
        Data = []
    }
  
    if (Data.length < (apiJson.page * PAGE_SIZE)) {
        return false
    }

    setGlobalState("loading", true)

    for (let retryCount = 0; retryCount < MAX_RETRY_COUNT; retryCount++) {
        try {
            const response = await axios.get(`${apiURL}/search`, {
                params: {
                    b64: btoa(JSON.stringify(apiJson)),
                    ps: PAGE_SIZE,
                },
            })

            if (Data.length < 1) {
                if (response.data.length <= 0) {
                    setGlobalState("noResult", true);
                } else {
                    setGlobalState("apiResult", response.data)
                    Data = response.data
                }
            } else {
                response.data.forEach((bmp) => {
                    if (bmp.beatmaps.length > 0) {
                        Data.push(bmp)
                    }
                })
                setGlobalState("apiResult", Data)
            }
            setGlobalState("noResult", false)
        } catch (error) {
            setGlobalState("noResult", true)
            apiErrorCount++
            setGlobalState("apiErrorCount", apiErrorCount)
            
            if (apiErrorCount > MAX_ERROR_COUNT || retryCount >= MAX_RETRY_COUNT - 1) {
                setGlobalState("apiURL", "https://ko2.nerinyan.moe")
                apiURL = "https://ko2.nerinyan.moe"
            }
            
            continue
        }
        break
    }

    const temp = apiJson
    temp.page = Number(temp.page) + 1
        
    setGlobalState("apiJson", temp)
    setGlobalState("loading", false)

    if (getGlobalState("firstLoad")) setGlobalState("firstLoad", false)
    return getGlobalState("apiResult").length < 1
}

export function downloadBeatmap() {
    // Download Beatmap handler for Explicit beatmap
    const url = getGlobalState("downloadURLTmp")
    
    if (!getGlobalState("downloadDirect")) {
        window.open(url, '_blank')
    } else {
        window.open(url)
    }
}

export function generateDownloadURL(bid) {
    // Generate Download url handler
    const params = ['noVideo', 'noBg', 'noHitsound', 'noStoryboard']
    const NoList = [getGlobalState("globalNoVideo"), getGlobalState("globalNoBg"), getGlobalState("globalNoHitsound"), getGlobalState("globalNoStoryboard")]

    const parameter = params
        .filter((param, i) => NoList[i])
        .map((param) => `${param}=1`)
        .join('&')

    return `https://api.nerinyan.moe/d/${bid}${parameter ? '?' + parameter : ''}`
}

export function generatePreviewURL(bid, mode) {
    // Generate Preview url handler
    const previewURL = mode === 0
        ? `https://preview.nerinyan.moe/?b=${bid}`
        : `https://peppy.pages.dev/preview#${bid}`

    return previewURL
}