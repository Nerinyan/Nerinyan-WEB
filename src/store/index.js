import { createGlobalState } from "react-hooks-global-state"

const { setGlobalState, useGlobalState } = createGlobalState({
    musicPlayerBid: '0',
    musicPlayerIsPlaying: false
})

export { useGlobalState, setGlobalState }
