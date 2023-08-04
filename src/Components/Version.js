import React, { Fragment, useState } from "react"
import { Tooltip, Progress } from 'antd'
import { useTranslation } from "react-i18next"
import { ReactComponent as TotalLength } from '../assets/images/total_length.svg'
import { ReactComponent as SliderCount } from '../assets/images/count_sliders.svg'
import { ReactComponent as CircleCount } from '../assets/images/count_circles.svg'
import { ReactComponent as BPM } from '../assets/images/bpm.svg'
import { GeneralMixins } from '../Components'

import '../assets/css/components/beatmap.css'

function Version({ mode, ver, isCollapse }) {
    const { t } = useTranslation()

    var iconWidth, iconHeight = '20px'
    const [InfoCollapse, setInfoCollapse] = useState(true)

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
                        <span className="beatmap-version-rating" style={{ '--bg-color': GeneralMixins.getDiffColor(ver.difficulty_rating), '--text-color': GeneralMixins.getDiffTextColor(ver.difficulty_rating)}}><i className="fas fa-star"/>{GeneralMixins.addCommas(ver.difficulty_rating.toFixed(2))}</span>
                        <span>{ver.version}</span>
                    </div>
                    <ul className="beatmap-version-tooltip-info-middle">
                        <Tooltip placement="top" title={t("total_length")}>
                            <li>
                                <TotalLength width={iconWidth} height={iconHeight}/><span>{GeneralMixins.secondsToTime(ver.total_length)}</span>
                            </li>
                        </Tooltip>
                        <Tooltip placement="top" title={t("bpm")}>
                            <li>
                                <BPM width={iconWidth} height={iconHeight}/><span>{parseFloat(ver.bpm)}</span>
                            </li>
                        </Tooltip>
                        <Tooltip placement="top" title={t("circle_count")}>
                            <li>
                                <CircleCount width={iconWidth} height={iconHeight}/><span>{GeneralMixins.addCommas(ver.count_circles)}</span>
                            </li>
                        </Tooltip>
                        <Tooltip placement="top" title={t("slider_count")}>
                            <li>
                                <SliderCount width={iconWidth} height={iconHeight}/><span>{GeneralMixins.addCommas(ver.count_sliders)}</span>
                            </li>
                        </Tooltip>
                    </ul>
                    <ul className="beatmap-version-tooltip-info-end">
                        <li>
                            <span>{t("circle_size")}</span> <Progress format={format} percent={convertPercent(ver.cs)} type={"dashboard"} gapDegree={90} width={90} strokeColor={GeneralMixins.getDiffColor(ver.difficulty_rating)} strokeWidth={10} />
                        </li>
                        <li>
                            <span>{t("hp_drain")}</span> <Progress format={format} percent={convertPercent(ver.drain)} type={"dashboard"} gapDegree={90} width={90} strokeColor={GeneralMixins.getDiffColor(ver.difficulty_rating)} strokeWidth={10} />
                        </li>
                        <li>
                            <span>{t("accuracy")}</span> <Progress format={format} percent={convertPercent(ver.accuracy)} type={"dashboard"} gapDegree={90} width={90} strokeColor={GeneralMixins.getDiffColor(ver.difficulty_rating)} strokeWidth={10} />
                        </li>
                        <li>
                            <span>{t("approach_rate")}</span> <Progress format={format} percent={convertPercent(ver.ar)} type={"dashboard"} gapDegree={90} width={90} strokeColor={GeneralMixins.getDiffColor(ver.difficulty_rating)} strokeWidth={10} />
                        </li>
                    </ul>
                </div>
            }>
                <div className="beatmap-version-single" style={{ '--bg-color': GeneralMixins.getDiffColor(ver.difficulty_rating), '--text-color': GeneralMixins.getDiffTextColor(ver.difficulty_rating)}}></div>
            </Tooltip>
        </Fragment>
    )
}

export default Version