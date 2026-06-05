import { Suspense } from 'react';
import PostList from './PostList';

export default function Home() {
  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>記事一覧</h2>
      <Suspense>
      <PostList />
      </Suspense>
    </div>
  );
}
