import { scaleLinear, interpolateRgb } from 'd3'

const difficultyColorSpectrum = scaleLinear().domain([0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9])
    .clamp(true)
    .range(['#4290FB', '#4FC0FF', '#4FFFD5', '#7CFF4F', '#F6F05C', '#FF8068', '#FF4E6F', '#C645B8', '#6563DE', '#18158E', '#000000'])
    .interpolate(interpolateRgb.gamma(2.2))

export function convertRankedStatusToText(ranked) {
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

export function addCommas(nStr) {
    nStr += ''
    var x = nStr.split('.')
    var x1 = x[0]
    var x2 = x.length > 1 ? '.' + x[1] : ''
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, `${1},${2}`)
    }
    return x1 + x2
}

export function secondsToTime(time){
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

export function getDiffColor(rating) {
    rating += 0
    if (rating < 0.1) return '#AAAAAA';
    if (rating >= 9) return '#000000';
    return difficultyColorSpectrum(rating);
}

export function modeToicon(mode){
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

export function generateDownloadURL(bid, hasVideo=true){
    var downloadURL = "https://nerina.pw/d/"+bid+"?server="+sessionStorage.getItem("downloadServer")
    if (hasVideo) {
        downloadURL += "&noVideo=1"
    }
    return downloadURL
}