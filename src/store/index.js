import { createGlobalState } from "react-hooks-global-state"

const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState({
    firstLoad: true,
    loading: true,
    filterMobile: false,
    filterOpen: true,
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
    ko1apiURL: "https://ko1.nerinyan.moe",
    ko2apiURL: "https://ko2.nerinyan.moe",
    apiSubURL: "https://subapi.nerinyan.moe",
    currentExpandedID: 0,
    currentExpandedData: {
        "id": 1949806,
        "artist": "James Landino & Kabuki",
        "artist_unicode": "James Landino & Kabuki",
        "creator": "Superboygamer",
        "favourite_count": 11,
        "hype": {
            "current": null,
            "required": null
        },
        "nsfw": false,
        "play_count": 231,
        "source": "osu!",
        "status": "ranked",
        "title": "Birdsong",
        "title_unicode": "Birdsong",
        "user_id": 16531365,
        "video": false,
        "availability": {
            "download_disabled": false,
            "more_information": null
        },
        "bpm": 165,
        "can_be_hyped": false,
        "discussion": {
            "enabled": true,
            "locked": false
        },
        "is_scoreable": true,
        "last_updated": "2023-08-04T23:53:25Z",
        "deleted_at": null,
        "legacy_thread_url": "https://osu.ppy.sh/community/forums/topics/1729534",
        "nominations_summary": {
            "current": 2,
            "required": 2
        },
        "ranked": 1,
        "ranked_date": "2023-08-12T14:23:56Z",
        "storyboard": false,
        "submitted_date": "2023-03-03T02:30:04Z",
        "tags": "electronic dance music videogame mappers' guild mg edm featured artist fa video game instrumental happy hardcore hybrid",
        "has_favourited": false,
        "beatmaps": [
            {
                "id": 4246373,
                "beatmapset_id": 1949806,
                "mode": "mania",
                "mode_int": 3,
                "status": "ranked",
                "ranked": 1,
                "total_length": 128,
                "max_combo": 792,
                "difficulty_rating": 1.64,
                "version": "[4K] Normal",
                "accuracy": 6.7,
                "ar": 5,
                "cs": 4,
                "drain": 6.9,
                "bpm": 165,
                "convert": false,
                "count_circles": 384,
                "count_sliders": 83,
                "count_spinners": 0,
                "hit_length": 128,
                "is_scoreable": true,
                "last_updated": "2023-08-04T23:53:27Z",
                "deleted_at": null,
                "passcount": 17,
                "playcount": 48,
                "checksum": "5f63aab4b1070d0233d7a9daeb52f50b",
                "user_id": 16531365,
                "osu_file": "James Landino & Kabuki - Birdsong (Superboygamer) [[4K] Normal].osu"
            },
            {
                "id": 4037917,
                "beatmapset_id": 1949806,
                "mode": "mania",
                "mode_int": 3,
                "status": "ranked",
                "ranked": 1,
                "total_length": 128,
                "max_combo": 1355,
                "difficulty_rating": 2.43,
                "version": "[4K] Advanced",
                "accuracy": 7,
                "ar": 5,
                "cs": 4,
                "drain": 7.2,
                "bpm": 165,
                "convert": false,
                "count_circles": 560,
                "count_sliders": 242,
                "count_spinners": 0,
                "hit_length": 128,
                "is_scoreable": true,
                "last_updated": "2023-08-04T23:53:27Z",
                "deleted_at": null,
                "passcount": 24,
                "playcount": 65,
                "checksum": "1c8ede7713cf168217e4309d3741e801",
                "user_id": 16531365,
                "osu_file": "James Landino & Kabuki - Birdsong (Superboygamer) [[4K] Advanced].osu"
            },
            {
                "id": 4037916,
                "beatmapset_id": 1949806,
                "mode": "mania",
                "mode_int": 3,
                "status": "ranked",
                "ranked": 1,
                "total_length": 128,
                "max_combo": 1742,
                "difficulty_rating": 3.16,
                "version": "[4K] Hard",
                "accuracy": 7.3,
                "ar": 5,
                "cs": 4,
                "drain": 7.5,
                "bpm": 165,
                "convert": false,
                "count_circles": 730,
                "count_sliders": 356,
                "count_spinners": 0,
                "hit_length": 128,
                "is_scoreable": true,
                "last_updated": "2023-08-04T23:53:26Z",
                "deleted_at": null,
                "passcount": 25,
                "playcount": 52,
                "checksum": "d6b15c11530907760e5fe3661a45df12",
                "user_id": 16531365,
                "osu_file": "James Landino & Kabuki - Birdsong (Superboygamer) [[4K] Hard].osu"
            },
            {
                "id": 4036787,
                "beatmapset_id": 1949806,
                "mode": "mania",
                "mode_int": 3,
                "status": "ranked",
                "ranked": 1,
                "total_length": 128,
                "max_combo": 2061,
                "difficulty_rating": 4.2,
                "version": "[4K] Insane",
                "accuracy": 7.6,
                "ar": 5,
                "cs": 4,
                "drain": 7.8,
                "bpm": 165,
                "convert": false,
                "count_circles": 886,
                "count_sliders": 499,
                "count_spinners": 0,
                "hit_length": 128,
                "is_scoreable": true,
                "last_updated": "2023-08-04T23:53:26Z",
                "deleted_at": null,
                "passcount": 30,
                "playcount": 66,
                "checksum": "91dc4b27367d00fa9150502bd406fab6",
                "user_id": 16531365,
                "osu_file": "James Landino & Kabuki - Birdsong (Superboygamer) [[4K] Insane].osu"
            }
        ],
        "description": null,
        "genre": {
            "id": null,
            "name": null
        },
        "language": {
            "id": null,
            "name": null
        },
            "ratings_string": null,
            "cache": {
            "video": true,
            "noVideo": false
        }
    },
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
