import React, { Fragment } from "react"
import { Link } from "react-router-dom"

function Navbar() {
    return (
        <Fragment>
            <nav>
                <div>
                    <h1>
                        <Link to="/main">Nerinyan: osu! Beatmap Mirror</Link>
                    </h1>
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
                </div>
            </nav>
        </Fragment>
    )
}

export default Navbar