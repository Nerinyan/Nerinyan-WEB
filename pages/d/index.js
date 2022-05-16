import { useRouter } from 'next/router'
import Link from 'next/link'

const Post = () => {
    const router = useRouter()
    const { id } = router.query

    console.log("/d", router.query)

    return (
        <>
            <h1>g2</h1>
        </>
    )
}

export default Post