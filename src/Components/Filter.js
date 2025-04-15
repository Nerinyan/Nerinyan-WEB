import React, { useEffect, useState } from "react"
import { getGlobalState, setGlobalState, useGlobalState } from '../store'
import { Slider, message, Modal, Menu } from 'antd'
import { useTranslation } from "react-i18next"
import { GeneralMixins } from "../lib"

import JSZip from "jszip"
import { saveAs } from "file-saver"

import '../assets/css/components/filter.css'

// eslint-disable-next-line no-unused-vars

var delay = null

function Filter() {
    const { t } = useTranslation()

    const [filterMobile] = useGlobalState("filterMobile")
    const [filterOpen] = useGlobalState("filterOpen")
    const [selectedFilters, setSelectedFilters] = useState([])
    const [openedFilters, setOpenedFilters] = useState(["mode", "ranked", "sort"])

    const [apiJson] = useGlobalState("apiJson")
    const [detailSearchTmp] = useGlobalState("detailSearchTmp")


    const [tmp, setTmp] = useState(0)

    const [diffSort] = useGlobalState("diffSort")

    const [globalDirectDownload] = useGlobalState("downloadDirect")
    const [globalNoVideo] = useGlobalState("globalNoVideo")
    const [globalNoBg] = useGlobalState("globalNoBg")
    const [globalNoHitsound] = useGlobalState("globalNoHitsound")
    const [globalNoStoryboard] = useGlobalState("globalNoStoryboard")

    const [zipList] = useGlobalState("zipList")


    function searchParamHandler(target, value) {
        var uri = "/main"
        if (window.location.search === "") {
            uri += `?${target}=${value}`    
        } else {
            var tmp = window.location.search.replace("?", "").split("&")
            var searchs = []
            var selectedFiltersTmp = []

            tmp.map(function (v) {
                    if (v.includes(`${target}=`)) {
                        return searchs.push(`${target}=${value}`)
                    }
                    else {
                        return searchs.push(v)
                    }
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

    function filterDefaultHandler() {
        var tmp = []
        var filter_list = ["m", "ranked", "nsfw", "extra", "sort", "download"]

        filter_list.map((value, index) => {
            var valueTmp = apiJson[`${value}`]

            if (value !== "download") {
                if (valueTmp === "") {
                    if (value === "m") tmp.push(`${value}-any`)   
                    if (value === "ranked") tmp.push(`${value}-has_leaderboard`)
                    if (value === "extra") {
                        tmp.push(`${value}-storyboard`)
                        tmp.push(`${value}-video`)
                    }
                } else {
                    // for sort_by
                    if (value === "sort") {
                        valueTmp = valueTmp.replace("_desc", "")
                        valueTmp = valueTmp.replace("_asc", "")
                    }

                    tmp.push(`${value}-${valueTmp}`)
                }
            } else {
                if (globalDirectDownload) tmp.push(`download-direct`)
                if (globalNoVideo) tmp.push(`download-novideo`)
                if (globalNoBg) tmp.push(`download-nobg`)
                if (globalNoHitsound) tmp.push(`download-nohitsound`)
                if (globalNoStoryboard) tmp.push(`download-nostoryboard`)
            }
        })

        console.log(tmp)
        setSelectedFilters(tmp)
    }

    function filterOptionOpenhadler(keys) {
        setOpenedFilters(keys)
    }

    function optionHandler(event, target, value) {
        event.stopPropagation()
        event.preventDefault()
        if (target === "ranked") {
            if (value === "any" || value === "") {
                apiJson[target] = value
                if (value === "any") apiJson[target] = "all"
            }
            else {
                apiJson[target] = apiJson[target].replace('all', '')
                if (apiJson[target].includes(value)) {
                    if (apiJson[target][apiJson[target].indexOf(value) - 1] === ',')
                        apiJson[target] = apiJson[target].replace(`,${value}`, "")
                    else apiJson[target] = apiJson[target].replace(value, "")
                } else {
                    if (apiJson[target] === "") apiJson[target] += value
                    else apiJson[target] += `,${value}`
                }
                do {
                    if (apiJson[target][0] === ",") apiJson[target] = apiJson[target].slice(1)
                } while (apiJson[target][0] === ",")
            }
        } else {
            if (apiJson[target] === value) return
            apiJson[target] = value
            
        }

        var selectedTmp = selectedFilters
        if (target === "ranked") {
            if (value === "any" || value === "") {
                selectedTmp = selectedTmp.filter(item => !item.startsWith(`${target}-`))
                if (value === "") selectedTmp.push(`${target}-has_leaderboard`)
                else selectedTmp.push(`${target}-${value}`)
            }
            else {
                if (selectedTmp.includes("ranked-any")) selectedTmp.splice(selectedTmp.indexOf("ranked-any"), 1)
                if (selectedTmp.includes("ranked-has_leaderboard")) selectedTmp.splice(selectedTmp.indexOf("ranked-has_leaderboard"), 1)

                if(selectedTmp.includes(`ranked-${value}`)) {
                    selectedTmp.splice(selectedTmp.indexOf(`ranked-${value}`), 1)

                    if (!selectedTmp.some(item => item.startsWith("ranked-"))) selectedTmp.push("ranked-has_leaderboard")
                }
                else selectedTmp.push(`ranked-${value}`)
            }
        } else {
            selectedTmp = selectedTmp.filter(item => !item.startsWith(`${target}-`))
            selectedTmp.push(`${target}-${value === "" ? "any" : value}`)
        }
        setSelectedFilters(selectedTmp)

        setTmp(new Date().getMilliseconds())
        searchParamHandler(target === "ranked" ? "s" : target, apiJson[target] === "all" ? "any" : apiJson[target])
        requestNewBeatmapData(false)

        console.log(`filter list -> ${selectedFilters}`)
    }

    function optionHandlerForSortBy(event, target) {
        event.stopPropagation()
        event.preventDefault()

        var selectedTmp = selectedFilters
        selectedTmp = selectedTmp.filter(item => !item.startsWith(`sort-`))

        if (target.includes('difficulty')) {
            selectedTmp = selectedFilters
            switch (diffSort) {
                case 'none':
                    setGlobalState("diffSort", "desc")
                    selectedTmp.push(`sort-${target}`)
                    setSelectedFilters(selectedTmp)
                    break;
                case 'desc':
                    setGlobalState("diffSort", "asc")
                    selectedTmp.push(`sort-${target}`)
                    setSelectedFilters(selectedTmp)
                    break;
                case 'asc':
                    setGlobalState("diffSort", "none")
                    selectedTmp = selectedTmp.filter(item => !item.startsWith(`sort-difficulty`))
                    setSelectedFilters(selectedTmp)
                    break;
                default:
                    setGlobalState("diffSort", "desc")
                    break;
            }
            return requestNewBeatmapData(false)
        }


        if (apiJson.sort.includes(target)) {
            if (apiJson.sort.includes('desc')) {
                apiJson.sort = `${target}_asc`
            }
            else {
                apiJson.sort = `${target}_desc`
            }
        } else {
            apiJson.sort = `${target}_desc`
        }

        selectedTmp.push(`sort-${target}`)

        setSelectedFilters(selectedTmp)

        setTmp(new Date().getMilliseconds())
        searchParamHandler('sort', apiJson.sort === "ranked_desc" ? "": apiJson.sort )
        requestNewBeatmapData(false)
    }

    function optionHandlerForExtra(event, target) {
        event.stopPropagation()
        event.preventDefault()

        var selectedTmp = selectedFilters
        selectedTmp = selectedTmp.filter(item => !item.startsWith(`extra-`))

        if (target === "video") {
            // Already video is enabled
            if (apiJson.extra.includes('video')) {
                // if storyboard is enabled
                if (apiJson.extra.includes('storyboard')) apiJson.extra = apiJson.extra.replace('.video', '')
                // if storyboard is disabled
                else apiJson.extra = apiJson['extra'].replace('video', '')
            // Already video is disabled and storyboard is enabled
            } else if ((apiJson.extra.includes('storyboard'))) apiJson.extra += ".video"
            // Already video and storyboard are disabled
            else {
                apiJson.extra += "video"
            }
        } else 
        // Already storyboard is enabled
        if (apiJson.extra.includes('storyboard')) {
            // if video is enabled
            if (apiJson.extra.includes('video')) apiJson.extra = apiJson.extra.replace('storyboard.', '')
            // if video is disabled
            else apiJson.extra = apiJson.extra.replace('storyboard', '')
            // Already storyboard is disabled and video is enabled
        } else if (apiJson.extra.includes('video')) apiJson.extra = 'storyboard.video'
        // Already storyboard and video are disabled
        else apiJson.extra = 'storyboard'

        if (apiJson.extra.includes("video")) selectedTmp.push(`extra-video`)
        if (apiJson.extra.includes("storyboard")) selectedTmp.push(`extra-storyboard`)
        setSelectedFilters(selectedTmp)

        setTmp(new Date().getMilliseconds())
        searchParamHandler('e', apiJson.extra)
        requestNewBeatmapData(false)    
    }

    const detailValueHadlerForAR = (value) => {
        apiJson.ar.min = value[0]
        apiJson.ar.max = value[1]

        detailSearchTmp.ar.min = value[0]
        detailSearchTmp.ar.max = value[1]
    }

    const detailValueHadlerForCS = (value) => {
        apiJson.cs.min = value[0]
        apiJson.cs.max = value[1]

        detailSearchTmp.cs.min = value[0]
        detailSearchTmp.cs.max = value[1]
    }

    const detailValueHadlerForOD = (value) => {
        apiJson.accuracy.min = value[0]
        apiJson.accuracy.max = value[1]

        detailSearchTmp.accuracy.min = value[0]
        detailSearchTmp.accuracy.max = value[1]
    }

    const detailValueHadlerForHP = (value) => {
        apiJson.drain.min = value[0]
        apiJson.drain.max = value[1]

        detailSearchTmp.drain.min = value[0]
        detailSearchTmp.drain.max = value[1]
    }

    const detailValueHadlerForBPM = (value) => {
        apiJson.bpm.min = value[0]
        apiJson.bpm.max = value[1]

        detailSearchTmp.bpm.min = value[0]
        detailSearchTmp.bpm.max = value[1]
    }

    const detailValueHadlerForSR = (value) => {
        apiJson.difficultyRating.min = value[0]
        apiJson.difficultyRating.max = value[1]

        detailSearchTmp.difficultyRating.min = value[0]
        detailSearchTmp.difficultyRating.max = value[1]
    }

    const detailValueHandler = (value) => {
        clearTimeout(delay)
        delay = setTimeout(function() {
            requestNewBeatmapData(false)
        }, 800)
    }

    function optionHandlerForDownload(event) {
        event.stopPropagation()
        event.preventDefault()

        var selectedTmp = selectedFilters

        setGlobalState("downloadDirect", !globalDirectDownload)

        if (!selectedTmp.includes("download-direct")) {
            selectedTmp.push(`download-direct`)
            setSelectedFilters(selectedTmp)
        } else {
            selectedTmp.splice(selectedTmp.indexOf("download-direct"), 1)
        }

        setTmp(new Date().getMilliseconds())
    }

    function optionHandlerForDlOptions(event, target) {
        event.stopPropagation()
        event.preventDefault()

        var selectedTmp = selectedFilters

        switch (target) {
            case "video":
                setGlobalState("globalNoVideo", !globalNoVideo)

                if (!selectedTmp.includes("download-novideo")) {
                    selectedTmp.push(`download-novideo`)
                    setSelectedFilters(selectedTmp)
                } else {
                    selectedTmp.splice(selectedTmp.indexOf("download-novideo"), 1)
                }
                break
            case "background":
                setGlobalState("globalNoBg", !globalNoBg)

                if (!selectedTmp.includes("download-nobg")) {
                    selectedTmp.push(`download-nobg`)
                    setSelectedFilters(selectedTmp)
                } else {
                    selectedTmp.splice(selectedTmp.indexOf("download-nobg"), 1)
                }
                break
            case "hitsound":
                setGlobalState("globalNoHitsound", !globalNoHitsound)

                if (!selectedTmp.includes("download-nohitsound")) {
                    selectedTmp.push(`download-nohitsound`)
                    setSelectedFilters(selectedTmp)
                } else {
                    selectedTmp.splice(selectedTmp.indexOf("download-nohitsound"), 1)
                }
                break
            case "storyboard":
                setGlobalState("globalNoStoryboard", !globalNoStoryboard)

                if (!selectedTmp.includes("download-nostoryboard")) {
                    selectedTmp.push(`download-nostoryboard`)
                    setSelectedFilters(selectedTmp)
                } else {
                    selectedTmp.splice(selectedTmp.indexOf("download-nostoryboard"), 1)
                }
                break
            default:
                break
        }

        setTmp(new Date().getMilliseconds())
    }
    
    function zipDownloadHandler(e, selectedOnly=true) {
        e.stopPropagation()
        e.preventDefault()
        if (zipList.length === 0 && selectedOnly) {
            return message.warning(t("not_selected_to_download"))
        }
        message.info(t("please_wait_to_download"), 10)
        if (!selectedOnly) {
            var paramList = []
            if (globalNoVideo) paramList.push(true)
            else paramList.push(false)
            if (globalNoBg) paramList.push(true)
            else paramList.push(false)
            if (globalNoHitsound) paramList.push(true)
            else paramList.push(false)
            if (globalNoStoryboard) paramList.push(true)
            else paramList.push(false)
            var tmp = []
            getGlobalState("apiResult").map(function(bmap, i) {
                if (i < 30) {
                    var url = GeneralMixins.generateDownloadURL(bmap.id, paramList)
                    var bname = `${bmap.id} ${bmap.artist} - ${bmap.title}.osz`
                    tmp.push({'name': bname, 'url': url})
                }
            })
            setGlobalState("zipList", tmp)
        }

        let ec = 0
        const zip = new JSZip()
        
        const download = async (item) => {
            let tmp = await fetch(item.url)
                .then((response) => {
                    const NOT_ALLOWED_FILE_NAME = /([\\/:*?"<>|])/gi
                    const FILE_NAME = item.name.replace(NOT_ALLOWED_FILE_NAME, '_')
    
                    console.log('FileName: ', FILE_NAME)
                    
                    zip.file(FILE_NAME, response.blob())
                })
            return tmp
        }
        
        const downloadAll = () => {
            var tmp = new Date()
            const ZIPNAME = `${tmp.getFullYear()}${tmp.getMonth() + 1}${tmp.getDate()} ${tmp.getHours()}:${tmp.getMinutes()}:${tmp.getSeconds()}_${getGlobalState("zipList").length}`
            const arrOfFiles = getGlobalState("zipList").map(download)
            Promise.all(arrOfFiles)
                .then(() => {
                    zip.generateAsync({ type: "blob" }).then(function (blob) {
                        saveAs(blob, `${ZIPNAME}.zip`)
                    })
                    
                    if (ec <= 0) {
                        let secondsToGo = 5
                        const info = Modal.info({
                            title: t("zip_system_announcement"),
                            content: (
                                <div>
                                    <p>{t("zip_system_announcement_message1")}</p>
                                    <p>{t("zip_system_announcement_message2")}</p>
                                    <br></br>
                                    <br></br>
                                    <br></br>
                                    <p>{t("zip_system_announcement_message3").replace("{}", `${secondsToGo}`)}</p>
                                </div>
                            ),
                            onOk() {},
                        })
    
                        setTimeout(() => {
                            info.destroy()
                        }, secondsToGo * 1000)
    
                        info()
                    }
                })
                .catch((err) => {
                    // message.warning(`Error!\n Please send this error log to our discord server ->\n ${err}`)
                    ec++
                })
        }
    
        downloadAll()
        setGlobalState("zipList", [])
    }

    function requestNewBeatmapData(append=true) {
        setGlobalState("musicPlayerIsPlaying", false)
        setGlobalState("musicPlayerIsPaused", true)
        setGlobalState("apiResult", [])

        apiJson.page = 0

        GeneralMixins.getApiData(append)
    }

    useEffect(() => {
        filterDefaultHandler()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function getItem(label, key, icon, children) {
        return {
            key,
            icon,
            children,
            label,
        }
    }

    const items = [
        // Filter - Mode
        getItem(t("mode"), 'mode', null, [
            getItem(
                <div className="filter-option" onClick={(e) => optionHandler(e, 'm', '')}>
                    <p data-active={apiJson.m === '' ? true : false}>{t("mode_any")}</p>
                </div>,
                'm-any'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandler(e, 'm', '0')}>
                    <p data-active={apiJson.m === '0' ? true : false}>{t("mode_osu")}</p>
                </div>,
                'm-0'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandler(e, 'm', '1')}>
                    <p data-active={apiJson.m === '1' ? true : false}>{t("mode_taiko")}</p>
                </div>,
                'm-1'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandler(e, 'm', '2')}>
                    <p data-active={apiJson.m === '2' ? true : false}>{t("mode_catch")}</p>
                </div>,
                'm-2'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandler(e, 'm', '3')}>
                    <p data-active={apiJson.m === '3' ? true : false}>{t("mode_mania")}</p>
                </div>,
                'm-3'
            ),
        ]),

        // Filter Categories
        getItem(t("categories"), 'ranked', null, [
            getItem(
                <div className="filter-option" onClick={(e) => optionHandler(e, 'ranked', 'any')}>
                    <p data-active={(apiJson.ranked === 'all') ? true : false}>{t("categories_any")}</p>
                </div>,
                'ranked-any'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandler(e, 'ranked', '')}>
                    <p data-active={(apiJson.ranked === '' || apiJson.ranked === '') ? true : false}>{t("categories_has_leaderboard")}</p>
                </div>,
                'ranked-has_leaderboard'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandler(e, 'ranked', 'ranked')}>
                    <p data-active={apiJson.ranked.includes('ranked') ? true : false}>{t("categories_ranked")}</p>
                </div>,
                'ranked-ranked'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandler(e, 'ranked', 'qualified')}>
                    <p data-active={apiJson.ranked.includes('qualified') ? true : false}>{t("categories_qualified")}</p>
                </div>,
                'ranked-qualified'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandler(e, 'ranked', 'loved')}>
                    <p data-active={apiJson.ranked.includes('loved') ? true : false}>{t("categories_loved")}</p>
                </div>,
                'ranked-loved'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandler(e, 'ranked', 'pending')}>
                    <p data-active={apiJson.ranked.includes('pending') ? true : false}>{t("categories_pending")}</p>
                </div>,
                'ranked-pending'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandler(e, 'ranked', 'wip')}>
                    <p data-active={apiJson.ranked.includes('wip') ? true : false}>{t("categories_wip")}</p>
                </div>,
                'ranked-wip'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandler(e, 'ranked', 'graveyard')}>
                    <p data-active={apiJson.ranked.includes('graveyard') ? true : false}>{t("categories_graveyard")}</p>
                </div>,
                'ranked-graveyard'
            ),
        ]),

        // Filter Explicit Content
        getItem(t("explicit_content"), 'nsfw', null, [
            getItem(
                <div className="filter-option" onClick={(e) => optionHandler(e, 'nsfw', false)}>
                    <p data-active={(apiJson.nsfw === false || apiJson.nsfw === null) ? true : false}>{t("explicit_content_hide")}</p>
                </div>,
                'nsfw-false'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandler(e, 'nsfw', true)}>
                    <p data-active={apiJson.nsfw === true ? true : false}>{t("explicit_content_show")}</p>
                </div>,
                'nsfw-true'
            ),
        ]),

        // Filter Extra Content
        getItem(t("extra"), 'extra', null, [
            getItem(
                <div className="filter-option" onClick={(e) => optionHandlerForExtra(e, 'video')}>
                    <p data-active={(apiJson.extra === 'storyboard.video' || apiJson.extra === 'video') ? true : false}>{t("extra_has_video")}</p>
                </div>,
                'extra-video'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandlerForExtra(e, 'storyboard')}>
                    <p data-active={apiJson.extra === 'storyboard.video' || apiJson.extra === 'storyboard' ? true : false}>{t("extra_has_storyboard")}</p>
                </div>,
                'extra-storyboard'
            ),
        ]),

        // Filter Sort
        getItem(t("sort_by"), 'sort', null, [
            getItem(
                <div className="filter-option" onClick={(e) => optionHandlerForSortBy(e, 'title')}>
                    <p data-active={apiJson.sort.includes('title') ? true : false}>{t("sort_by_title")}</p>
                    <i data-asc={apiJson.sort.includes('title') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('title') ? '' : 'none')}}></i>
                </div>,
                'sort-title'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandlerForSortBy(e, 'artist')}>
                    <p data-active={apiJson.sort.includes('artist') ? true : false}>{t("sort_by_artist")}</p>
                    <i data-asc={apiJson.sort.includes('artist') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('artist') ? '' : 'none')}}></i>
                </div>,
                'sort-artist'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandlerForSortBy(e, 'difficulty')}>
                    <p data-active={diffSort !== 'none' ? true : false}>{t("sort_by_difficulty")}</p>
                    <i data-asc={diffSort === 'asc' ? true : false} className="fa-solid fa-chevron-down" style={{display: (diffSort !== 'none' ? '' : 'none')}}></i>
                </div>,
                'sort-difficulty'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandlerForSortBy(e, 'ranked')}>
                    <p data-active={apiJson.sort.includes('ranked') || apiJson.sort === '' ? true : false}>{t("sort_by_ranked")}</p>
                    <i data-asc={apiJson.sort.includes('ranked') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('ranked') ? '' : 'none')}}></i>
                </div>,
                'sort-ranked'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandlerForSortBy(e, 'updated')}>
                    <p data-active={apiJson.sort.includes('updated') ? true : false}>{t("sort_by_updated")}</p>
                    <i data-asc={apiJson.sort.includes('updated') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('updated') ? '' : 'none')}}></i>
                </div>,
                'sort-updated'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandlerForSortBy(e, 'plays')}>
                    <p data-active={apiJson.sort.includes('plays') ? true : false}>{t("sort_by_plays")}</p>
                    <i data-asc={apiJson.sort.includes('plays') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('plays') ? '' : 'none')}}></i>
                </div>,
                'sort-plays'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandlerForSortBy(e, 'favourites')}>
                    <p data-active={apiJson.sort.includes('favourites') ? true : false}>{t("sort_by_favorites")}</p>
                    <i data-asc={apiJson.sort.includes('favourites') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('favourites') ? '' : 'none')}}></i>
                </div>,
                'sort-favorites'
            ),
        ]),

        // Filter AR, CS, OD, HP, BPM, SR
        getItem(t("filter_song_setup"), 'song_setup', null, [
            getItem(
                <div className="filter-option">
                    <p>
                        {t("filter_ar")}
                    </p>
                </div>,
                'song_setup-ar',
                null,
                [
                    getItem(
                        <Slider range step={0.1} onAfterChange={detailValueHandler} onChange={detailValueHadlerForAR} defaultValue={[0, 10]} max={10}/>,
                        "song_setup-ar-value"
                    )
                ]
            ),
            getItem(
                <div className="filter-option">
                    <p>
                        {t("filter_cs")}
                    </p>
                </div>,
                'song_setup-cs',
                null,
                [
                    getItem(
                        <Slider range step={0.1} onAfterChange={detailValueHandler} onChange={detailValueHadlerForCS} defaultValue={[0, 10]} max={10}/>,
                        "song_setup-cs-value"
                    )
                ]
            ),
            getItem(
                <div className="filter-option">
                    <p>
                        {t("filter_od")}
                    </p>
                </div>,
                'song_setup-od',
                null,
                [
                    getItem(
                        <Slider range step={0.1} onAfterChange={detailValueHandler} onChange={detailValueHadlerForOD} defaultValue={[0, 10]} max={10}/>,
                        "song_setup-od-value"
                    )
                ]
            ),
            getItem(
                <div className="filter-option">
                    <p>
                        {t("filter_hp")}
                    </p>
                </div>,
                'song_setup-hp',
                null,
                [
                    getItem(
                        <Slider range step={0.1} onAfterChange={detailValueHandler} onChange={detailValueHadlerForHP} defaultValue={[0, 10]} max={10}/>,
                        "song_setup-hp-value"
                    )
                ]
            ),
            getItem(
                <div className="filter-option">
                    <p>
                        {t("filter_bpm")}
                    </p>
                </div>,
                'song_setup-bpm',
                null,
                [
                    getItem(
                        <Slider range step={1} onAfterChange={detailValueHandler} onChange={detailValueHadlerForBPM} defaultValue={[0, 500]} max={500}/>,
                        "song_setup-bpm-value"
                    )
                ]
            ),
            getItem(
                <div className="filter-option">
                    <p>
                        {t("filter_star_rating")}
                    </p>
                </div>,
                'song_setup-sr',
                null,
                [
                    getItem(
                        <Slider range step={0.1} onAfterChange={detailValueHandler} onChange={detailValueHadlerForSR} defaultValue={[0, 11]} max={11}/>,
                        "song_setup-sr-value"
                    )
                ]
            ),
        ]),

        // Filter Download Options
        getItem(t("download_options"), 'download', null, [
            getItem(
                <div className="filter-option" onClick={(e) => optionHandlerForDownload(e)}>
                    <p data-active={globalDirectDownload ? true : false}>{t("download_options_direct_download")}</p>
                </div>,
                'download-direct'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandlerForDlOptions(e, 'video')}>
                    <p data-active={globalNoVideo ? true : false}>{t("download_options_no_video")}</p>
                </div>,
                'download-novideo'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandlerForDlOptions(e, 'background')}>
                    <p data-active={globalNoBg ? true : false}>{t("download_options_no_background")}</p>
                </div>,
                'download-nobg'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandlerForDlOptions(e, 'hitsound')}>
                    <p data-active={globalNoHitsound ? true : false}>{t("download_options_no_hitsound")}</p>
                </div>,
                'download-nohitsound'
            ),
            getItem(
                <div className="filter-option" onClick={(e) => optionHandlerForDlOptions(e, 'storyboard')}>
                    <p data-active={globalNoStoryboard ? true : false}>{t("download_options_no_storyboard")}</p>
                </div>,
                'download-nostoryboard'
            ),
            getItem(
                <div className="filter-option">
                    <p>
                        {t("zip_download")}
                    </p>
                </div>,
                'download-zip',
                null,
                [
                    getItem(
                        <div className="filter-option" onClick={(e) => zipDownloadHandler(e)}>
                            <p>{t("zip_download_selected_download")}</p>
                        </div>,
                        "download-zip-select_only"
                    ),
                    getItem(
                        <div className="filter-option" onClick={(e) => zipDownloadHandler(e, false)}>
                            <p>{t("zip_download_all_download")}</p>
                        </div>,
                        "download-zip-all"
                    ),
                ]
            ),
        ]),
    ]

    const onClick = (e) => {
        console.log('click ', e)
    }

    return (
        <div id="filter-area" className="filter-area" data-mobile={filterMobile} data-open={filterOpen}>
            <Menu
                onClick={onClick}
                style={{
                    width: "100%",
                }}
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                openKeys={openedFilters}
                onOpenChange={filterOptionOpenhadler}
                selectedKeys={selectedFilters}
                items={items}
            />
        </div>
    )
}

export default Filter