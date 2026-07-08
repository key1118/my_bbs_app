'use server';

import { redirect } from 'next/navigation';
import { cacheTag, updateTag } from 'next/cache';
import { getRepository } from '@/utils/data-source';
import { Post } from '@/entities/Post';
import { verifySession } from '@/utils/session';
import { User } from '@/entities/User';
import { Like } from '@/entities/Like';

export async function createPost(formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    let id: number;

    if (!title || !content) {
        return { error: "タイトルと本文を入力してください" };
    }

    try {
        const session = await verifySession();
        if (!session || !session.userId) {
            return { error: 'ログインしてください' }
        }

        const postRepository = await getRepository(Post);
        const userRepository = await getRepository(User);

        // ユーザーの取得（リレーションのため）
        const user = await userRepository.findOneBy({ id: Number(session.userId) });
        if (!user) {
            return { error: 'ユーザーが見つかりません' };
        }
        id = user.id

        const newPost = postRepository.create({
            title,
            content,
            user: user, // ユーザーオブジェクトをセット
        });

        await postRepository.save(newPost);
    } catch (e) {
        console.error(e);
        return { error: '投稿の作成中(createPost)にエラーが発生しました' };
    }
    updateTag('posts');
    updateTag(`user-${id}`)
    redirect('/posts');
}

export async function getPosts() {
    "use cache";
    cacheTag("posts");

    const postRepository = await getRepository(Post);

    // 投稿一覧を取得（作成日時の降順）
    const posts = await postRepository.find({
        relations: {
            user: true,
            replies: true
        },
        order: {
            createdAt: 'DESC',
        },
    });

    return posts.map((post) => ({
        ...post,
        user: { ...post.user },
        replies: post.replies ? post.replies.map((reply) => ({
            ...reply,
        })) : []
    }));
}

export async function getPost(id: number) {
    "use cache";
    cacheTag(`post-${id}`);
    cacheTag(`reply-${id}`)
    const postRepository = await getRepository(Post);

    const post = await postRepository.findOne({
        where: { id },
        // 1. relationsに replies と replies.user を指定する
        relations: {
            user: true,
            replies: {
                user: true // リプライしたユーザーの情報も一緒に取る
            }
        },
    });

    if (!post) return null;
    
    // 2. 返却データの整形
    return {
        ...post,
        user: { ...post.user },
        // リプライの配列をループして安全にマッピング
        replies: post.replies ? post.replies.map((reply) => ({
            ...reply,
            user: {...reply.user}
        })) : []
    };
}

export async function editPost(postId: number, formData: FormData) {
    const post = await getPost(postId);
    if (!post) {
        return { error: '投稿が見つかりません' };
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    let id: number;

    if (post.title === title && post.content === content) {
        return { error: "タイトルと本文が編集されていません" };
    }

    try {
        const session = await verifySession();
        if (!session || !session.userId) {
            return { error: 'ログインしてください' }
        }
        id = Number(session.userId);

        const postRepository = await getRepository(Post);

        // ユーザーの取得（リレーションのため）
        const post = await getPost(Number(postId));

        if (!post) {
            return { error: '指定された投稿が見つかりません' };
        }

        // 💡 [セキュリティ対策] 投稿の所有者とログインユーザーが一致しているかチェック
        if (post.userId !== Number(session.userId)) {
            return { error: '編集権限がありません' };
        }

        await postRepository.update(postId, {
            title: title,
            content: content
        });
    } catch (e) {
        console.error(e);
        return { error: '投稿の作成中にエラーが発生しました' };
    }
    updateTag('posts');
    updateTag(`post-${id}`);
    updateTag(`user-${id}`)
    redirect('/posts');
}

export async function deletePost(id: number) {

    try {

        const session = await verifySession();
        if(!session || !session.userId){
            return { error: 'ログインしてください'};
        }
        const postRepository = await getRepository(Post);
        const post = await postRepository.findOne({
            where: { id },
            relations: { user: true },
        });
        if (!post) {
            return { error: '投稿が見つかりません' };
        }
        // 本人の投稿か確認
        if (post.user.id !== Number(session.userId)) {
            return { error: '削除権限がありません' };
        }
        await postRepository.remove(post);
    } catch (error) {
        console.error("投稿の削除中(deletePost)にエラーが発生しました", error);
        return {error: "投稿削除中にエラーが発生しました"};
    }
    updateTag('posts');
    updateTag(`posts-${id}`);
    redirect('/posts');

}