'use server'

import { Follow } from "@/entities/Follow";
import { getRepository } from "@/utils/data-source";
import { verifySession } from "@/utils/session";
import { updateTag } from "next/cache";

export async function createFollow(followingId: number) {
    let followerId: string;
    try {
        const follower = await verifySession();
        if(!follower || !follower.userId) {
            return {error: 'ログインしてください。'}
        }
        const followRepository = await getRepository(Follow);

        followerId = follower.userId;

        // 👇 ここに差し込みます（saveする直前）
        console.log("--- 【デバッグ】新規フォロー処理データチェック ---");
        console.log("followerId の値:", followerId, "型:", typeof followerId);
        console.log("followingId の値:", followingId, "型:", typeof followingId);
        if (isNaN(Number(followerId))) {
            console.error("❌ エラー: followerId が NaN になっています！");
        }

        const newFollow = followRepository.create({
            followerId: Number(followerId),
            followingId: Number(followingId),
        });

        await followRepository.save(newFollow);
    } catch (error) {
        // catchでも念のためエラーをログに出す
        console.error("catch内のエラー:", error);
        return { error: 'フォローの際にエラーが発生しました' };
    }
    updateTag("users")
    updateTag(`user-${followingId}`)
    updateTag(`user-${followerId}`)

}

export async function getFollow(followingId: number) {
    let followerId: string;
    let matchedFollow: Follow | null;
    try {
        const follower = await verifySession();
        if(!follower || !follower.userId) {
            return {error: 'ログインしてください。'}
        }
        const followRepository = await getRepository(Follow);

        followerId = follower.userId
        matchedFollow = await followRepository.findOne({
            where: {
                followerId: Number(followerId),
                followingId: Number(followingId)
            }
        })
    } catch(e) {
        return { error: `フォローの際にエラーが発生しました, ${e}`};
    }
    return !!matchedFollow
}

export async function deleteFollow(followingId: number) {
    let followerId: string;
    try {
        const follower = await verifySession();
        if(!follower || !follower.userId) {
            return {error: 'ログインしてください。'}
        }
        const followRepository = await getRepository(Follow);

        followerId = follower.userId

        await followRepository.delete({
            followerId: Number(followerId),
            followingId: Number(followingId)
        });

    } catch(err) {
        console.error("フォロー処理でエラーが発生しました:", err);
        return { error: 'フォローの際にエラーが発生しました' };
    }
    updateTag("users")
    updateTag(`user-${followingId}`)
    updateTag(`user-${followerId}`)

}

export async function isMutualFollow(followingId: number) {
    let followerId: number;
    let matchedFollow: boolean;
    try {
        const follower = await verifySession();
        if(!follower || !follower.userId) {
            throw new Error("ログインしてください")
        }
        const followRepository = await getRepository(Follow);

        followerId = Number(follower.userId);
        const following = await followRepository.findOne({
            where: {
                followerId: Number(followerId),
                followingId: Number(followingId)
            }
        })
        const followedBy = await followRepository.findOne({
            where: {
                followerId: Number(followingId),
                followingId: Number(followerId)
            }
        })
        matchedFollow = (!!following && !! followedBy)
    } catch {
        throw new Error("DM可能条件判定中にエラーが起きました")
    }
    return matchedFollow;
}