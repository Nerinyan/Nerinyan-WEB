import React, { useEffect, Fragment } from "react"
import { useSearchParams } from "react-router-dom"
import { Beatmap, GeneralMixins } from "../Components"
import { useGlobalState } from '../store'

var Loading = false

function Beatmaps() {
    const [apiResult] = useGlobalState("apiResult")
    const [loading] = useGlobalState("loading")
    const [searchParams] = useSearchParams()
    // const [beatmaps, setBeatmaps] = useState([])

    function scrollHandler() {
        const documentData = document.documentElement
        if (documentData.scrollTop + documentData.clientHeight + (documentData.clientHeight*1.6) >= documentData.scrollHeight && !Loading) {
            GeneralMixins.getApiData()
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", scrollHandler) // Add scroll Event
        GeneralMixins.getApiData() // get Beatmap Data From Nerinyan API
        if ((searchParams.get("creator") !== null)) console.log(searchParams.get("creator"))
        return () => {
          window.removeEventListener("scroll", scrollHandler) // Delete scroll Event
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!loading && !apiResult) return <div>Loading...</div>

    return (
        <Fragment>
            <ul className="beatmap-list">
                {apiResult.map((beatmap, index) => (
                    <li key={index}>
                      <Beatmap bmap={beatmap}/>
                    </li>
                ))}
            </ul>
        </Fragment>
    )
}

export default Beatmaps
