import React, { useEffect, useState } from "react"
import { getGlobalState, setGlobalState, useGlobalState } from '../store'
import { Input, Slider, message, Button, Modal } from 'antd'
import { useTranslation } from "react-i18next"
import { GeneralMixins } from "."

import JSZip from "jszip"
import { saveAs } from "file-saver"

import '../assets/css/components/settings.css'

// eslint-disable-next-line no-unused-vars

var delay = null

function Settings() {
    const { t } = useTranslation()
    
    const { Search } = Input

    const [settingTab] = useGlobalState("settingTab")

    const [apiJson] = useGlobalState("apiJson")
    const [detailSearchTmp] = useGlobalState("detailSearchTmp")

    const [tmp, setTmp] = useState(0)
    const [detailSearchChange, setDetailSearchChange] = useState(false)

    const [globalDirectDownload] = useGlobalState("downloadDirect")
    const [globalNoVideo] = useGlobalState("globalNoVideo")
    const [globalNoBg] = useGlobalState("globalNoBg")
    const [globalNoHitsound] = useGlobalState("globalNoHitsound")
    const [globalNoStoryboard] = useGlobalState("globalNoStoryboard")

    const [zipList] = useGlobalState("zipList")


    function searchHandler(val, event) {
        event.stopPropagation()
        event.preventDefault()
        
        requestNewBeatmapData(false)
        searchParamHandler("q", apiJson.query)
    }

    function searchbarChangeHandler(event) {
        event.stopPropagation()
        event.preventDefault()
        apiJson.query = event.target.value
        
        setTmp(new Date().getMilliseconds())
        // searchParamHandler("q", apiJson.query)
    }

    function searchParamHandler(target, value) {
        var uri = "/main"
        if (window.location.search === "") {
            uri += `?${target}=${value}`    
        } else {
            var tmp = window.location.search.replace("?", "").split("&")
            var searchs = []

            tmp.map(function (v) {
                    if (v.includes(`${target}=`))
                        return searchs.push(`${target}=${value}`)
                    else
                        return searchs.push(v)
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

        setTmp(new Date().getMilliseconds())
        searchParamHandler(target === "ranked" ? "s" : target, apiJson[target] === "all" ? "any" : apiJson[target])
        requestNewBeatmapData(false)
    }

    function optionHandlerForSortBy(event, target) {
        event.stopPropagation()
        event.preventDefault()
        if (apiJson.sort.includes(target)) {
            if (apiJson.sort.includes('desc')) apiJson.sort = `${target}_asc`
            else apiJson.sort = `${target}_desc`
        } else apiJson.sort = `${target}_desc`

        setTmp(new Date().getMilliseconds())
        searchParamHandler('sort', apiJson.sort === "ranked_desc" ? "": apiJson.sort )
        requestNewBeatmapData(false)
    }

    function optionHandlerForExtra(event, target) {
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
        setDetailSearchChange(true)
        clearTimeout(delay)
        delay = setTimeout(function() {
            requestNewBeatmapData(false)
        }, 800)
    }

    function optionHandlerForDownload(event) {
        event.stopPropagation()
        event.preventDefault()

        setGlobalState("downloadDirect", !globalDirectDownload)

        setTmp(new Date().getMilliseconds())
    }

    function optionHandlerForDlOptions(event, target) {
        event.stopPropagation()
        event.preventDefault()
        switch (target) {
            case "video":
                setGlobalState("globalNoVideo", !globalNoVideo)
                break
            case "background":
                setGlobalState("globalNoBg", !globalNoBg)
                break
            case "hitsound":
                setGlobalState("globalNoHitsound", !globalNoHitsound)
                break
            case "storyboard":
                setGlobalState("globalNoStoryboard", !globalNoStoryboard)
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div id="settings-area" className="settings-area" data-setting={settingTab}>
            <ul className="settings">
                <li className="settings-option">
                    <Search className={"settings-searchbar-input"} onSearch={searchHandler} onChange={searchbarChangeHandler} size="large" enterButton={t("search")} placeholder={t("search_placeholder")} allowClear="true" value={apiJson.query}/>
                </li>
                <li className="settings-option">
                    <strong>{t("mode")}</strong>
                    <ul>
                        <li onClick={(e) => optionHandler(e, 'm', '')}>
                            <p data-active={apiJson.m === '' ? true : false}>{t("mode_any")}</p>
                        </li>
                        <li onClick={(e) => optionHandler(e, 'm', '0')}>
                            <p data-active={apiJson.m === '0' ? true : false}>{t("mode_osu")}</p>
                        </li>
                        <li onClick={(e) => optionHandler(e, 'm', '1')}>
                            <p data-active={apiJson.m === '1' ? true : false}>{t("mode_taiko")}</p>
                        </li>
                        <li onClick={(e) => optionHandler(e, 'm', '2')}>
                            <p data-active={apiJson.m === '2' ? true : false}>{t("mode_catch")}</p>
                        </li>
                        <li onClick={(e) => optionHandler(e, 'm', '3')}>
                            <p data-active={apiJson.m === '3' ? true : false}>{t("mode_mania")}</p>
                        </li>
                    </ul>
                </li>
                <li className="settings-option">
                    <strong>{t("categories")}</strong>
                    <ul>
                        <li onClick={(e) => optionHandler(e, 'ranked', 'any')}>
                            <p data-active={(apiJson.ranked === 'all') ? true : false}>{t("categories_any")}</p>
                        </li>
                        <li onClick={(e) => optionHandler(e, 'ranked', '')}>
                            <p data-active={(apiJson.ranked === '' || apiJson.ranked === '') ? true : false}>{t("categories_has_leaderboard")}</p>
                        </li>
                        <li onClick={(e) => optionHandler(e, 'ranked', 'ranked')}>
                            <p data-active={apiJson.ranked.includes('ranked') ? true : false}>{t("categories_ranked")}</p>
                        </li>
                        <li onClick={(e) => optionHandler(e, 'ranked', 'qualified')}>
                            <p data-active={apiJson.ranked.includes('qualified') ? true : false}>{t("categories_qualified")}</p>
                        </li>
                        <li onClick={(e) => optionHandler(e, 'ranked', 'loved')}>
                            <p data-active={apiJson.ranked.includes('loved') ? true : false}>{t("categories_loved")}</p>
                        </li>
                        <li onClick={(e) => optionHandler(e, 'ranked', 'pending')}>
                            <p data-active={apiJson.ranked.includes('pending') ? true : false}>{t("categories_pending")}</p>
                        </li>
                        <li onClick={(e) => optionHandler(e, 'ranked', 'wip')}>
                            <p data-active={apiJson.ranked.includes('wip') ? true : false}>{t("categories_wip")}</p>
                        </li>
                        <li onClick={(e) => optionHandler(e, 'ranked', 'graveyard')}>
                            <p data-active={apiJson.ranked.includes('graveyard') ? true : false}>{t("categories_graveyard")}</p>
                        </li>
                    </ul>
                </li>
                <li className="settings-option">
                    <strong>{t("explicit_content")}</strong>
                    <ul>
                        <li onClick={(e) => optionHandler(e, 'nsfw', false)}>
                            <p data-active={(apiJson.nsfw === false || apiJson.nsfw === null) ? true : false}>{t("explicit_content_hide")}</p>
                        </li>
                        <li onClick={(e) => optionHandler(e, 'nsfw', true)}>
                            <p data-active={apiJson.nsfw === true ? true : false}>{t("explicit_content_show")}</p>
                        </li>
                    </ul>
                </li>
                <li className="settings-option">
                    <strong>{t("extra")}</strong>
                    <ul>
                        <li onClick={(e) => optionHandlerForExtra(e, 'video')}>
                            <p data-active={(apiJson.extra === 'storyboard.video' || apiJson.extra === 'video') ? true : false}>{t("extra_has_video")}</p>
                        </li>
                        <li onClick={(e) => optionHandlerForExtra(e, 'storyboard')}>
                            <p data-active={apiJson.extra === 'storyboard.video' || apiJson.extra === 'storyboard' ? true : false}>{t("extra_has_storyboard")}</p>
                        </li>
                    </ul>
                </li>
                <li className="settings-option">
                    <strong>{t("sort_by")}</strong>
                    <ul>
                        <li onClick={(e) => optionHandlerForSortBy(e, 'title')}>
                            <p data-active={apiJson.sort.includes('title') ? true : false}>{t("sort_by_title")}</p>
                            <i data-asc={apiJson.sort.includes('title') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('title') ? '' : 'none')}}></i>
                        </li>
                        <li onClick={(e) => optionHandlerForSortBy(e, 'artist')}>
                            <p data-active={apiJson.sort.includes('artist') ? true : false}>{t("sort_by_artist")}</p>
                            <i data-asc={apiJson.sort.includes('artist') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('artist') ? '' : 'none')}}></i>
                        </li>
                        <li onClick={(e) => optionHandlerForSortBy(e, 'difficulty')}>
                            <p data-active={apiJson.sort.includes('difficulty') ? true : false}>{t("sort_by_difficulty")}</p>
                            <i data-asc={apiJson.sort.includes('difficulty') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('difficulty') ? '' : 'none')}}></i>
                        </li>
                        <li onClick={(e) => optionHandlerForSortBy(e, 'ranked')}>
                            <p data-active={apiJson.sort.includes('ranked') || apiJson.sort === '' ? true : false}>{t("sort_by_ranked")}</p>
                            <i data-asc={apiJson.sort.includes('ranked') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('ranked') ? '' : 'none')}}></i>
                        </li>
                        <li onClick={(e) => optionHandlerForSortBy(e, 'updated')}>
                            <p data-active={apiJson.sort.includes('updated') ? true : false}>{t("sort_by_updated")}</p>
                            <i data-asc={apiJson.sort.includes('updated') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('updated') ? '' : 'none')}}></i>
                        </li>
                        <li onClick={(e) => optionHandlerForSortBy(e, 'plays')}>
                            <p data-active={apiJson.sort.includes('plays') ? true : false}>{t("sort_by_plays")}</p>
                            <i data-asc={apiJson.sort.includes('plays') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('plays') ? '' : 'none')}}></i>
                        </li>
                        <li onClick={(e) => optionHandlerForSortBy(e, 'favourites')}>
                            <p data-active={apiJson.sort.includes('favourites') ? true : false}>{t("sort_by_favorites")}</p>
                            <i data-asc={apiJson.sort.includes('favourites') && apiJson.sort.includes('asc') ? true : false} className="fa-solid fa-chevron-down" style={{display: (apiJson.sort.includes('favourites') ? '' : 'none')}}></i>
                        </li>
                    </ul>
                </li>
                <li className="settings-option">
                    <div className="two-side">
                        <div>
                            <strong>{t("filter_ar")}</strong>
                            <Slider range step={0.1} onAfterChange={detailValueHandler} onChange={detailValueHadlerForAR} defaultValue={[0, 10]} max={10}/>
                        </div>
                        <div>
                            <strong>{t("filter_cs")}</strong>
                            <Slider range step={0.1} onAfterChange={detailValueHandler} onChange={detailValueHadlerForCS} defaultValue={[0, 10]} max={10}/>
                        </div>
                    </div>
                </li>
                <li className="settings-option">
                    <div className="two-side">
                        <div>
                            <strong>{t("filter_od")}</strong>
                            <Slider range step={0.1} onAfterChange={detailValueHandler} onChange={detailValueHadlerForOD} defaultValue={[0, 10]} max={10}/>
                        </div>
                        <div>
                            <strong>{t("filter_hp")}</strong>
                            <Slider range step={0.1} onAfterChange={detailValueHandler} onChange={detailValueHadlerForHP} defaultValue={[0, 10]} max={10}/>
                        </div>
                    </div>
                </li>
                <li className="settings-option">
                    <div className="two-side">
                        <div>
                            <strong>{t("filter_bpm")}</strong>
                            <Slider range step={1} onAfterChange={detailValueHandler} onChange={detailValueHadlerForBPM} defaultValue={[0, 500]} max={500}/>
                        </div>
                        <div>
                            <strong>{t("filter_star_rating")}</strong>
                            <Slider range step={0.1} onAfterChange={detailValueHandler} onChange={detailValueHadlerForSR} defaultValue={[0, 11]} max={11}/>
                        </div>
                    </div>
                </li>
                <li className="settings-option">
                    <strong>{t("download_options")}</strong>
                    <ul>
                        <li onClick={(e) => optionHandlerForDownload(e)}>
                            <p data-active={globalDirectDownload ? true : false}>{t("download_options_direct_download")}</p>
                        </li>
                        <li onClick={(e) => optionHandlerForDlOptions(e, 'video')}>
                            <p data-active={globalNoVideo ? true : false}>{t("download_options_no_video")}</p>
                        </li>
                        <li onClick={(e) => optionHandlerForDlOptions(e, 'background')}>
                            <p data-active={globalNoBg ? true : false}>{t("download_options_no_background")}</p>
                        </li>
                        <li onClick={(e) => optionHandlerForDlOptions(e, 'hitsound')}>
                            <p data-active={globalNoHitsound ? true : false}>{t("download_options_no_hitsound")}</p>
                        </li>
                        <li onClick={(e) => optionHandlerForDlOptions(e, 'storyboard')}>
                            <p data-active={globalNoStoryboard ? true : false}>{t("download_options_no_storyboard")}</p>
                        </li>
                    </ul>
                </li>
                <li className="settings-option">
                    <strong>{t("zip_download")}</strong>
                    <ul>
                        <li onClick={(e) => zipDownloadHandler(e)}>
                            <p>{t("zip_download_selected_download")}</p>
                        </li>
                        <li onClick={(e) => zipDownloadHandler(e, false)}>
                            <p>{t("zip_download_all_download")}</p>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    )
}

export default Settings