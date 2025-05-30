import React, { Fragment, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Portal from "../../Portal"
import { getGlobalState, setGlobalState, useGlobalState } from '../../store'
import LazyLoad from 'react-lazyload'
import { Tooltip, Switch, Dropdown, Menu } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { BeatmapPortal, Version } from '..'
import { GeneralMixins } from "../../lib"
import { useTranslation } from "react-i18next"

import '../../assets/css/components/beatmap.css'

function Beatmap({ bmap }) {
    const { t } = useTranslation()
    
    const [isCopied, setIsCopied] = useState(false)
    const [versionsSTD, setVersionsSTD] = useState([])
    const [versionsTAIKO, setVersionsTAIKO] = useState([])
    const [versionsCTB, setVersionsCTB] = useState([])
    const [versionsMANIA, setVersionsMANIA] = useState([])
    const VersionList = [versionsSTD, versionsTAIKO, versionsCTB, versionsMANIA]
    const [currentExpandedID] = useGlobalState("currentExpandedID")
    const [musicPlayerIsPlaying] = useGlobalState("musicPlayerIsPlaying")
    const [musicPlayerIsPaused] = useGlobalState("musicPlayerIsPaused")
    const [musicPlayerBeatmap] = useGlobalState("musicPlayerBeatmap")
    const IconList = ["faa fa-extra-mode-osu", "faa fa-extra-mode-taiko", "faa fa-extra-mode-furits", "faa fa-extra-mode-mania"]

    const [globalDirectDownload] = useGlobalState("downloadDirect")
    const [globalNoVideo] = useGlobalState("globalNoVideo")
    const [globalNoBg] = useGlobalState("globalNoBg")
    const [globalNoHitsound] = useGlobalState("globalNoHitsound")
    const [globalNoStoryboard] = useGlobalState("globalNoStoryboard")

    const [zipList] = useGlobalState("zipList")
    const [zipAppend, setZipAppend] = useState(false)

    const [dropdownOpen, setDropdownOpen] = useState(false)

    const [noVideo, setNoVideo] = useState(globalNoVideo)
    const [noBg, setNoBg] = useState(globalNoBg)
    const [noHitsound, setNoHitsound] = useState(globalNoHitsound)
    const [noStoryboard, setNoStoryboard] = useState(globalNoStoryboard)
    
    const [tmp, setTmp] = useState(0)

    function generateVersionListElement() {
        var result = []
        VersionList.forEach((version, index) => {
            if (version.length > 0) {
                if (version.length <= 10) {
                    result.push(
                        <div key={index} className="version-list-single">
                            <i className={IconList[index]}></i>
                            <ul>
                                {version.map((ver, index) => (
                                    <li key={ver.id}>
                                        <Version mode={index} ver={ver} isCollapse={true}/>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                } else {
                    result.push(
                        <div key={index} className="version-list-single">
                            <i className={IconList[index]}></i>
                            <ul>
                                <li>
                                    <span>{version.length}</span>
                                </li>
                            </ul>
                        </div>
                    )
                }
            }
        })
        return result
    }

    function sortBeatmaps() {
        var versions_temp = {
            'std': [],
            'taiko': [],
            'ctb': [],
            'mania': []
        }

        for (var b in bmap.beatmaps) {
            var temp = bmap.beatmaps[b]
            switch (temp.mode_int) {
                default:
                    break
                case 0:
                    versions_temp.std.push(temp)
                    break
                case 1:
                    versions_temp.taiko.push(temp)
                    break
                case 2:
                    versions_temp.ctb.push(temp)
                    break
                case 3:
                    versions_temp.mania.push(temp)
                    break
            }
        }
        setVersionsSTD(versions_temp.std)
        setVersionsTAIKO(versions_temp.taiko)
        setVersionsCTB(versions_temp.ctb)
        setVersionsMANIA(versions_temp.mania)
    }

    function changeCollapse(event) {
        event.stopPropagation()
        event.preventDefault()

        if (getGlobalState('currentExpandedID') !== bmap.id) {
            setGlobalState('currentExpandedID', bmap.id)
        } else {
            setGlobalState('currentExpandedID', 0)
        }

        setTmp(new Date().getMilliseconds())
    }

    function handleCallMusic(e) {
        e.stopPropagation()
        e.preventDefault()
        var player = document.getElementById("musicPlayerAudio")

        // 음악이 현재 재생중이며 재생중인 음악이 선택한 비트맵과 같은 경우
        if (musicPlayerIsPlaying && !musicPlayerIsPaused && musicPlayerBeatmap.id === bmap.id) {
            player.pause()
            setGlobalState("musicPlayerIsPaused", true)
            return
        }

        if (musicPlayerIsPaused && musicPlayerBeatmap.id === bmap.id) {
            player.play()
            setGlobalState("musicPlayerIsPaused", false)
            return
        }

        setGlobalState("musicPlayerIsPlaying", true)
        setGlobalState("musicPlayerIsPaused", false)
        setGlobalState("musicPlayerBeatmap", bmap)

        if (localStorage.getItem("musicPlayerVolume") === null) {
            localStorage.setItem("musicPlayerVolume", 0.25)
            player.volume = localStorage.getItem("musicPlayerVolume")
        } else {
            player.volume = localStorage.getItem("musicPlayerVolume")
        }
        player.src = "https://b.ppy.sh/preview/" + bmap.id +".mp3"
        if (player.duration > 0 && !player.paused) { //if player is playing
            return
        }
        else {
            player.play()
        }
    }

    function downloadHandler(e) {
        e.stopPropagation()
        e.preventDefault()
        
        if (bmap.nsfw && !GeneralMixins.getCookie("skip_explict_warning")) {
            var url = ""
            var urlList = []

            if (!globalDirectDownload) {
                url = `${document.location.origin}/d/${bmap.id}`
            } else {
                url = `https://api.nerinyan.moe/d/${bmap.id}`
            }

            urlList = []

            if (noVideo || noBg || noHitsound || noStoryboard) url += "?"
            if (noVideo) urlList.push("noVideo=1")
            if (noBg) urlList.push("noBg=1")
            if (noHitsound) urlList.push("noHitsound=1")
            if (noStoryboard) urlList.push("noStoryboard=1")

            urlList.map(function (param, i) {
                if (urlList[0] === param) url += `${param}`           
                else url += `&${param}`           
            })
            
            setGlobalState("downloadURLTmp", url)
            setGlobalState("explicitWarningHandle", true)
        } else return downloadbeatmap()
    }

    function downloadbeatmap() {
        var url = ""
        var urlList = []

        if (!globalDirectDownload) {
            url = `${document.location.origin}/d/${bmap.id}`
            urlList = []
            if (noVideo || noBg || noHitsound || noStoryboard) url += "?"
            if (noVideo) urlList.push("novideo=1")
            if (noBg) urlList.push("nobg=1")
            if (noHitsound) urlList.push("nohitsound=1")
            if (noStoryboard) urlList.push("nostoryboard=1")
            urlList.map(function (param, i) {
                if (urlList[0] === param) url += `${param}`           
                else url += `&${param}`           
            })
            window.open(url, '_blank')
        } else {
            url = `https://api.nerinyan.moe/d/${bmap.id}`
            urlList = []
            if (noVideo || noBg || noHitsound || noStoryboard) url += "?"
            if (noVideo) urlList.push("noVideo=1")
            if (noBg) urlList.push("noBg=1")
            if (noHitsound) urlList.push("noHitsound=1")
            if (noStoryboard) urlList.push("noStoryboard=1")
            urlList.map(function (param, i) {
                if (urlList[0] === param) url += `${param}`           
                else url += `&${param}`           
            })
            window.open(url)
        }
    }

    const handleOpenChange = (flag) => {
        setDropdownOpen(flag);
    };

    function clipboardHandler() {
        setIsCopied(true)
        setTimeout(() => {
            setIsCopied(false)
        }, 900);
    }

    useEffect(() => {
        sortBeatmaps()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setNoVideo(globalNoVideo)
        setNoBg(globalNoBg)
        setNoHitsound(globalNoHitsound)
        setNoStoryboard(globalNoStoryboard)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [globalNoVideo, globalNoBg, globalNoHitsound, globalNoStoryboard])

    const menu = (
        <Menu
          items={[
            {
                label: (
                    <div>
                        <Switch checked={zipAppend} onChange={(e) => {
                            if (e) {
                                var paramList = []
                                if (noVideo) paramList.push(true)
                                else paramList.push(false)
                                if (noBg) paramList.push(true)
                                else paramList.push(false)
                                if (noHitsound) paramList.push(true)
                                else paramList.push(false)
                                if (noStoryboard) paramList.push(true)
                                else paramList.push(false)
                                var url = GeneralMixins.generateDownloadURL(bmap.id, paramList)
                                var bname = `${bmap.id} ${bmap.artist} - ${bmap.title}.osz`
                                zipList.push({'name': bname, 'url': url})
                                setZipAppend(true)
                            } else {
                                return setZipAppend(false)
                            }
                        }} />
                        {t("append_this_beatmap_to_download_list")}
                    </div>
                ),
                key: '1',
            },
            {
              label: (
                <button className="btn version-bg-btn" onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    window.open(
                        `https://api.nerinyan.moe/bg/-${bmap.id}`,
                        '_blank'
                    )
                }}>
                    <i className="fa-solid fa-image"></i>
                    <p>{t("download_bg")}</p>
                </button>
              ),
              key: '2',
            },
          ]}
        />
    )

    return (
        <Fragment>
            <div
                id={bmap.id}
                className="beatmap-single"
                data-isExpand={currentExpandedID === bmap.id ? true : false}
                data-isplaying={musicPlayerIsPlaying && musicPlayerBeatmap.id === bmap.id ? true : false}
                onClick={(e) => changeCollapse(e)}
            >
                <LazyLoad height={136} offset={300} style={{background: "url(" + require('../../assets/images/beatmaps-default.png') + ")"}}>
                    <div className="card-header" style={{ "--bg": "center / cover no-repeat url(https://assets.ppy.sh/beatmaps/"+bmap.id+"/covers/cover.jpg?1622784772" }}>
                        <div className="card-header-beatmapinfo">
                            <ul>
                                <li className="card-header-status">
                                    {bmap.video && 
                                        <div className="ranked-status VIDEO">
                                            <Tooltip arrow={false} placement="top" title={t("this_beatmap_contains_video")}>
                                                <i className="fa-solid fa-video"></i>
                                            </Tooltip>
                                        </div>
                                    }
                                    {bmap.storyboard && 
                                        <div className="ranked-status STORYBOARD">
                                            <Tooltip arrow={false} placement="top" title={t("this_beatmap_contains_storyboard")}>
                                                <i className="fa-solid fa-clapperboard"></i>
                                            </Tooltip>
                                        </div>
                                    }
                                    <div className={"ranked-status " + GeneralMixins.convertRankedStatusToText(bmap.ranked)}>
                                        {t(GeneralMixins.convertRankedStatusToText(bmap.ranked).toLowerCase()).toUpperCase()}
                                    </div>
                                    {bmap.nsfw &&
                                        <div className={"NSFW"}>
                                            {t("explicit")}
                                        </div>
                                    }   
                                </li>
                            </ul>
                        </div>
                        <div className="beatmap-title">
                            <span className="title">{bmap.title}</span>
                            <span className="artist">by {bmap.artist}</span>
                            <span className="mapper">{t("mapped_by")} <Link to={"/main?creator="+bmap.user_id}>{bmap.creator}</Link></span>
                        </div>
                        <div className="beatmap-preview" style={musicPlayerIsPlaying && musicPlayerBeatmap.id === bmap.id ? {opacity: 1} : {}}>
                            <button onClick={(e) => {handleCallMusic(e)}} className="play-button">
                                <i className={"fa-duotone fa-" + (!musicPlayerIsPaused && musicPlayerBeatmap.id === bmap.id ? "pause" : "play")}></i>
                            </button>
                        </div>
                    </div>
                </LazyLoad>
                <ul className="card-main">
                    <li className="beatmap-info">
                        <div className="card-header-info">
                            <div className="card-haeder-stats">
                                <Tooltip arrow={false} placement="top" title={`${t("favorites_count")}: ${GeneralMixins.addCommas(bmap.favourite_count)}`}>
                                    <i className="fa-solid fa-heart"></i> {GeneralMixins.addCommas(bmap.favourite_count)}
                                </Tooltip>
                                <Tooltip arrow={false} placement="top" title={`${t("play_count")}: ${GeneralMixins.addCommas(bmap.play_count)}`}>
                                    <i className="fa-solid fa-circle-play"></i> {GeneralMixins.addCommas(bmap.play_count)}
                                </Tooltip>
                                <Tooltip arrow={false} placement="top" title={`${t("bpm")}: ${GeneralMixins.addCommas(parseFloat(bmap.bpm))}`}>
                                    <i className="fa-solid fa-music-note"></i> {GeneralMixins.addCommas(parseFloat(bmap.bpm))}
                                </Tooltip>
                            </div>
                        </div>
                    </li>
                    <li className="beatmap-list">
                        <div>
                            <div className="version-lists">
                                {generateVersionListElement()}
                            </div>
                            {getGlobalState('currentExpandedID') === bmap.id &&
                                <Portal>
                                    <BeatmapPortal bmap={bmap}></BeatmapPortal>
                                </Portal>
                            }
                        </div>
                    </li>
                    <li className="beatmap-buttons">
                        <Tooltip arrow={false} placement="top" title={t("copy_download_url")}>
                            <button onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                
                                const text = `https://api.nerinyan.moe/d/${bmap.id}`
                                navigator.clipboard.writeText(text).then(() => {
                                    clipboardHandler()
                                }).catch(err => {
                                    console.error('dl url copy failed: ', err)
                                })
                            }}
                            >
                                <i className={isCopied ? "download-url-copied fa-solid fa-badge-check" : "fa-solid fa-copy"}></i>
                            </button>
                        </Tooltip>
                        <Tooltip arrow={false} placement="top" title={t("download_bg")}>
                            <button className="btn version-bg-btn" onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                window.open(
                                    `https://api.nerinyan.moe/bg/-${bmap.id}`,
                                    '_blank'
                                )
                            }}>
                                <i className="fa-solid fa-image"></i>
                            </button>
                        </Tooltip>
                        <Tooltip arrow={false} placement="top" title={t("explicit_warning_button_download")}>
                            <button className="download" onClick={(e) => {downloadHandler(e)}}>
                                <i className="fa-solid fa-arrow-down-to-bracket"></i>
                            </button>
                        </Tooltip>
                        <Tooltip arrow={false} placement="top" title={t("append_this_beatmap_to_download_list")}>
                            <button className="btn version-bg-btn" onClick={(e) => {
                                if (!zipAppend) {
                                    var paramList = []
                                    if (noVideo) paramList.push(true)
                                    else paramList.push(false)
                                    if (noBg) paramList.push(true)
                                    else paramList.push(false)
                                    if (noHitsound) paramList.push(true)
                                    else paramList.push(false)
                                    if (noStoryboard) paramList.push(true)
                                    else paramList.push(false)
                                    var url = GeneralMixins.generateDownloadURL(bmap.id, paramList)
                                    var bname = `${bmap.id} ${bmap.artist} - ${bmap.title}.osz`
                                    zipList.push({'name': bname, 'url': url})
                                    setZipAppend(true)
                                }
                            }}>
                                {/* <i class={zipAppend ? "fa-solid fa-trash" : "fa-solid fa-rectangle-history-circle-plus"}></i> */}
                                <i class={"fa-solid fa-rectangle-history-circle-plus"}></i>
                            </button>
                        </Tooltip>
                        <Tooltip arrow={false} placement="top" title={t("go_to_osu_beatmap_page")}>
                            <button onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                window.open(
                                    `https://osu.ppy.sh/beatmapsets/${bmap.id}`,
                                    '_blank'
                                )
                            }}>
                                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                            </button>
                        </Tooltip>
                    </li>
                </ul>
            </div>
        </Fragment>
    )
}

export default Beatmap