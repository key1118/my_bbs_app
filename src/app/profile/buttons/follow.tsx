"use client"
import { createFollow, deleteFollow, getFollow } from "@/actions/follow";
import { useState, useEffect } from "react";

export default function FollowButton({userId}: {userId: number}) {
    const [isFollowing, setIsFollowing] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const handleFollow = async () => {
        setIsFollowing(prev => !prev);
        await createFollow(userId);
    }
    const handleUnfollow = async () => {
        setIsFollowing(prev => !prev);
        await deleteFollow(userId);
    }

    useEffect(() => {
        const setFollowState = async () => {
            const result = await getFollow(userId);
            // エラーオブジェクトが返ってきた場合
            if(result && typeof result === 'object' && 'error' in result) {
                console.error("フォロー取得中(getFollow)でエラー", result.error)
                setError(result.error)
                return
            }
            setIsFollowing(result)
        }
        setFollowState();
    }, [userId])

    return (
    <>
        {error && <p className='error-message'>{error}</p>}
        {!isFollowing ? (
            <button className='btn' onClick={handleFollow}>
                フォローする
            </button>
        ) :
        (
            <p className="btn-following" onClick={handleUnfollow}>フォロー解除</p>
        )}
    </>
);
}
