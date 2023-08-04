import React, { Fragment } from "react"
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
                        <a href="mailto:admin@nerinyan.moe">
                            DMCA
                        </a>
                    </li>
                    <li>
                        <a href="https://api.nerinyan.moe">
                            Document
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/Nerinyan">
                            Github
                        </a>
                    </li>
                    <li>
                        <a href="https://discord.gg/StNbVPT7y7">
                            Discord
                        </a>
                    </li>
                    <li>
                        <Link to="/info">
                            Info/status
                        </Link>
                    </li>
                </ul>
            </footer>
        </Fragment>
    )
}

export default Footer