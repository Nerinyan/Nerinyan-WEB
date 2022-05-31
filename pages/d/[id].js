import React from "react"
import Head from 'next/head'
import { useRouter } from "next/router"
import { GeneralMixins } from "../../components"

function Download({ BID }) {
    const { useEffect } = React
    
    const router = useRouter()

    if (router.isFallback) return <div>Loading...</div>

    function generateDownloadURL() {
        if (router.query.novideo === "1" || router.query.novideo === "true") {
            return GeneralMixins.generateDownloadURL(router.query.id, false)
        } else {
            return GeneralMixins.generateDownloadURL(router.query.id)
        }
    }

    useEffect(() => {
        if (router.query.novideo) console.log(router.query.novideo)
    })
    
    return (
        <>
            <Head>
                <meta httpEquiv="refresh" content={`0; url=${generateDownloadURL()}`} />
            </Head>
            <div className="container">
                <div className="download-page">
                    <div className="owo">
                        <h1>Thank you for using Nerinyan!🐈</h1>
                        <h2>잠시후, 비트맵 다운로드가 시작됩니다. 다운로드가 시작되지 않을 경우 <a href={generateDownloadURL()}>여기를 클릭해주세요.</a></h2>
                        <h2>Your Requested Beatmapset will download in seconds... Download failed? <a href={generateDownloadURL()}>Click Here to download manually.</a></h2>
                    </div>
                    <a href="/main">
                        <button>
                            Return to Main Page
                        </button>
                    </a>
                </div>
            </div>
        </>
    )
}

export default Download
