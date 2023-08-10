import React from 'react'
import { Fragment } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { GeneralMixins } from '..'
import { setGlobalState, useGlobalState } from '../../store'
import { useTranslation } from "react-i18next"
import Odometer from 'react-odometerjs'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Tooltip, Progress, Switch, Dropdown, Menu, message } from 'antd'

import { ReactComponent as TotalLength } from '../../assets/images/total_length.svg'
import { ReactComponent as SliderCount } from '../../assets/images/count_sliders.svg'
import { ReactComponent as CircleCount } from '../../assets/images/count_circles.svg'
import { ReactComponent as BPM } from '../../assets/images/bpm.svg'

import '../../assets/css/components/beatmap_portal.css'
import '../../assets/css/odometer.css'

function BeatmapPortal({ bmap }) {
    const { t } = useTranslation()

    let iconWidth, iconHeight = '30px'

    const IconList = ["faa fa-extra-mode-osu", "faa fa-extra-mode-taiko", "faa fa-extra-mode-furits", "faa fa-extra-mode-mania"]


    const [ currentExpandedID ] = useGlobalState('currentExpandedID')
    const [globalDirectDownload] = useGlobalState("downloadDirect")
    const [globalNoVideo] = useGlobalState("globalNoVideo")
    const [globalNoBg] = useGlobalState("globalNoBg")
    const [globalNoHitsound] = useGlobalState("globalNoHitsound")
    const [globalNoStoryboard] = useGlobalState("globalNoStoryboard")

    const [visibleVer, setVisibleVer] = useState(bmap.beatmaps[0].id)
    const [isHover, setIsHover] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const [versionsSTD, setVersionsSTD] = useState([])
    const [versionsTAIKO, setVersionsTAIKO] = useState([])
    const [versionsCTB, setVersionsCTB] = useState([])
    const [versionsMANIA, setVersionsMANIA] = useState([])
    const VersionList = [versionsSTD, versionsTAIKO, versionsCTB, versionsMANIA]
    const [currentVersion, setCurrentVersion] = useState(bmap.beatmaps[0])
    
    const [noVideo, setNoVideo] = useState(globalNoVideo)
    const [noBg, setNoBg] = useState(globalNoBg)
    const [noHitsound, setNoHitsound] = useState(globalNoHitsound)
    const [noStoryboard, setNoStoryboard] = useState(globalNoStoryboard)

    useEffect(() => {
        sortBeatmaps()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bmap])

    function format(percentage) {
        var perc = percentage / 10
        return parseFloat(perc.toFixed(2))
    }

    function convertPercent(b) {
        return b*10
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

    function mouseHover(e, version) {
        e.stopPropagation()
        e.preventDefault()

        setIsHover(true)
        setCurrentVersion(version)
    }

    function mouseHoverLeave(e) {
        e.stopPropagation()
        e.preventDefault()

        bmap.beatmaps.forEach((v) => {
            if (v.id === visibleVer)
                setCurrentVersion(v)
        })

        setIsHover(false)
    }

    function changeDiff(e, version) {
        e.stopPropagation()
        e.preventDefault()

        setCurrentVersion(version)
        setVisibleVer(version.id)
    }

    function generateVersionListElement() {
        var result = []
        VersionList.forEach((version, index) => {
            if (version.length > 0) {
                result.push(
                    <ul key={index} className='portal-diff-list'>
                        {version.map((ver, index) => (
                            <li key={ver.id} className={visibleVer === ver.id ? "portal-diff-single active" : "portal-diff-single"} onMouseEnter={(e) => mouseHover(e, ver)} onMouseLeave={(e) => mouseHoverLeave(e)} onClick={(e) => changeDiff(e, ver)}>
                                <span>
                                    <i className={IconList[ver.mode_int]} style={{'color': GeneralMixins.getDiffColor(ver.difficulty_rating)}}></i>
                                </span>
                            </li>
                        ))}
                    </ul>
                )
            }
        })
        return result
    }

    function generateTagsElement() {
        var count = 0
        var result = []
        var tag_list = []

        bmap.tags.split(" ").map((tag, index) => {
            if (count < 20) {
                tag_list.push(
                    <li key={index} className='tag'>
                        <p>{count === 19 ? `${tag} ...` : tag}</p>
                    </li>
                )
                count++
            }
        })
        result.push(
            <ul key={"tags"} className='tags'>
                {tag_list}
            </ul>
        )
        return result
    }

    function downloadHandler(e) {
        e.stopPropagation()
        e.preventDefault()
        
        var url = ""
        var urlList = []

        if (!globalDirectDownload) {
            url = `${document.location.origin}/d/${bmap.id}`
            urlList = []
            if (globalNoVideo || globalNoBg || globalNoHitsound || globalNoStoryboard) url += "?"
            if (globalNoVideo) urlList.push("novideo=1")
            if (globalNoBg) urlList.push("nobg=1")
            if (globalNoHitsound) urlList.push("nohitsound=1")
            if (globalNoStoryboard) urlList.push("nostoryboard=1")
            urlList.map(function (param, i) {
                if (urlList[0] === param) url += `${param}`           
                else url += `&${param}`           
            })
            window.open(url, '_blank')
        } else {
            url = `https://api.nerinyan.moe/d/${bmap.id}`
            urlList = []
            if (globalNoVideo || globalNoBg || globalNoHitsound || globalNoStoryboard) url += "?"
            if (globalNoVideo) urlList.push("noVideo=1")
            if (globalNoBg) urlList.push("noBg=1")
            if (globalNoHitsound) urlList.push("noHitsound=1")
            if (globalNoStoryboard) urlList.push("noStoryboard=1")
            urlList.map(function (param, i) {
                if (urlList[0] === param) url += `${param}`           
                else url += `&${param}`           
            })
            window.open(url)
        }
    }
    function clipboardHandler() {
        setIsCopied(true)
        setTimeout(() => {
            setIsCopied(false)
        }, 900)
    }

    return (
        <Fragment>
            {
                (currentExpandedID === bmap.id) &&
                <div className='portal-popup-block' id={`beatmap-portal`} >
                    <div className='portal-popup-content' style={{ "--height": `${window.innerHeight - 220}px` }}>
                        <div className='portal-info-block' style={{ "--bg": "center / cover no-repeat url(https://assets.ppy.sh/beatmaps/"+bmap.id+"/covers/cover.jpg?1622784772" }}>
                            <div className='portal-diff-status'>
                                {generateVersionListElement()}
                                <div>
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
                                    <span className='ranked-status'>{t(bmap.status.toLowerCase())}</span>
                                </div>
                            </div>
                            <div className='portal-info'>
                                <div className='portal-info-left'>
                                    <span className='portal-version'>
                                        {currentVersion.version}
                                        {
                                            isHover &&
                                            <span className='portal-version-sr'>{t("star_rating")} {currentVersion.difficulty_rating?.toFixed(2)}</span>
                                        }
                                    </span>
                                    <span className='portal-title'>{bmap.title}</span>
                                    <span className='portal-artist'>{bmap.artist}</span>
                                    <div className='portal-creator'>
                                        <div className='creator-image' style={{"--bg": "center / cover no-repeat url(https://a.ppy.sh/"+bmap.user_id+"?1681738744" }}></div>
                                        <div className='creator-info'>
                                            <span>{t("mapped_by")} <a href={`https://osu.ppy.sh/users/${bmap.user_id}`}>{bmap.creator}</a></span>
                                            <span>{t("submitted")} <strong>{GeneralMixins.DateFormat(bmap.submitted_date)}</strong></span>
                                            {
                                                bmap.ranked === 1 &&
                                                <Fragment>
                                                    <span>{t("ranked").toLowerCase()} <strong>{GeneralMixins.timeSince((new Date(`${bmap.ranked_date}`)).getTime() / 1000)}</strong></span>
                                                </Fragment>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className='portal-info-right'>
                                    <ul className='portal-info-top'>
                                        <Tooltip arrow={false} placement="top" title={t("total_length")}>
                                            <li>
                                                <TotalLength width={iconWidth} height={iconHeight}/>
                                                <Odometer format='(:dd)' duration={Number(200)} value={GeneralMixins.secondsToTimeForOdometer(currentVersion.total_length)} />
                                            </li>
                                        </Tooltip>
                                        <Tooltip arrow={false} placement="top" title={t("bpm")}>
                                            <li>
                                                <BPM width={iconWidth} height={iconHeight}/>
                                                <Odometer duration={Number(200)} value={parseFloat(currentVersion.bpm)} />
                                            </li>
                                        </Tooltip>
                                        <Tooltip arrow={false} placement="top" title={t("circle_count")}>
                                            <li>
                                                <CircleCount width={iconWidth} height={iconHeight}/>
                                                <Odometer duration={Number(200)} value={GeneralMixins.addCommas(currentVersion.count_circles)} />
                                            </li>
                                        </Tooltip>
                                        <Tooltip arrow={false} placement="top" title={t("slider_count")}>
                                            <li>
                                                <SliderCount width={iconWidth} height={iconHeight}/>
                                                <Odometer duration={Number(200)} value={GeneralMixins.addCommas(currentVersion.count_sliders)} />
                                            </li>
                                        </Tooltip>
                                    </ul>
                                    <ul className='portal-info-center'> 
                                        {
                                            currentVersion.mode_int !== 1 &&
                                            <li>
                                                <span>{currentVersion.mode_int === 3 ? t("key_count") : t("circle_size")}</span> <Progress format={format} percent={convertPercent(currentVersion.cs)} gapDegree={90} width={90} strokeColor={GeneralMixins.getDiffColor(currentVersion.difficulty_rating)} strokeWidth={8} />
                                            </li>
                                        }
                                        <li>
                                            <span>{t("hp_drain")}</span> <Progress format={format} percent={convertPercent(currentVersion.drain)} gapDegree={90} width={90} strokeColor={GeneralMixins.getDiffColor(currentVersion.difficulty_rating)} strokeWidth={8} />
                                        </li>
                                        <li>
                                            <span>{t("accuracy")}</span> <Progress format={format} percent={convertPercent(currentVersion.accuracy)} gapDegree={90} width={90} strokeColor={GeneralMixins.getDiffColor(currentVersion.difficulty_rating)} strokeWidth={8} />
                                        </li>
                                        {
                                            (currentVersion.mode_int !== 1 && currentVersion.mode_int !== 3) &&
                                            <li>
                                                <span>{t("approach_rate")}</span> <Progress format={format} percent={convertPercent(currentVersion.ar)} gapDegree={90} width={90} strokeColor={GeneralMixins.getDiffColor(currentVersion.difficulty_rating)} strokeWidth={8} />
                                            </li>
                                        }
                                        <li>
                                            <span>{t("star_rating")}</span> <Progress format={format} percent={convertPercent(currentVersion.difficulty_rating?.toFixed(2))} gapDegree={90} width={90} strokeColor={"hsl(var(--hsl-darkorange-1))"} strokeWidth={8} />
                                        </li>
                                    </ul>
                                    <div className='portal-info-bottom'>
                                        <span>{t("success_rate")} ({GeneralMixins.calcSuccessRate(currentVersion.passcount, currentVersion.playcount)}%)</span>
                                        <Progress showInfo={false} percent={GeneralMixins.calcSuccessRate(currentVersion.passcount, currentVersion.playcount)} gapDegree={90} width={90} strokeColor={"hsl(var(--hsl-l4))"} strokeWidth={10} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='portal-more-info-block'>
                            <div className='more-info-two-side'>
                                <ul className='desc'>
                                    {
                                        bmap.source !== "" &&
                                        <li>
                                            <span>{t("source")}</span>
                                            <p>{bmap.source}</p>
                                        </li>
                                    }
                                    {
                                        bmap.tags !== "" &&
                                        <li>
                                            <span>{t("tags")}</span>
                                            {generateTagsElement()}
                                        </li>   
                                    }
                                </ul>
                                <ul className='portal-buttons'>
                                    <li className="portal-button-single">
                                        <Tooltip arrow={false} placement="top" title={"Copy download url"}>
                                            <CopyToClipboard text={`https://api.nerinyan.moe/d/${bmap.id}`} onCopy={() => clipboardHandler()}>
                                                <button className='portal-btn' >
                                                    <i className={isCopied ? "download-url-copied fa-solid fa-badge-check" : "fa-solid fa-copy"}></i>
                                                    <p>{t("copy_download_url")}</p>
                                                </button>
                                            </CopyToClipboard>
                                        </Tooltip>
                                    </li>
                                    <li className='portal-button-single'>
                                        <Tooltip arrow={false} placement="top" title={"Download beatmap"}>
                                            <button className='portal-btn' onClick={(e) => {downloadHandler(e)}}>
                                                <i className="fa-solid fa-arrow-down-to-bracket"></i>
                                                <p>{t("download")}</p>
                                            </button>
                                        </Tooltip>
                                    </li>
                                    <li className='portal-button-single'>
                                        <Tooltip arrow={false} placement="top" title={t("download_beatmap_background_image")}>
                                            <button className='portal-btn' onClick={(e) => {
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
                                        </Tooltip>
                                    </li>
                                </ul>
                                <ul className='portal-buttons'>
                                    <li className='portal-button-single'>
                                        <Tooltip arrow={false} placement="top" title={t("go_to_osu_beatmap_page")}>
                                            <button className='portal-btn' onClick={(e) => {
                                                e.stopPropagation()
                                                e.preventDefault()
                                                window.open(
                                                    `https://osu.ppy.sh/beatmapsets/${bmap.id}`,
                                                    '_blank'
                                                )
                                            }}>
                                                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                                <p>{t("beatmap_page")}</p>
                                            </button>
                                        </Tooltip>
                                    </li>
                                    <li className='portal-button-single'>
                                        <Tooltip arrow={false} placement="top" title={currentVersion.mode_int !== 2 ? t("go_to_beatmap_preview_site") : t("catch_not_supported_beatmap_preview")}>
                                            <button className={currentVersion.mode_int !== 2 ? 'portal-btn' : 'portal-btn disabled'} onClick={(e) => {
                                                e.stopPropagation()
                                                e.preventDefault()

                                                if (currentVersion.mode_int !== 2)
                                                    window.open(
                                                        GeneralMixins.genegratePreviewURL(currentVersion.id, currentVersion.mode_int),
                                                        '_blank'
                                                    )
                                            }}>
                                                <i className="fa-solid fa-eye"></i>
                                                <p>{t("preview")}</p>
                                            </button>
                                        </Tooltip>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </Fragment>
    )
}

export default BeatmapPortal