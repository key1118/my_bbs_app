'use server'

import { getPost } from '@/actions/post';
import DeletePostButton from '../buttons/DeletePostButton';
import { verifySession } from '@/utils/session';
import Link from 'next/link';
import { Post } from '@/entities/Post';
import InitialGoodButton from '../goods/InitialGoodButton';
import Reply from './Reply';

export default async function PostDetail({params}: {params: Promise<{id: string}>}) {
  const postId = Number((await params).id);
  let post: Post | null = null
  try {
    post = await getPost(postId);
  } catch (error) {
    console.error("投稿取得中(getPost)にエラーが発生しました。", error)
    return (
      <div className='card' style={{ borderColor: '#ff4d4f' }}>
        <p className='post-content' style={{ color: '#ff4d4f' }}>
          ⚠️ 投稿の読み込みに失敗しました。時間をおいて再度お試しください。
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className='card' style={{ borderColor: '#ff4d4f' }}>
        <p className='post-content' style={{ color: '#ff4d4f' }}>
          ⚠️ 投稿の読み込みに失敗しました。時間をおいて再度お試しください。
        </p>
      </div>
    )
  }

  const session = await verifySession();
  if(!session || !session.userId) {
    return (
      <p className='error-message'>ログインしてください</p>
    )
  }
  const userId: number = Number(session.userId);
  const isOwner = userId === post.user.id; // 投稿者の場合 (削除ボタン表示)

  return (
    <>
      <div className='card'>
        <h1 style={{ marginBottom: '15px', fontSize: '24px' }}>
          {post.title}
        </h1>
        <div
          style={{
            color: '#666',
            fontSize: '14px',
            marginBottom: '20px',
            borderBottom: '1px solid #eee',
            paddingBottom: '10px',
          }}
        >
          投稿者: <Link href={`/profile/${post.user.id}`} style={{color: '#3487b0'}}>@{post.user.userName}</Link> | 作成日: {new Date(post.createdAt).toLocaleDateString()} | {<InitialGoodButton postId={post.id} />}
        </div>
        <div style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap', color: "#666"}}>
          {post.content}
        </div>
      </div>

      {isOwner && (
        <div style={{ marginTop: '20px' }}>
          <Link href={`/posts/edit/${postId}`} className='btn-edit'>
            編集
          </Link>
          <span style={{margin: "5px"}} />
          <DeletePostButton postId={postId} />
        </div>
      )}
      <Reply post = {post}/>
    </>
  );
}
