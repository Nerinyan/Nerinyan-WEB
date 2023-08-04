import React, { Fragment } from "react"
import { Link } from "react-router-dom"

import '../assets/css/components/navbar.css'

function Navbar() {
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
                                Browse
                            </Link>
                        </li>
                        <li>
                            <Link to="/mappack">
                                Beatmap Packs
                            </Link>
                        </li>
                        <li>
                            <a href="https://api.nerinyan.moe">
                                Document
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </Fragment>
    )
}

export default Navbar