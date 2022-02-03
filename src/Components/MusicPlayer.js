import React, { useEffect } from "react"
import { setGlobalState, useGlobalState } from '../store'
import LazyLoad from 'react-lazyload'
import { Skeleton } from 'antd'

function MusicPlayer() {
    const [bid] = useGlobalState("musicPlayerBid")

    useEffect(() => {
        const player = document.getElementById("musicPlayerAudio")
        player.onended = function() {
            setGlobalState("musicPlayerIsPlaying", false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className="music-player-block">
            <audio preload="metadata" src={"https://b.ppy.sh/preview/0.mp3"} id="musicPlayerAudio"></audio>
            <div className="music-player-cardheader" style={{ "--img": "url(https://assets.ppy.sh/beatmaps/"+bid+"/covers/list@2x.jpg?1622784772)" }}>

            </div>
        </div>
    )
}

export default MusicPlayer