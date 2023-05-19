import { createPortal } from "react-dom"
import { setGlobalState, getGlobalState } from './store'

const Portal = ({ children, expendIdController, bid }) => {
    const portal = document.getElementById("portal")
    const beatmapPortal = document.getElementById("beatmap-portal")

    expendIdController(bid)
    console.log(getGlobalState("currentExpendedID"))
    // setGlobalState("currentExpendInfo", currentExpendInfo)
    // console.log(children)

    // if (document.getElementById("beatmap-portal") !== null) {
    //     beatmapPortal.remove()
    // }

    return createPortal(children, portal)
}

export default Portal;
