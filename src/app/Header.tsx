import { verifySession } from '@/utils/session';
import Link from 'next/link';
import NavMenu from './NavMenu'; // 1. 作成したコンポーネントをインポート
import { Suspense } from 'react';
import Loader from './Loader';

export default async function Header() {
  return (
    <Suspense fallback={<Loader />}>
      <HeaderContent />
    </Suspense>
  )
}
export async function HeaderContent() {
  const session = await verifySession();
  
  return (
    <header style={{ 
      backgroundColor: "rgba(34, 21, 21, 0.75)",
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', 
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      padding: '12px 0', 
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div
        className='container'
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}
      >
        <h1>
          <Link href='/' style={{ 
            fontSize: '22px', 
            fontWeight: '800', 
            color: '#eee', 
            textDecoration: 'none',
            letterSpacing: '0.5px',
            textAlign: 'center',
            // 💡 ここがポイント：画面が狭くなっても絶対に改行させない
            whiteSpace: 'nowrap' 
          }}>
            ホームへ
          </Link>
        </h1>

        {/* 2. セッションがある場合、切り出したメニューを呼び出す */}
        {session && session.userId && (
          <NavMenu userId={session.userId} />
        )}
      </div>
    </header>
  );
}