import React, { Fragment } from "react"
import { Link } from "react-router-dom"

import { useTranslation } from "react-i18next"

import '../assets/css/components/footer.css'

function Footer() {
    const { t } = useTranslation()
    
    return (
        <Fragment>
            <footer>
                <span>
                    {t("footer_nerinyan_powered")}
                </span>
                <ul>
                    <li>
                        <a href="mailto:admin@nerinyan.moe">
                            {t("footer_dmca")}
                        </a>
                    </li>
                    <li>
                        <a href="https://api.nerinyan.moe">
                            {t("footer_documents")}
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/Nerinyan">
                            {t("footer_github")}
                        </a>
                    </li>
                    <li>
                        <a href="https://discord.gg/StNbVPT7y7">
                            {t("footer_discord")}
                        </a>
                    </li>
                    <li>
                        <Link to="/info">
                            {t("footer_info/status")}
                        </Link>
                    </li>
                </ul>
            </footer>
        </Fragment>
    )
}

export default Footer