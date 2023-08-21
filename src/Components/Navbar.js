import React, { Fragment, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Dropdown, Space } from 'antd'
import { getCookie, setCookie } from "./GeneralMixins"

import '../assets/css/components/navbar.css'

function Navbar() {
    const location = useLocation()
    const [currentLang, setCurrentLang] = useState([getCookie("language")])
    const { t, i18n } = useTranslation()

    const items = [
        {
            key: 'en',
            label: (
                <div className="languages-single" onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    var lang = "en"
                
                    setCookie("language", lang)
                    i18n.changeLanguage(lang)

                    setCurrentLang([lang])
                }}>
                    <img className="flags" src={require("../assets/images/Flags/US.png")} alt="US flags"/>
                    <p>English</p>
                </div>
            ),
        },
        {
            key: 'de',
            label: (
                <div className="languages-single" onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    var lang = "de"
                
                    setCookie("language", lang)
                    i18n.changeLanguage(lang)

                    setCurrentLang([lang])
                }}>
                    <img className="flags" src={require("../assets/images/Flags/DE.png")} alt="DE flags"/>
                    <p>Deutsch</p>
                </div>
            ),
        },
        {
            key: 'kr',
            label: (
                <div className="languages-single" onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    var lang = "kr"
                
                    setCookie("language", lang)
                    i18n.changeLanguage(lang)

                    setCurrentLang([lang])
                }}>
                    <img className="flags" src={require("../assets/images/Flags/KR.png")} alt="KR flags"/>
                    <p>한국어</p>
                </div>
            ),
        },
        {
            key: 'ru',
            label: (
                <div className="languages-single" onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    var lang = "ru"
                
                    setCookie("language", lang)
                    i18n.changeLanguage(lang)

                    setCurrentLang([lang])
                }}>
                    <img className="flags" src={require("../assets/images/Flags/RU.png")} alt="ru flags"/>
                    <p>Русский</p>
                </div>
            ),
        },
        {
            key: 'id',
            label: (
                <div className="languages-single" onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    var lang = "id"
                
                    setCookie("language", lang)
                    i18n.changeLanguage(lang)

                    setCurrentLang([lang])
                }}>
                    <img className="flags" src={require("../assets/images/Flags/ID.png")} alt="id flags"/>
                    <p>Bahasa Indonesia</p>
                </div>
            ),
        },
        {
            key: 'help',
            label: (
                <div className="languages-single" onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()

                    window.open("https://github.com/Nerinyan/Nerinyan-i18n", '_blank')
                }}>
                    <p>Help us with translation!</p>
                </div>
            ),
        },
    ]

    function convertLanguageToImage() {
        switch (currentLang[0]) {
            case "en":
                return "US"
            case "de":
                return "DE"
            case "kr":
                return "KR"
            case "ru":
                return "RU"
            case "id":
                return "ID"
            default:
                return "__"
        }
    }

    return (
        <Fragment>
            <nav>
                
                <div className="left">
                    <h1>
                        <Link to="/">
                            NeriNyan: osu! Beatmap Mirror
                        </Link>
                    </h1>
                    <ul>
                        <li data-active={location.pathname === "/main" ? "active" : ""}>
                            <Link to="/main">
                                {t("navbar_beatmaps")}
                            </Link>
                        </li>
                        <li data-active={location.pathname === "/mappack" ? "active" : ""}>
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
                <div className="right">
                    <Dropdown
                        menu={{
                            items,
                            selectable: true,
                            selectedKeys: currentLang,
                        }}
                    >
                        <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <img className="flags" src={require(`../assets/images/Flags/${convertLanguageToImage()}.png`)} alt="flags"/>
                            <p>{t("navbar_language")}</p>
                        </Space>
                        </a>
                    </Dropdown>
                    <div className="mobile">
                        
                    </div>
                </div>
            </nav>
        </Fragment>
    )
}

export default Navbar