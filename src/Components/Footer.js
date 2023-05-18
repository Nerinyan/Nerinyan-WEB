import React, { Fragment, useState } from "react"
import { Link } from "react-router-dom"

import '../assets/css/components/footer.css'

function Footer() {
    return (
        <Fragment>
            <footer>
                <span>
                    NeriNyan powered 2021 ~ 2023 | not affiliated with ppy, osu!
                </span>
                <ul>
                    <li>
                        <a href="https://api.nerinyan.moe">
                            <i className="fa-solid fa-book"></i>
                            Document
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/Nerinyan">
                            <i className="fa-brands fa-github"></i>
                            Github
                        </a>
                    </li>
                    <li>
                        <a href="mailto:admin@nerinyan.moe">
                            <i className="fa-solid fa-circle-x"></i>
                            DMCA
                        </a>
                    </li>
                    <li>
                        <a href="https://discord.gg/StNbVPT7y7">
                            <i className="fa-brands fa-discord"></i>
                            Discord
                        </a>
                    </li>
                    <li>
                        <Link to="/info">
                            <i className="fa-solid fa-circle-info"></i>
                            Info/status
                        </Link>
                    </li>
                </ul>
            </footer>
        </Fragment>
    )
}

export default Footer