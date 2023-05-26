import React, { Fragment, useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import { GeneralMixins, Navbar, Footer } from "../Components"

function Download() {
    let { beatmapsetid } = useParams()
    const [searchParams] = useSearchParams()
    const [dlURL, setDlURL] = useState('')

    useEffect(() => {
        var trueList = ['true', '1']
        var noVideo = searchParams.get('novideo')
        var noBg = searchParams.get('nobg')
        var noHitsound = searchParams.get('nohitsound')
        var noStoryboard = searchParams.get('nostoryboard')

        var paramList = [trueList.includes(noVideo), trueList.includes(noBg), trueList.includes(noHitsound), trueList.includes(noStoryboard)]

        if (noVideo !== null || noBg !== null || noHitsound !== null || noStoryboard !== null) {
            setDlURL(GeneralMixins.generateDownloadURL(beatmapsetid, paramList))
        } else setDlURL(GeneralMixins.generateDownloadURL(beatmapsetid))
    }, [])

    return (
        <Fragment>
            <Helmet>
                <meta httpEquiv="refresh" content={`0; url=${dlURL}`} />
            </Helmet>
            <Navbar/>
            <div className="container">
                <div className="download-page">
                    <div className="owo">
                        <h1>Thank you for using Nerinyan!🐈</h1>
                        <h2>잠시후, 비트맵 다운로드가 시작됩니다. 다운로드가 시작되지 않을 경우 <a href={dlURL}>여기를 클릭해 수동으로 받아주세요!</a></h2>
                        <h2>Your Requested Beatmapset will download in seconds... Download failed? <a href={dlURL}>Click Here to download manually.</a></h2>
                    </div>
                    <a href="/main">
                        <button>
                            Return to Main Page
                        </button>
                    </a>
                </div>
            </div>
            <Footer/>
        </Fragment>
    )
}

export default Download
