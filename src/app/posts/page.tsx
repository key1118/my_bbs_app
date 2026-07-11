import { Suspense } from 'react';
import PostList from './PostList';
import Loader from '../Loader';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Link
        href='/'
        style={{
          display: 'inline-block',
          marginBottom: '20px',
          color: '#0070f3',
        }}
      >
        &larr; ホームに戻る
      </Link>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: '"Hiragino Maru Gothic ProN", "Yu Gothic", sans-serif' }}>
        <span style={{color: "#fff", fontSize: "35px" }}>記事一覧</span>
        <Link href={"/posts/create"} className='btn' style={{ textAlign: "center" }}>投稿する</Link>
      </div>
      <Suspense fallback={<Loader />}>
        <PostList />
      </Suspense>
    </div>
  );
}
