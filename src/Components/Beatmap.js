import React, { Fragment, } from "react"
import { Tooltip } from 'antd'

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
    return (
        <Fragment>
            <div className="beatmap-single">
                <a href="/" target="_blank" id={bmap.id} className="card-header" style={
                    {
                        "--bg": "url(https://assets.ppy.sh/beatmaps/"+bmap.id+"/covers/cover.jpg?1622784772",
                        "--bg2": "linear-gradient(to right, #00000099, #ffe4e100), url(/images/beatmaps-default.png)"
                    }
                }>
                    <div className="card-header-beatmapinfo">
                        <ul>
                            <li>
                                <div className={"ranked-status " + convertRankedStatusToText(bmap.ranked)}>
                                    {convertRankedStatusToText(bmap.ranked)}
                                </div>
                                {bmap.nsfw &&
                                    <div className={"nsfw"}>
                                        EXPLICIT
                                    </div>
                                }
                            </li>
                            <li>
                                <div className="card-haeder-stats">
                                    <Tooltip placement="top" title={"Favorites count: " + bmap.favourite_count}>
                                        <i class="fas fa-heart"></i> {bmap.favourite_count}
                                    </Tooltip>
                                    <Tooltip placement="top" title={"Play count: " + bmap.play_count}>
                                        <i class="fas fa-play-circle"></i> {bmap.play_count}
                                    </Tooltip>
                                    <Tooltip placement="top" title={"BPM: " + parseFloat(bmap.bpm)}>
                                        <i class="fas fa-music"></i> {parseFloat(bmap.bpm)}
                                    </Tooltip>
                                </div>
                            </li>
                        </ul>
                        {/* {bmap.id} - {bmap.title} */}
                    </div>
                    <div>

                    </div>
                </a>
            </div>
                
        </Fragment>
    )
}

export default Beatmap