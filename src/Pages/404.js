import React, { Fragment } from "react"
import { Navbar, Footer } from "../Components"
import { useTranslation } from "react-i18next"

function NotFound() {
    const { t } = useTranslation()
    return (
        <Fragment>
            <Navbar/>
            <div className="container">
                <div className="download-page">
                    <div className="owo">
                        <h1>{t("not_found")}</h1>
                        <h2>{t("not_found_message")}</h2>
                        <h2>{t("not_found_message2")}</h2>
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

export default NotFound
