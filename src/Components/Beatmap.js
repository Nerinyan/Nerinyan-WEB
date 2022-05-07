import React, { Fragment, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { setGlobalState, useGlobalState } from '../store'
import LazyLoad from 'react-lazyload'
import { Tooltip } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { GeneralMixins, Version } from '../Components'

function Beatmap({ bmap }) {
    const [isCollapse, setCollapse] = useState(true)
    const [isCopied, setIsCopied] = useState(false)
    const [versionsSTD, setVersionsSTD] = useState([])
    const [versionsTAIKO, setVersionsTAIKO] = useState([])
    const [versionsCTB, setVersionsCTB] = useState([])
    const [versionsMANIA, setVersionsMANIA] = useState([])
    const VersionList = [versionsSTD, versionsTAIKO, versionsCTB, versionsMANIA]
    const [musicPlayerIsPlaying] = useGlobalState("musicPlayerIsPlaying")
    const [musicPlayerIsPaused] = useGlobalState("musicPlayerIsPaused")
    const [musicPlayerBeatmap] = useGlobalState("musicPlayerBeatmap")
    const IconList = ["faa fa-extra-mode-osu", "faa fa-extra-mode-taiko", "faa fa-extra-mode-furits", "faa fa-extra-mode-mania"]

    function generateVersionListElement() {
        var result = []
        VersionList.forEach((version, index) => {
            if (version.length > 0) {
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
            }
        })
        return result
    }

    function generateVersionExpandListElement() {
        var result = []
        VersionList.forEach((version, index) => {
            if (version.length > 0) {
                result.push(
                    <ul key={index}>
                        {version.map((ver, index) => (
                            <li key={ver.id}>
                                <Version mode={ver.mode_int} ver={ver} isCollapse={false}/>
                            </li>
                        ))}
                    </ul>
                )
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

    function changeCollapse() {
        if (isCollapse) {
            setCollapse(false)
        } else {
            setCollapse(true)
        }
    }

    function handleCallMusic(e) {
        e.stopPropagation()
        e.preventDefault()
        var player = document.getElementById("musicPlayerAudio")

        // 음악이 현재 재생중이며 재생중인 음악이 선택한 비트맵과 같은경 우
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

    function downloadHander(e, noVideo=false) {
        e.stopPropagation()
        e.preventDefault()
        
        switch (noVideo) {
            case true:
                window.open(
                    GeneralMixins.generateDownloadURL(bmap.id),
                    '_blank'
                )
                break;
            default:
                window.open(
                    GeneralMixins.generateDownloadURL(bmap.id, false),
                    '_blank'
                )
                break;
        }
    }

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

    return (
        <Fragment>
            <div id={bmap.id} className="beatmap-single" data-isplaying={musicPlayerIsPlaying && musicPlayerBeatmap.id === bmap.id ? true : false}>
                <LazyLoad height={136} offset={300} style={{background: "url(" + require('../assets/images/beatmaps-default.png') + ")"}}>
                    <div onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        window.open(
                            GeneralMixins.generateDownloadURL(bmap.id),
                            '_blank'
                        )
                    }} className="card-header" style={{ "--bg": "center / cover no-repeat url(https://assets.ppy.sh/beatmaps/"+bmap.id+"/covers/cover.jpg?1622784772" }}>
                        <div className="card-header-beatmapinfo">
                            <ul>
                                <li className="card-header-status">
                                    <div className={"ranked-status " + GeneralMixins.convertRankedStatusToText(bmap.ranked)}>
                                        {GeneralMixins.convertRankedStatusToText(bmap.ranked)}
                                    </div>
                                    {bmap.nsfw &&
                                        <div className={"nsfw"}>
                                            EXPLICIT
                                        </div>
                                    }
                                </li>
                            </ul>
                        </div>
                        <div className="beatmap-title">
                            <span className="title">{bmap.title}</span>
                            <span className="artist">by {bmap.artist}</span>
                        </div>
                        <div className="beatmap-preview" style={musicPlayerIsPlaying && musicPlayerBeatmap.id === bmap.id ? {opacity: 1} : {}}>
                            <button onClick={(e) => {handleCallMusic(e)}} className="play-button">
                                <i className={"fa-duotone fa-" + (!musicPlayerIsPaused && musicPlayerBeatmap.id === bmap.id ? "pause" : "play")}></i>
                            </button>
                            <div className="beatmap-preview-progress">

                            </div>
                        </div>
                    </div>
                </LazyLoad>
                <ul className="card-main">
                    <li className="beatmap-info">
                        <span>mapped by <Link to={"/main?creator="+bmap.user_id}>{bmap.creator}</Link></span>
                        <div className="card-header-info">
                            <div className="card-haeder-stats">
                                <Tooltip placement="top" title={"Favorites count: " + GeneralMixins.addCommas(bmap.favourite_count)}>
                                    <i className="fa-solid fa-heart"></i> {GeneralMixins.addCommas(bmap.favourite_count)}
                                </Tooltip>
                                <Tooltip placement="top" title={"Play count: " + GeneralMixins.addCommas(bmap.play_count)}>
                                    <i className="fa-solid fa-circle-play"></i> {GeneralMixins.addCommas(bmap.play_count)}
                                </Tooltip>
                                <Tooltip placement="top" title={"BPM: " + GeneralMixins.addCommas(parseFloat(bmap.bpm))}>
                                    <i className="fa-solid fa-music-note"></i> {GeneralMixins.addCommas(parseFloat(bmap.bpm))}
                                </Tooltip>
                                <Tooltip placement="top" title={"Beatmaps count: " + GeneralMixins.addCommas(bmap.beatmaps.length)}>
                                    <i className="fa-solid fa-clipboard-list"></i> {GeneralMixins.addCommas(bmap.beatmaps.length)}
                                </Tooltip>
                                {bmap.video && 
                                    <Tooltip placement="top" title={"This beatmap contains video."}>
                                        <i className="fa-solid fa-video"></i>
                                    </Tooltip>
                                }
                                {bmap.storyboard && 
                                    <Tooltip placement="top" title={"This beatmap contains storyboard."}>
                                        <i className="fa-solid fa-clapperboard"></i>
                                    </Tooltip>
                                }
                            </div>
                        </div>
                    </li>
                    <li className="beatmap-buttons">
                        <Tooltip placement="top" title={"Copy download url"}>
                            <CopyToClipboard text={GeneralMixins.generateDownloadURL(bmap.id)} onCopy={() => clipboardHandler()}>
                                <button>
                                    <i className={isCopied ? "download-url-copied fa-solid fa-badge-check" : "fa-solid fa-copy"}></i>
                                </button>
                            </CopyToClipboard>
                        </Tooltip>
                        <Tooltip placement="top" title={"Download beatmap" + (bmap.video ? ' with video' : '')}>
                            <button onClick={(e) => {downloadHander(e)}}>
                                <i className="fa-solid fa-arrow-down-to-bracket"></i>
                            </button>
                        </Tooltip>
                        {bmap.video && 
                            <Tooltip placement="top" title={"Download beatmap without video"}>
                                <button onClick={(e) => {downloadHander(e, true)}}>
                                    <i className="fa-solid fa-video-slash"></i>
                                </button>
                            </Tooltip>
                        }
                    </li>
                    <li className="beatmap-list">
                        <div>
                            <Tooltip placement="top" title={isCollapse ? 'Expand beatmap list' : 'Collapse beatmap list '}>
                                <button className={"beatmap-list-btn " + (isCollapse ? 'collapse' : 'expand')} onClick={changeCollapse}><i className="fad fa-caret-square-down"></i></button>
                            </Tooltip>
                            <div className="version-lists">
                                {generateVersionListElement()}
                            </div>
                        </div>
                        {!isCollapse && generateVersionExpandListElement()}
                    </li>
                </ul>
            </div>
        </Fragment>
    )
}

export default Beatmap