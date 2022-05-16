import Head from 'next/head'
import App from 'next/app'

import '../assets/css/import.css'
import 'antd/dist/antd.min.css'

import { Navbar, MusicPlayer } from '../components'

class Nerinyan extends App {
    render() {
        const { Component, pageProps } = this.props
        return (
            <>
                <Head>
                    <title>Nerinyan - osu! Beatmap Mirror</title>
                </Head>
                <Navbar />
                <Component {...pageProps} />
                <MusicPlayer />
            </>
        )
    }
}

export default Nerinyan