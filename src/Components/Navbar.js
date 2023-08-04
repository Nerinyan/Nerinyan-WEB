import React, { Fragment } from "react"
import { Link } from "react-router-dom"

import { useTranslation } from "react-i18next"

import '../assets/css/components/navbar.css'

function Navbar() {
    const { t } = useTranslation()

    return (
        <Fragment>
            <nav>
                <div>
                    <h1>
                        <Link to="/">
                            NeriNyan: osu! Beatmap Mirror
                        </Link>
                    </h1>
                    <ul>
                        <li>
                            <Link to="/main">
                                {t("navbar_beatmaps")}
                            </Link>
                        </li>
                        <li>
                            <Link to="/mappack">
                                {t("navbar_beatmap_pack")}
                            </Link>
                        </li>
                        <li>
                            <a href="https://api.nerinyan.moe">
                                {t("navbar_documents")}
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </Fragment>
    )
}

export default Navbar