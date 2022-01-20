import React, { Fragment, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Tooltip } from 'antd'
import { Version } from '../Components'

const convertRankedStatusToText = (ranked) => {
    var temp
    switch (ranked) {
        default:
            temp = "UNKNOWN"
            break
        case -2:
            temp = "GRAVEYARD"
            break
        case -1:
            temp = "WIP"
            break
        case 0:
            temp = "PENDING"
            break
        case 1:
            temp = "RANKED"
            break
        case 2:
            temp = "APPROVED"
            break
        case 3:
            temp = "QUALIFIED"
            break
        case 4:
            temp = "LOVED"
            break
    }
    return temp
}

function Beatmap({ bmap }) {
    const [isCollapse, setCollapse] = useState(true)
    const [versionsSTD, setVersionsSTD] = useState([])
    const [versionsTAIKO, setVersionsTAIKO] = useState([])
    const [versionsCTB, setVersionsCTB] = useState([])
    const [versionsMANIA, setVersionsMANIA] = useState([])

    const modeToicon = (mode) => {
        switch (mode) {
            case 0:
                return (<i className="faa fa-extra-mode-osu"></i>)
            case 1:
                return (<i className="faa fa-extra-mode-taiko"></i>)
            case 2:
                return (<i className="faa fa-extra-mode-furits"></i>)
            case 3:
                return (<i className="faa fa-extra-mode-mania"></i>)
            default:
                break
        }
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

    useEffect(() => {
        sortBeatmaps()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Fragment>
            <div className="beatmap-single">
                <a href="/" target="_blank" id={bmap.id} className="card-header" style={
                    {
                        "--bg": "no-repeat center/100% url(https://assets.ppy.sh/beatmaps/"+bmap.id+"/covers/cover.jpg?1622784772",
                        "--base-bg": "repeat center/90% url(" + require('../assets/images/beatmaps-default.png') +")"
                    }
                }>
                    <div className="card-header-beatmapinfo">
                        <ul>
                            <li className="card-header-status">
                                <div className={"ranked-status " + convertRankedStatusToText(bmap.ranked)}>
                                    {convertRankedStatusToText(bmap.ranked)}
                                </div>
                                {bmap.nsfw &&
                                    <div className={"nsfw"}>
                                        EXPLICIT
                                    </div>
                                }
                            </li>
                            <li className="card-header-info">
                                <div className="card-haeder-stats">
                                    <Tooltip placement="top" title={"Favorites count: " + bmap.favourite_count}>
                                        <i className="fas fa-heart"></i> {bmap.favourite_count}
                                    </Tooltip>
                                    <Tooltip placement="top" title={"Play count: " + bmap.play_count}>
                                        <i className="fas fa-play-circle"></i> {bmap.play_count}
                                    </Tooltip>
                                    <Tooltip placement="top" title={"BPM: " + parseFloat(bmap.bpm)}>
                                        <i className="fas fa-music"></i> {parseFloat(bmap.bpm)}
                                    </Tooltip>
                                    <Tooltip placement="top" title={"Beatmaps count: " + bmap.beatmaps.length}>
                                        <i className="fas fa-clipboard-list"></i> {bmap.beatmaps.length}
                                    </Tooltip>
                                    {bmap.video && 
                                        <Tooltip placement="top" title={"This beatmap contains video."}>
                                            <i className="fas fa-video"></i>
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
                </a>
                <ul className="card-main">
                    <li className="beatmap-info">
                        <span>mapped by <Link to={"/main?creator="+bmap.user_id}>{bmap.creator}</Link></span>
                        <Tooltip placement="top" title={"Copy download url"}>
                            <button>
                                <i className="fas fa-paste"></i>
                            </button>
                        </Tooltip>
                        <Tooltip placement="top" title={"Download beatmap" + (bmap.video ? ' with video' : '')}>
                            <button>
                                <i className="fas fa-download"></i>
                            </button>
                        </Tooltip>
                        {bmap.video && 
                            <Tooltip placement="top" title={"Download beatmap without video"}>
                                <button>
                                    <i className="fas fa-video-slash"></i>
                                </button>
                            </Tooltip>
                        }
                    </li>
                    <li className="beatmap-list">
                        <Tooltip placement="top" title={isCollapse ? 'Expand beatmap list' : 'Collapse beatmap list '}>
                            <button className={"beatmap-list-btn " + (isCollapse ? 'collapse' : 'expand')} onClick={changeCollapse}><i className="fad fa-caret-square-down"></i></button>
                        </Tooltip>
                        <div className={(isCollapse ? 'collapse' : 'expand')}>
                            {/* mode: standard */}
                            {versionsSTD.length > 0 &&
                                <div className="version-list-single">
                                    {isCollapse && modeToicon(0)}
                                    <ul>
                                        {versionsSTD.map((ver, index) => (
                                            <li key={ver.id}>
                                                <Version mode={0} ver={ver} isCollapse={isCollapse}/>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            }
                            {/* mode: taiko */}
                            {versionsTAIKO.length > 0 &&
                                <div className="version-list-single">
                                    {isCollapse && modeToicon(1)}
                                    <ul>
                                        {versionsTAIKO.map((ver, index) => (
                                            <li key={ver.id}>
                                                <Version mode={1} ver={ver} isCollapse={isCollapse}/>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            }
                            {/* mode: fruits */}
                            {versionsCTB.length > 0 &&  
                                <div className="version-list-single">
                                    {isCollapse && modeToicon(2)}
                                    <ul>
                                        {versionsCTB.map((ver, index) => (
                                            <li key={ver.id}>
                                                <Version mode={2} ver={ver} isCollapse={isCollapse}/>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            }
                            {/* mode: mania */}
                            {versionsMANIA.length > 0 &&
                                <div className="version-list-single">
                                    {isCollapse && modeToicon(3)}
                                    <ul>
                                        {versionsMANIA.map((ver, index) => (
                                            <li key={ver.id}>
                                                <Version mode={3} ver={ver} isCollapse={isCollapse}/>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            }
                            {/* todo: versions 구조화 작업 */}
                        </div>
                    </li>
                </ul>
            </div>
        </Fragment>
    )
}

export default Beatmap