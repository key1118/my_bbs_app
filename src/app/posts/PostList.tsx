'use server'

import { getPosts } from '@/actions/post';
import Link from 'next/link';
import { Post } from '@/entities/Post';

export default async function PostList() {
  let posts: Post[] = [];
  try {
    posts = await getPosts();
  } catch (error) {
    console.error("投稿一覧取得中(getPosts)にエラーが発生しました", error)
    return (
      <div className='card' style={{ borderColor: '#ff4d4f' }}>
        <p className='post-content' style={{ color: '#ff4d4f' }}>
          ⚠️ 投稿の読み込みに失敗しました。時間をおいて再度お試しください。
        </p>
      </div>
    );
  }

  if(posts.length === 0) {
    return (
      <div className='card'>
        <p className='post-content'>投稿がありません</p>
      </div>
    )
  }

  return (
    <div className='post-list'>
      {posts.map((post) => (
      <div key={post.id} className='card'>
        <h3 className='post-title'>
          <Link href={`/posts/${post.id}`}>{post.title}</Link>
        </h3>
        <p className='post-meta'>
          投稿者: <Link href={`/profile/${post.user.id}`} style={{color: '#3487b0'}}>@{post.user.userName}</Link> | 作成日:{new Date(post.createdAt).toLocaleDateString()}
        </p>
        <p className='post-content'>{post.content}</p>
        <p style={{color: "#666"}}>いいね: {post.goods} | 返信: {post.replies ? post.replies.length : 0}件</p>
      </div>
      ))}
    </div>
  );
}
