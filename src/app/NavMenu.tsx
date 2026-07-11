"use client"

import { useState } from 'react';
import Link from 'next/link';
import { logout } from '@/actions/auth';

type NavMenuProps = {
  userId: string;
};

export default function NavMenu({ userId }: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 400px以下で表示されるトグルボタン（ハンバーガー） */}
      <button 
        className="menu-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="メニューを開閉"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* ナビゲーションメニュー */}
      <nav className={`nav-container ${isOpen ? 'is-open' : ''}`}>
        {/* 【ユーザー】 */}
        <div className="dropdown">
          <span className="nav-item">ユーザー</span>
          <ul className="dropdown-menu">
            <li><Link href='/profile' onClick={() => setIsOpen(false)}>一覧</Link></li>
            <li><Link href={`/profile/${userId}`} onClick={() => setIsOpen(false)}>自身のプロフィール</Link></li>
          </ul>
        </div>

        {/* 【投稿】 */}
        <div className="dropdown">
          <span className="nav-item">投稿</span>
          <ul className="dropdown-menu">
            <li><Link href='/posts' onClick={() => setIsOpen(false)}>投稿一覧</Link></li>
            <li><Link href='/posts/create' onClick={() => setIsOpen(false)}>投稿作成</Link></li>
          </ul>
        </div>

        {/* ログアウト */}
        <form action={logout} style={{ margin: 0 }}>
          <button type='submit' className="logout-btn">
            ログアウト
          </button>
        </form>

        <div className="dropdown">
          <Link href={"/aboutMe"} className="nav-item" style={{color: "#fff"}}>私について</Link>
        </div>
      </nav>

      {/* スタイル定義 */}
      <style jsx>{`
        .nav-container {
          display: flex;
          gap: 24px;
          align-items: center;
        }
        .nav-item {
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }
        .logout-btn {
          background-color: transparent;
          border: none;
          color: #fff;
          font-weight: bold;
          cursor: pointer;
          fontSize: 16px;
        }
        .menu-toggle-btn {
          display: none;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 24px;
          cursor: pointer;
          z-index: 110;
        }

        /* 💡 幅400px以下のレスポンシブスタイル */
        @media (max-width: 400px) {
          .menu-toggle-btn {
            display: block; /* 400px以下でトグルボタンを表示 */
          }

          .nav-container {
            display: none; /* 通常時は非表示 */
            position: fixed;
            top: 0;
            right: 0;
            width: 200px;
            height: 100vh;
            background-color: rgba(34, 21, 21, 0.95);
            backdrop-filter: blur(10px);
            flex-direction: column;
            padding: 80px 20px 20px 20px;
            gap: 30px;
            align-items: flex-start;
            box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
            z-index: 105;
          }

          .nav-container.is-open {
            display: flex; /* トグル連動で開く */
          }
          
          /* モバイル時のドロップダウンメニューの調整（お好みで） */
          .dropdown-menu {
            position: relative;
            top: 5px;
            box-shadow: none;
            background: transparent;
            padding-left: 15px;
          }
        }
      `}</style>
    </>
  );
}