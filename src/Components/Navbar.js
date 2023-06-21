import React, { Fragment } from "react"
import { Link } from "react-router-dom"

import '../assets/css/components/navbar.css'

function Navbar() {
    return (
        <Fragment>
            <nav>
                <div>
                    <h1>
                        <a href="https://nerinyan.moe/main">NeriNyan: osu! Beatmap Mirror</a>
                    </h1>
                    <ul>
                        <li>
                            <a href="https://api.nerinyan.moe">
                                <i className="fa-solid fa-book"></i>
                                Document
                            </a>
                        </li>
                        <li>
                            <a href="mailto:admin@nerinyan.moe">
                                <i className="fa-solid fa-circle-x"></i>
                                DMCA
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </Fragment>
    )
}

export default Navbar