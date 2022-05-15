import Head from 'next/head'
import React, { useEffect } from "react"
import { useRouter } from 'next/router'
import { Searchbar, Beatmap, GeneralMixins, MusicPlayer } from "../components"
import { getGlobalState, useGlobalState } from '../store'

export default function IndexPage({ postList }) {
  const [apiResult] = useGlobalState("apiResult")
  const [loading] = useGlobalState("loading")
  const [firstLoad] = useGlobalState("firstLoad")
  const searchParams = useRouter()

  function scrollHandler() {
    const documentData = document.documentElement
    if (documentData.scrollTop + documentData.clientHeight + (documentData.clientHeight*2) >= documentData.scrollHeight && !getGlobalState('loading')) {
      GeneralMixins.getApiData()
    }
  }

  let renderBeatmaps = []
  apiResult.forEach((bmap, index) => {
    renderBeatmaps.push(<li key={index}><Beatmap bmap={bmap}/></li>)
  })

  useEffect(() => {
    GeneralMixins.getUserRequestParams(searchParams)
    window.addEventListener("scroll", scrollHandler) // Add scroll Event
    return () => {
      window.removeEventListener("scroll", scrollHandler) // Delete scroll Event
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading && firstLoad) return (
    <div data-loading={loading && firstLoad} className="beatmap-list-loading" style={{display: (loading ? '' : 'none')}}>
      <i className="fa-duotone fa-spinner"></i>
      <p>Loading</p>
    </div>
  )
  else {
    return (
      <div className="container">
        <Searchbar />
        <ul className="beatmap-list">
          {renderBeatmaps}
        </ul>
        <a href="#top" className="backToTop">
          <i className="fa-solid fa-circle-arrow-up"></i>
        </a>
        <div data-loading={loading && firstLoad} className="beatmap-list-loading" style={{display: (loading ? '' : 'none')}}>
          <i className="fa-duotone fa-spinner"></i>
          <p>Loading</p>
        </div>
        <MusicPlayer />
      </div>
    )
  }
}
