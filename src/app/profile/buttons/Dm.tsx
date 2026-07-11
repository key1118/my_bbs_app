import { isMutualFollow } from "@/actions/follow";

export default async function DMButton({userId}: {userId: number}) {
    const canMessage = await isMutualFollow(userId)
    return (
    canMessage && (
        <a className='btn-dm' href={`/message/${userId}`}>
            DMする
        </a>
    )
);
}