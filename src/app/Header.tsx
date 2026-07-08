import { logout } from '@/actions/auth';
import { verifySession } from '@/utils/session';
import Link from 'next/link';

export default async function Header() {
  const session = await verifySession();
  return (
    <header style={{ 
      // 💡 すりガラス風（バックドロップフィルタ）の半透明ホワイトにして可愛らしく
      backgroundColor: "rgba(34, 21, 21, 0.75)",
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', // 優しい影
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
            // 💡 ロゴに優しい色（コーラルピンク系、お好みで淡い水色などでも◎）
            color: '#eee', 
            textDecoration: 'none',
            letterSpacing: '0.5px',
            textAlign: 'center'
          }}>
            ホームへ
          </Link>
        </h1>

        {session && session.userId && (
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>

            {/* 【ユーザー】のドロップダウン */}
            <div className="dropdown">
              <span className="nav-item" style={{ color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
                ユーザー
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link href='/profile'>一覧</Link>
                </li>
                <li>
                  <Link href={`/profile/${session.userId}`}>自身のプロフィール</Link>
                </li>
              </ul>
            </div>

            {/* 【記事】のドロップダウン */}
            <div className="dropdown">
              <span className="nav-item" style={{ color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
                投稿
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link href='/posts'>投稿一覧</Link>
                </li>
                <li>
                  <Link href='/posts/create'>投稿作成</Link>
                </li>
              </ul>
            </div>

            {/* ログアウトボタン */}
            <form action={logout} style={{ margin: 0 }}>
              <button
                type='submit'
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                ログアウト
              </button>
            </form>
          </nav>
        )}
      </div>
    </header>
  );
}