import React, { useState, useEffect, Fragment } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"
import { Beatmap } from "../Components"
import { setGlobalState, useGlobalState } from '../store'

var Data = []
var Loading = false

function Beatmaps() {
    const [apiErrorCount] = useGlobalState("apiErrorCount")
    const [apiURL] = useGlobalState("apiURL")
    const [apiJson] = useGlobalState("apiJson")
    const [searchParams] = useSearchParams()
    const [beatmaps, setBeatmaps] = useState([])
    const [loading, setLoading] = useState(false)

    async function getData() {
        setLoading(true)
        Loading = true

        if (apiErrorCount > 3) {
            setGlobalState("apiURL", "https://ko.nerinyan.moe")
        }

        try {
            await axios.get(
                `${apiURL}/search`, {
                    params: {
                        b64: btoa(JSON.stringify(apiJson)),
                        ps: 210
                    }
                }
            ).then(function (response) {
                if (Data.length < 1) {
                    setBeatmaps(response.data)
                    Data = response.data
                } else {
                    for (var bmp in response.data) {
                        Data.push(response.data[bmp])
                    }
                    setBeatmaps(Data)
                }
            })
        }
        catch(e) {
            var tempErrorCount = apiErrorCount
            setGlobalState("apiErrorCount", ++tempErrorCount)
        }

        var temp = apiJson
        var tempPage = Number(temp.page)
        temp.page = String(++tempPage)
        
        setGlobalState("apiJson", temp)
        setLoading(false)
        Loading = false
    }

    function scrollHandler() {
        const documentData = document.documentElement
        if (documentData.scrollTop + documentData.clientHeight + (documentData.clientHeight*1.6) >= documentData.scrollHeight && !Loading) {
            getData()
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", scrollHandler) // Add scroll Event
        getData() // get Beatmap Data From Nerinyan API
        if ((searchParams.get("creator") !== null)) console.log(searchParams.get("creator"))
        return () => {
          window.removeEventListener("scroll", scrollHandler) // Delete scroll Event
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!loading && !beatmaps) return <div>Loading...</div>

    return (
        <Fragment>
            <ul className="beatmap-list">
                {beatmaps.map((beatmap, index) => (
                    <li key={index}>
                      <Beatmap bmap={beatmap}/>
                    </li>
                ))}
            </ul>
        </Fragment>
    )
}

export default Beatmaps
