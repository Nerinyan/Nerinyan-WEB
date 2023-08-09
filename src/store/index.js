import { createGlobalState } from "react-hooks-global-state"

const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState({
    firstLoad: true,
    loading: true,
    filterTab: false,
    explicitWarningHandle: false,
    downloadURLTmp: "",
    apiErrorCount: 0,
    noResult: false,
    notification: {},
    bmapIndex: 0,
    renderBeatmaps: [],
    zipList: [],
    Info: [],
    detailSearch: false,
    downloadDirect: false,
    apiURL: "https://api.nerinyan.moe",
    ko2apiURL: "https://ko2.nerinyan.moe",
    apiSubURL: "https://subapi.nerinyan.moe",
    currentExpandedID: 0,
    zipDone: false,
    globalNoVideo: false,
    globalNoBg: false,
    globalNoHitsound: false,
    globalNoStoryboard: false,
    detailSearchTmp: {
        "difficultyRating": {
            "min": 0,
            "max": 0
        },
        "accuracy": {
            "min": 0,
            "max": 0
        },
        "ar": {
            "min": 0,
            "max": 0
        },
        "cs": {
            "min": 0,
            "max": 0
        },
        "drain": {
            "min": 0,
            "max": 0
        },
        "bpm": {
            "min": 0,
            "max": 0
        }
    },
    apiJson: {
        "extra": "",
        "ranked": "",
        "nsfw": true,
        "option": "",
        "m": "",
        "totalLength": {
            "min": 0,
            "max": 0
        },
        "maxCombo": {
            "min": 0,
            "max": 0
        },
        "difficultyRating": {
            "min": 0,
            "max": 0
        },
        "accuracy": {
            "min": 0,
            "max": 0
        },
        "ar": {
            "min": 0,
            "max": 0
        },
        "cs": {
            "min": 0,
            "max": 0
        },
        "drain": {
            "min": 0,
            "max": 0
        },
        "bpm": {
            "min": 0,
            "max": 0
        },
        "sort": "ranked_desc",
        "page": 0,
        "query": ""
    },
    apiResult: [],
    musicPlayerBeatmap: [],
    musicPlayerIsPlaying: false,
    musicPlayerIsPaused: false,
})

export { useGlobalState, setGlobalState, getGlobalState }
