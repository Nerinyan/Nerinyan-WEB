import React, { Fragment, useState } from "react"
import { Link } from "react-router-dom"

import { useTranslation } from "react-i18next"
import { getCookie, setCookie } from "../lib/GeneralMixins"

import '../assets/css/components/notice.css'

function Notice() {
    const { t } = useTranslation()
    const [visible, setVisible] = useState(true)
    const survey = getCookie("survey")
    
    return (
        <Fragment>
            {visible && survey !== "hide" && (
                <div className="survey-notice">
                    <div className="notice-header">
                        <h3>Please participate the Survey!</h3>
                        <button onClick={() => setVisible(false)}>
                            X
                        </button>
                    </div>
                    <p>
                        Hello, <br/>
                        First of all, thank you for using Nerinyan. <br/>
                        <br/>
                        We are conducting a simple survey to provide better services. <br/>
                        The survey is very brief and is expected to take approximately two minutes to complete. <br/>
                        Your valuable feedback will greatly contribute to the growth and improvement of Nerinyan. <br/>
                        <br/>
                        We kindly ask for your participation, and we sincerely appreciate everyone who takes the time to respond to the survey. <br/>
                        <br/>
                        Best regards, <br/>
                        Team Nerinyan.
                    </p>
                    <div className="notice-buttons">
                        <button onClick={() => {
                            setCookie("survey", "hide")
                            window.location.href = "https://forms.gle/nR9Y5UsB4wsePMHX7"
                        }}>
                            Participate
                        </button>
                        <button onClick={() => {
                            setCookie("survey", "hide")
                        }}>
                            Dismiss
                        </button>
                    </div>
                </div>
            )}
        </Fragment>
    )
}

export default Notice