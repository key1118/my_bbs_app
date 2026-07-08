"use server"

import {Reply} from "@/entities/Reply";
import { Post } from "@/entities/Post";
import { User } from "@/entities/User";
import { getRepository } from "@/utils/data-source";
import { verifySession } from "@/utils/session";
import { updateTag } from "next/cache";

export async function createReply(post: Post, text: string) {
    if (text === "") {
        return { error: "テキストを入力してください" };
    }
    try {
        const session = await verifySession();
        if (!session || !session.userId) {
            return { error: 'ログインしてください' }
        }
        const userId = Number(session.userId);

        const userRepository = await getRepository(User);
        const replyRepository = await getRepository(Reply);


        // 投稿の取得（リレーションのため）
        if (!post) {
            return { error: '投稿が見つかりません。すでに削除済みの可能性があります。' };
        }
        // ユーザーの取得（リレーションのため）
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            return { error: 'ユーザーが見つかりません' };
        }

        const newReply = replyRepository.create({
            content: text,
            post,
            user // ユーザーオブジェクトをセット
        });

        await replyRepository.save(newReply);
    } catch (e) {
        console.error(e);
        return { error: '投稿返信の作成中(createReply)にエラーが発生しました' };
    }
    updateTag(`reply-${post.id}`);
    updateTag("posts");

}