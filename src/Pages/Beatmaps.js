import React, { useEffect, Fragment } from "react"
import { Beatmap, GeneralMixins } from "../Components"
import { getGlobalState, useGlobalState } from '../store'

function Beatmaps() {
    const [apiResult] = useGlobalState("apiResult")
    const [loading] = useGlobalState("loading")

    function scrollHandler() {
        const documentData = document.documentElement
        if (documentData.scrollTop + documentData.clientHeight + (documentData.clientHeight*1.6) >= documentData.scrollHeight && !getGlobalState('loading')) {
            GeneralMixins.getApiData()
        }
    }

    let renderBeatmaps = []
    apiResult.forEach((bmap, index) => {
        renderBeatmaps.push(<li key={index}><Beatmap bmap={bmap}/></li>)
    })

    useEffect(() => {
        window.addEventListener("scroll", scrollHandler) // Add scroll Event
        return () => {
          window.removeEventListener("scroll", scrollHandler) // Delete scroll Event
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!loading && !apiResult) return <div>Loading...</div>

    return (
        <Fragment>
            <ul className="beatmap-list">
                {renderBeatmaps}
            </ul>
            <div data-loading={loading} className="beatmap-list-loading" style={{display: (loading ? '' : 'none')}}>
                <i className="fa-duotone fa-spinner"></i>
                <p>Loading</p>
            </div>
        </Fragment>
    )
}

export default Beatmaps
