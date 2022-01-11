import React, { Fragment, } from "react"

function Beatmap({ bmap }) {
    return (
        <Fragment>
            <div className="beatmap-block">
                <div className="beatmap-single">
                    <div className="beatmap-bg-default"></div>
                    <a href="/" target="_blank" id={bmap.id} className="card-header"
                    style={{backgroundImage: 'url(/images/beatmaps-default.png), linear-gradient(to right, #00000099, #ffe4e100), url(https://assets.ppy.sh/beatmaps/'+bmap.id+'/covers/cover.jpg?1622784772'}}>
                        <div className="card-header-beatmapinfo">
                            {bmap.id} - {bmap.title}
                        </div>
                    </a>
                </div>
            </div>
        </Fragment>
    )
}

export default Beatmap