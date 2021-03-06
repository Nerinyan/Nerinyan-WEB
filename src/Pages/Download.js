import React, { Fragment, useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import { GeneralMixins, Navbar } from "../Components"

function Download() {
    let { beatmapsetid } = useParams()
    const [searchParams] = useSearchParams()
    const [dlURL, setDlURL] = useState('')

    useEffect(() => {
        if (searchParams.novideo !== null) {
            if (searchParams.novideo === 'true' || searchParams.novideo === '1') setDlURL(GeneralMixins.generateDownloadURL(beatmapsetid, false))
            else setDlURL(GeneralMixins.generateDownloadURL(beatmapsetid))
        }
        setDlURL(GeneralMixins.generateDownloadURL(beatmapsetid))
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
                        <h1>Thank you for using Nerinyan!π</h1>
                        <h2>μ μν, λΉνΈλ§΅ λ€μ΄λ‘λκ° μμλ©λλ€. λ€μ΄λ‘λκ° μμλμ§ μμ κ²½μ° <a href={dlURL}>μ¬κΈ°λ₯Ό ν΄λ¦­ν΄μ£ΌμΈμ.</a></h2>
                        <h2>Your Requested Beatmapset will download in seconds... Download failed? <a href={dlURL}>Click Here to download manually.</a></h2>
                    </div>
                    <a href="/main">
                        <button>
                            Return to Main Page
                        </button>
                    </a>
                </div>
            </div>
        </Fragment>
    )
}

export default Download
