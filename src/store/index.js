import { createGlobalState } from "react-hooks-global-state"

const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState({
    loading: true,
    apiErrorCount: 0,
    apiURL: "https://xiiov.com",
    apiJson: {
        "extra": "",
        "ranked": "",
        "nsfw": "",
        "video": "",
        "storyboard": "",
        "creator": "",
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
        "sort": "",
        "page": "0",
        "query": ""
    },
    apiResult: [],
    musicPlayerBeatmap: [],
    musicPlayerIsPlaying: false,
    musicPlayerIsPaused: false,
})

export { useGlobalState, setGlobalState, getGlobalState }
