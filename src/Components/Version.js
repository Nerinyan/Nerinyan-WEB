import React, { Fragment } from "react"

function Version({ ver, isCollapse }) {
    return (
        <Fragment>
            {ver.version} | {isCollapse ? 'collapse' : 'expand'}
        </Fragment>
    )
}

export default Version