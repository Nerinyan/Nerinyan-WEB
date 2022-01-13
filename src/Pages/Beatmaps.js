import React, { useState, useEffect, Fragment } from "react"
import axios from "axios"
import { Beatmap } from "../Components"
// import { Button, Popover } from 'antd'

var Page = 0
var ErrorCount = 0
var Data = []
var Loading = false

function Beatmaps() {
  const [beatmaps, setBeatmaps] = useState([])
  const [loading, setLoading] = useState(false)

  const getData = async () => {
    setLoading(true)
    Loading = true
    if(ErrorCount > 4) {
      return
    }
    try {
      await axios.get(
        process.env.REACT_APP_BASE_API_URI+"/search", {
          params: {
            p: Page
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
      ErrorCount++
      console.log("error! " + ErrorCount + "\n    " + e)
    }
    if (beatmaps) ErrorCount = 0
    Page++
    setLoading(false)
    Loading = false
  }

  const scrollHandler = () => {
    const documentData = document.documentElement;
    if (documentData.scrollTop + documentData.clientHeight + (documentData.clientHeight*1.45) >= documentData.scrollHeight && !Loading) {
      getData()
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler) // Add scroll Event
    getData() // get Beatmap Data From Nerinyan API
    return () => {
      window.removeEventListener("scroll", scrollHandler) // Delete scroll Event
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!loading && !beatmaps) return <div>Loading...</div>

  return (
    <Fragment>
      <ul className="beatmap-list">
        {beatmaps.map(beatmap => (
          <li key={beatmap.id}>
            <Beatmap bmap={beatmap}/>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}

export default Beatmaps
