import React from 'react'
import { Fragment } from 'react'
import { GeneralMixins } from '../Components'

import '../assets/css/components/beatmap_portal.css'

function BeatmapPortal({ bmap }) {
    return (
        <Fragment>
            <div className='beatmap-popup-block' id={`beatmap-portal`}>
                <div className='beatmap-popup-content'>
                    <div className='beatmap-info-block' style={{ "--bg": "center / cover no-repeat url(https://assets.ppy.sh/beatmaps/"+bmap.id+"/covers/cover.jpg?1622784772" }}>
                        <div className='beatmap-diff-status'>
                            <ul className='diff-controller'>
                                <li>diff1</li>
                                <li>diff2</li>
                                <li>diff3</li>
                                <li>diff4</li>
                            </ul>
                            <span>{bmap.status}</span>
                        </div>
                        <div className='beatmap-info'>
                            <span className='beatmap-title'>{bmap.title}</span>
                            <span className='beatmap-artist'>{bmap.artist}</span>
                            <div className='beatmap-creator'>
                                <div className='creator-image'></div>
                                <div className='creator-info'>
                                    <span>mapped by {bmap.creator}</span>
                                    <span>submitted {bmap.submitted_date}</span>
                                    {
                                        bmap.ranked === 1 &&
                                        <span>ranked {bmap.ranked_date}</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default BeatmapPortal