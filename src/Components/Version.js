import React, { Fragment } from "react"
import { Tooltip } from 'antd'
import { scaleLinear, interpolateRgb } from 'd3'
import { ReactComponent as TotalLength } from '../assets/images/total_length.svg'
import { ReactComponent as SliderCount } from '../assets/images/count_sliders.svg'
import { ReactComponent as CircleCount } from '../assets/images/count_circles.svg'
import { ReactComponent as BPM } from '../assets/images/bpm.svg'

function Version({ mode, ver, isCollapse }) {
    var iconWidth, iconHeight = '20px'
    // const iconHeight = '18px'
    
    const difficultyColorSpectrum = scaleLinear().domain([0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9])
    .clamp(true)
    .range(['#4290FB', '#4FC0FF', '#4FFFD5', '#7CFF4F', '#F6F05C', '#FF8068', '#FF4E6F', '#C645B8', '#6563DE', '#18158E', '#000000'])
    .interpolate(interpolateRgb.gamma(2.2))

    const getDiffColor = (rating) => {
        if (rating < 0.1) return '#AAAAAA'
        if (rating>= 9) return '#000000'
        return difficultyColorSpectrum(rating)
    }

    const modeToicon = (mode) => {
        switch (mode) {
            case 0:
                return (<i className="faa fa-extra-mode-osu"></i>)
            case 1:
                return (<i className="faa fa-extra-mode-taiko"></i>)
            case 2:
                return (<i className="faa fa-extra-mode-fruits"></i>)
            case 3:
                return (<i className="faa fa-extra-mode-mania"></i>)
            default:
                break
        }
    }

    const secondsToTime = (time) => {
        var hrs = ~~(time / 3600)
        var mins = ~~((time % 3600) / 60)
        var secs = ~~time % 60
        var ret = ""

        if (hrs > 0) {
            ret += "" + hrs + ":" + (mins < 10 ? "0" : "")
        }

        ret += "" + mins + ":" + (secs < 10 ? "0" : "")
        ret += "" + secs
        return ret
    }

    const addCommas = (nStr) => {
        nStr += ''
        var x = nStr.split('.')
        var x1 = x[0]
        var x2 = x.length > 1 ? '.' + x[1] : ''
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2')
        }
        return x1 + x2
    }

    return (
        <Fragment>
            {isCollapse &&
            <Tooltip placement="top" title={
                <div className="beatmap-version-single">
                    <div className="beatmap-version-info-header">
                        {modeToicon(mode)}
                        <span><i className="fas fa-star"/>{addCommas(ver.difficulty_rating.toFixed(2))}</span>
                        <span>{ver.version}</span>
                    </div>
                    <ul>
                        <Tooltip placement="top" title={"Total length"}>
                            <li>
                                <TotalLength width={iconWidth} height={iconHeight}/><span>{secondsToTime(ver.total_length)}</span>
                            </li>
                        </Tooltip>
                        <Tooltip placement="top" title={"BPM"}>
                            <li>
                                <BPM width={iconWidth} height={iconHeight}/><span>{parseFloat(ver.bpm)}</span>
                            </li>
                        </Tooltip>
                        <Tooltip placement="top" title={"Circle count"}>
                            <li>
                                <CircleCount width={iconWidth} height={iconHeight}/><span>{addCommas(ver.count_circles)}</span>
                            </li>
                        </Tooltip>
                        <Tooltip placement="top" title={"Slider count"}>
                            <li>
                                <SliderCount width={iconWidth} height={iconHeight}/><span>{addCommas(ver.count_sliders)}</span>
                            </li>
                        </Tooltip>
                    </ul>
                </div>
            }>
                <span>TEST: {getDiffColor(ver.difficulty_rating)}</span>
            </Tooltip>
            }
            {/* {ver.version} | {isCollapse ? 'collapse' : 'expand'} */}
        </Fragment>
    )
}

export default Version