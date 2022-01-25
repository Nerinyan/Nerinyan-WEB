import React, { Fragment, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Tooltip } from 'antd'
import LazyLoad from 'react-lazyload'
import { GeneralMixins, Version } from '../Components'

function Beatmap({ bmap }) {
    const [isCollapse, setCollapse] = useState(true)
    const [isHover, setIsHover] = useState(false)
    const [versionsSTD, setVersionsSTD] = useState([])
    const [versionsTAIKO, setVersionsTAIKO] = useState([])
    const [versionsCTB, setVersionsCTB] = useState([])
    const [versionsMANIA, setVersionsMANIA] = useState([])
    const VersionList = [versionsSTD, versionsTAIKO, versionsCTB, versionsMANIA]
    const IconList = ["faa fa-extra-mode-osu", "faa fa-extra-mode-taiko", "faa fa-extra-mode-furits", "faa fa-extra-mode-mania"]

    const generateVersionListElement = () => {
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

    const generateVersionExpandListElement = () => {
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

    const sortBeatmaps = () => {
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

    const changeCollapse = () => {
        if (isCollapse) {
            setCollapse(false)
        } else {
            setCollapse(true)
        }
    }

    const handleSingleClick = (e) => {
        e.preventDefault()
        window.open(
            '/',
            '_blank' // <- This is what makes it open in a new window.
          );
    }
    
    const handleCallMusic = (e, bid) => {
        e.preventDefault()
    }

    useEffect(() => {
        sortBeatmaps()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Fragment>
            <div id={bmap.id} className="beatmap-single" onMouseOver={() => setIsHover(true)} onMouseOut={() => setIsHover(false)}>
                <LazyLoad height={136} offset={300} style={{background: "url(" + require('../assets/images/beatmaps-default.png') + ")"}}>
                    <div onClick={(e) => handleSingleClick(e)} className="card-header" style={
                        {
                            "--bg": "no-repeat center/100% url(https://assets.ppy.sh/beatmaps/"+bmap.id+"/covers/cover.jpg?1622784772",
                            "--base-bg": "repeat center/90% url(" + require('../assets/images/beatmaps-default.png') +")"
                        }
                    }>
                        <div className="card-header-beatmapinfo">
                            <ul>
                                <li className="card-header-status">
                                    <div style={isHover ? {transform: 'translateX('+(-250)+'px)'} : {}} className={"ranked-status " + GeneralMixins.convertRankedStatusToText(bmap.ranked)}>
                                        {GeneralMixins.convertRankedStatusToText(bmap.ranked)}
                                    </div>
                                    <button onClick={(e) => {
                                        e.stopPropagation()
                                        handleCallMusic(e, bmap.id)
                                    }} style={!isHover ? {transform: 'translateX('+(-250)+'px)'} : {}} className="">
                                        <i className="fa-duotone fa-play"></i>
                                    </button>
                                    {bmap.nsfw &&
                                        <div className={"nsfw"}>
                                            EXPLICIT
                                        </div>
                                    }
                                </li>
                                <li className="card-header-info">
                                    <div className="card-haeder-stats">
                                        <Tooltip placement="top" title={"Favorites count: " + bmap.favourite_count}>
                                            <i className="fa-solid fa-heart"></i> {bmap.favourite_count}
                                        </Tooltip>
                                        <Tooltip placement="top" title={"Play count: " + bmap.play_count}>
                                            <i className="fa-solid fa-circle-play"></i> {bmap.play_count}
                                        </Tooltip>
                                        <Tooltip placement="top" title={"BPM: " + parseFloat(bmap.bpm)}>
                                            <i className="fa-solid fa-music-note"></i> {parseFloat(bmap.bpm)}
                                        </Tooltip>
                                        <Tooltip placement="top" title={"Beatmaps count: " + bmap.beatmaps.length}>
                                            <i className="fa-solid fa-clipboard-list"></i> {bmap.beatmaps.length}
                                        </Tooltip>
                                        {bmap.video && 
                                            <Tooltip placement="top" title={"This beatmap contains video."}>
                                                <i className="fa-solid fa-video"></i>
                                            </Tooltip>
                                        }
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="beatmap-title">
                            <span className="title">{bmap.title}</span>
                            <span className="artist">by {bmap.artist}</span>
                        </div>
                    </div>
                </LazyLoad>
                <ul className="card-main">
                    <li className="beatmap-info">
                        <span>mapped by <Link to={"/main?creator="+bmap.user_id}>{bmap.creator}</Link></span>
                        <div>
                            <Tooltip placement="top" title={"Copy download url"}>
                                <button>
                                    <i className="fa-solid fa-copy"></i>
                                </button>
                            </Tooltip>
                            <Tooltip placement="top" title={"Download beatmap" + (bmap.video ? ' with video' : '')}>
                                <button>
                                    <i className="fa-solid fa-arrow-down-to-bracket"></i>
                                </button>
                            </Tooltip>
                            {bmap.video && 
                                <Tooltip placement="top" title={"Download beatmap without video"}>
                                    <button>
                                        <i className="fa-solid fa-video-slash"></i>
                                    </button>
                                </Tooltip>
                            }
                        </div>
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