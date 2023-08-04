import React, { Fragment, useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import { GeneralMixins, Navbar, Footer } from "../Components"

function Download() {
    const { t } = useTranslation()
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
                        <h1>{t("thank_you_for_using_nerinyan")}</h1>
                        <h2>{t("your_requested_beatmapset_will_download")} <a href={dlURL}>{t("click_here_to_download_manually")}</a></h2>
                    </div>
                    <a href="/main">
                        <button>
                            {t("return_to_main_page")}
                        </button>
                    </a>
                </div>
            </div>
            <Footer/>
        </Fragment>
    )
}

export default Download
