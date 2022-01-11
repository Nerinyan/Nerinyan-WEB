import React, {Fragment} from "react"
import { Link } from "react-router-dom"

function Navbar() {
    return (
        <Fragment>
            <nav>
                <h1>Navbar</h1>
                <ul>
                    <li>
                        <Link to="/main">Home</Link>
                    </li>
                    <li>
                        <Link to="/2">test</Link>
                    </li>
                </ul>
            </nav>
        </Fragment>
    )
}

export default Navbar