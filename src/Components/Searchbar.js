import React, { Fragment, useEffect } from "react"
import { setGlobalState, useGlobalState } from '../store'
import { Input } from 'antd'
import { GeneralMixins } from "."

var delay = null;

function Searchbar() {
    const [apiJson] = useGlobalState("apiJson")
    var tempApiJon = apiJson
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function searchbarChangeHandler(event) {
        event.stopPropagation()
        event.preventDefault()
        clearTimeout(delay)
        tempApiJon.query = event.target.value
        tempApiJon.page = String(0)
        setGlobalState("apiJson", tempApiJon)
        delay = setTimeout(function() {
            setGlobalState("apiResult", [])
            GeneralMixins.getApiData(false)
        }, 500)
    }

    return (
        <Fragment>
            <Input onChange={searchbarChangeHandler} placeholder="Search...." />
        </Fragment>
    )
}

export default Searchbar