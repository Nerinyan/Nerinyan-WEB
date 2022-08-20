import { createGlobalState } from "react-hooks-global-state"

const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState({
    firstLoad: true,
    loading: true,
    apiErrorCount: 0,
    detailSearch: false,
    apiURL: "https://api.nerinyan.moe",
    apiJson: {
        "extra": "",
        "ranked": "",
        "nsfw": "false",
        "video": "",
        "storyboard": "",
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
        "page": "0",
        "query": ""
    },
    apiResult: [],
    musicPlayerBeatmap: [],
    musicPlayerIsPlaying: false,
    musicPlayerIsPaused: false,
})

export { useGlobalState, setGlobalState, getGlobalState }
