import React, { Fragment } from "react"
import { Navbar, Footer } from "../Components"

function NotFound() {
    return (
        <Fragment>
            <Navbar/>
            <div className="container">
                <div className="download-page">
                    <div className="owo">
                        <h1>404 Not Found 🙀</h1>
                        <h2>이런! 대체 무엇을 찾고 계신 건가요?</h2>
                        <h2>What the heck are you looking for?</h2>
                    </div>
                    <a href="/main">
                        <button>
                            Return to Main Page
                        </button>
                    </a>
                </div>
            </div>
            <Footer/>
        </Fragment>
    )
}

export default NotFound
