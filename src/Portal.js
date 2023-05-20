import { createPortal } from "react-dom"

const Portal = ({ children }) => {
    const portal = document.getElementById("portal")
    return createPortal(children, portal)
}

export default Portal
