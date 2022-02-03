import { createGlobalState } from "react-hooks-global-state"

const { setGlobalState, useGlobalState } = createGlobalState({
    musicPlayerBeatmap: [],
    musicPlayerIsPlaying: false
})

export { useGlobalState, setGlobalState }
