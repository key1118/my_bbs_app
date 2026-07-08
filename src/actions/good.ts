'use server'

import { Like } from "@/entities/Like";
import { Post } from "@/entities/Post";
import { getRepository } from "@/utils/data-source";
import { verifySession } from "@/utils/session";
import { updateTag } from "next/cache";

// ■ いいねを増やす処理
export async function incrementGoods(postId: number) {
    try {
        // 1. セッションチェック
        const session = await verifySession();
        if (!session || !session.userId) {
            return { error: "ログインしてください" };
        }
        const userId = Number(session.userId);

        const postRepository = await getRepository(Post);
        const likeRepository = await getRepository(Like);

        // 2. 対象の投稿が存在するか先にチェック
        const post = await postRepository.findOne({ where: { id: postId } });
        if (!post) {
            return { error: "該当の投稿が見つかりません" };
        }

        // 3. 既にいいねしていないかチェック
        const alreadyLiked = await likeRepository.findOne({ where: { userId, postId } });
        if (alreadyLiked) {
            return { error: "すでにいいねしています。別のブラウザから操作された可能性があります。ページを再リロードしてください" };
        }

        // 4. Likeテーブルにレコードを追加
        const newLike = likeRepository.create({ userId, postId });
        await likeRepository.save(newLike);

        // 5. Likeテーブルから最新の総いいね数をカウントする
        const exactGoodsCount = await likeRepository.count({ where: { postId } });

        // 6. カウントした正確な数で Post テーブルの goods のみをピンポイントで更新
        await postRepository.update({ id: postId }, { goods: exactGoodsCount });


    } catch (error) {
        console.error("incrementGoods でエラーが発生しました:", error);
        return { error: "サーバーでエラーが発生しました。時間をおいて再度お試しください。" };
    }
    updateTag("posts");
    updateTag(`post-${postId}`);
}

// ■ いいねを解除する処理
export async function decrementGoods(postId: number) {
    try {
        // 1. セッションチェック
        const session = await verifySession();
        if (!session || !session.userId) {
            return { error: "ログインしてください" };
        }
        const userId = Number(session.userId);

        const postRepository = await getRepository(Post);
        const likeRepository = await getRepository(Like);

        // 2. 対象の投稿が存在するか先にチェック
        const post = await postRepository.findOne({ where: { id: postId } });
        if (!post) {
            return { error: "該当の投稿が見つかりません" };
        }

        // 3. 【修正】いいねが存在するかチェック（なければ解除できない）
        const alreadyLiked = await likeRepository.findOne({ where: { userId, postId } });
        if (!alreadyLiked) {
            return { error: "まだいいねしていません。別のブラウザから操作された可能性があります。ページを再リロードしてください" };
        }

        // 4. Likeテーブルのレコードを削除
        await likeRepository.delete({ userId, postId });

        // 5. Likeテーブルから最新の総いいね数をカウントする
        const exactGoodsCount = await likeRepository.count({ where: { postId } });

        // 6. カウントした正確な数で Post テーブルの goods のみをピンポイントで更新
        await postRepository.update({ id: postId }, { goods: exactGoodsCount });


    } catch (error) {
        // 【修正】ログ出力を decrementGoods に変更
        console.error("decrementGoods でエラーが発生しました:", error);
        return { error: "サーバーでエラーが発生しました。時間をおいて再度お試しください。" };
    }
    updateTag("posts");
    updateTag(`post-${postId}`);
}

type InitialGoodStateResultResult =
  | { initialLiked: boolean; goods: number }
  | { error: string };

export async function InitialGoodState(postId: number): Promise<InitialGoodStateResultResult> {
    const session = await verifySession();

    let initialLiked: boolean = false;
    const likeRepository = await getRepository(Like);
    const hasLikeRecord = await likeRepository.findOne({ where: { userId: Number(session?.userId), postId } });
    if(hasLikeRecord != null) {
        initialLiked = true
    }

    const postRepository = await getRepository(Post);
    const post = await postRepository.findOne({ where: { id: postId } });
    if(!post) {
        return {error: "記事が見つかりません"}
    }
    const goods: number = post.goods



    return {
        initialLiked,
        goods
    };
}