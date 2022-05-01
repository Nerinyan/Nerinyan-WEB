import React, { Fragment } from "react"
import { Tooltip, Progress } from 'antd'
import { ReactComponent as TotalLength } from '../assets/images/total_length.svg'
import { ReactComponent as SliderCount } from '../assets/images/count_sliders.svg'
import { ReactComponent as CircleCount } from '../assets/images/count_circles.svg'
import { ReactComponent as BPM } from '../assets/images/bpm.svg'
import { GeneralMixins } from '../Components'

function Version({ mode, ver, isCollapse }) {
    var iconWidth, iconHeight = '20px'

    function format(percentage) {
        var perc = percentage / 10
        return perc
    }

    function convertPercent(b) {
        return b*10
    }

    return (
        <Fragment>
            <Tooltip overlayClassName={"version-tooltip"} placement="top" title={
                <div className="beatmap-version-tooltip-single">
                    <div className="beatmap-version-tooltip-info-header">
                        {GeneralMixins.modeToicon(ver.mode_int)}
                        <span className="beatmap-version-rating" style={{ '--bg-color': GeneralMixins.getDiffColor(ver.difficulty_rating), '--text-color': ver.difficulty_rating > 7 ? '#d2d2d2' : '#393939'}}><i className="fas fa-star"/>{GeneralMixins.addCommas(ver.difficulty_rating.toFixed(2))}</span>
                        <span>{ver.version}</span>
                    </div>
                    <ul className="beatmap-version-tooltip-info-middle">
                        <Tooltip placement="top" title={"Total length"}>
                            <li>
                                <TotalLength width={iconWidth} height={iconHeight}/><span>{GeneralMixins.secondsToTime(ver.total_length)}</span>
                            </li>
                        </Tooltip>
                        <Tooltip placement="top" title={"BPM"}>
                            <li>
                                <BPM width={iconWidth} height={iconHeight}/><span>{parseFloat(ver.bpm)}</span>
                            </li>
                        </Tooltip>
                        <Tooltip placement="top" title={"Circle count"}>
                            <li>
                                <CircleCount width={iconWidth} height={iconHeight}/><span>{GeneralMixins.addCommas(ver.count_circles)}</span>
                            </li>
                        </Tooltip>
                        <Tooltip placement="top" title={"Slider count"}>
                            <li>
                                <SliderCount width={iconWidth} height={iconHeight}/><span>{GeneralMixins.addCommas(ver.count_sliders)}</span>
                            </li>
                        </Tooltip>
                    </ul>
                    <ul className="beatmap-version-tooltip-info-end">
                        <li>
                            <span>Circle Size</span> <Progress format={format} percent={convertPercent(ver.cs)} type={"dashboard"} gapDegree={90} width={90} strokeColor={GeneralMixins.getDiffColor(ver.difficulty_rating)} strokeWidth={10} />
                        </li>
                        <li>
                            <span>HP Drain</span> <Progress format={format} percent={convertPercent(ver.drain)} type={"dashboard"} gapDegree={90} width={90} strokeColor={GeneralMixins.getDiffColor(ver.difficulty_rating)} strokeWidth={10} />
                        </li>
                        <li>
                            <span>Accuracy</span> <Progress format={format} percent={convertPercent(ver.accuracy)} type={"dashboard"} gapDegree={90} width={90} strokeColor={GeneralMixins.getDiffColor(ver.difficulty_rating)} strokeWidth={10} />
                        </li>
                        <li>
                            <span>Approach Rate</span> <Progress format={format} percent={convertPercent(ver.ar)} type={"dashboard"} gapDegree={90} width={90} strokeColor={GeneralMixins.getDiffColor(ver.difficulty_rating)} strokeWidth={10} />
                        </li>
                    </ul>
                </div>
            }>
                {isCollapse && 
                    <div className="beatmap-version-single" style={{ '--bg-color': GeneralMixins.getDiffColor(ver.difficulty_rating), '--text-color': ver.difficulty_rating > 7 ? '#d2d2d2' : '#393939'}}></div>
                }
                {!isCollapse &&
                    <Fragment>
                        <div>
                            {GeneralMixins.modeToicon(ver.mode_int)}
                            <span className="beatmap-version-rating" style={{ '--bg-color': GeneralMixins.getDiffColor(ver.difficulty_rating), '--text-color': ver.difficulty_rating > 7 ? '#d2d2d2' : '#393939'}}><i className="fas fa-star"/>{GeneralMixins.addCommas(ver.difficulty_rating.toFixed(2))}</span>
                            <span>{ver.version}</span>
                        </div>
                        <div>
                            <button onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                window.open(
                                    GeneralMixins.genegratePreviewURL(ver.id),
                                    '_blank'
                                )
                            }}>
                                Preview
                            </button>
                        </div>
                    </Fragment>
                }
            </Tooltip>
        </Fragment>
    )
}

export default Version