// 1. ページ上部で Google Fonts から可愛いフォントをインポートします
import { isMutualFollow } from '@/actions/follow';
import { getUsers } from '@/actions/users';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import Loader from './Loader';


export default function Home() {
    return (
        <Suspense fallback={<Loader />}>
            <HomeContent />
        </Suspense>
    )
}

export async function HomeContent() {
    const users = await getUsers();

    // 1. 全ユーザーに対して非同期で相互フォロー判定を行い、[true, false, true...] のような配列を作る
    const checkResults = await Promise.all(
        users.map(async (user) => await isMutualFollow(user.id))
    );

    // 2. 作成した判定結果のインデックス（順番）を使って、元の users 配列を filter する
    const dmUsers = users.filter((_, index) => checkResults[index]);

    return (
        <div>
            <h1 style={{
                fontSize: "6vw",
                whiteSpace: "nowrap",
                textAlign: "center",
                width: "100%",
                padding: "0 10px",
                boxSizing: "border-box"
            }}>
                ケイのポートフォリオ
            </h1>
            <div style={{
                marginTop: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px'
            }}>
                {/* 1. 友達を探すカード */}
                <Link href={"/profile"} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card" style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        backgroundColor: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%' // 👈 高さを揃える
                    }}>
                        {/* 💡 変更：画像コンテナ。 aspect-ratio や固定高さを指定して中身を fill にする */}
                        <div style={{ position: 'relative', width: '100%', height: '230px' }}>
                            <Image
                                src="/images/magnific_people-connecting-with-ea_3GUbfiuREY.png"
                                alt="友達を探す"
                                fill // 👈 親の幅・高さに自動で100%合わせる
                                sizes="(max-width: 768px) 100vw, 250px"
                                style={{ objectFit: 'cover' }} // 👈 アスペクト比を保ったまま綺麗に切り抜く
                            />
                        </div>
                        <p style={{ padding: '15px', margin: 0, fontWeight: 'bold' }}>友達を探す</p>
                    </div>
                </Link>

                {/* 2. 投稿するカード */}
                <Link href={"/posts"} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card" style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        backgroundColor: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%' // 👈 高さを揃える
                    }}>
                        {/* 💡 変更：同じく画像コンテナを作成 */}
                        <div style={{ position: 'relative', width: '100%', height: '230px' }}>
                            <Image
                                src="/images/magnific_a-tranquil-animated-illus_NZlHEGj6D9.png"
                                alt="登録する"
                                fill
                                sizes="(max-width: 768px) 100vw, 250px"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <p style={{ padding: '15px', margin: 0, fontWeight: 'bold' }}>投稿する</p>
                    </div>
                </Link>
            </div>

            {/* メッセージセクション（そのまま） */}
            {/* メッセージセクション */}
            <h1 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#362727', // 💡 ログイン画面の見出しと合わせたビターブラウン
                marginBottom: '16px',
                marginTop: '30px'
            }}>
                メッセージする
            </h1>

            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dmUsers.length === 0 ? (
                    <p style={{ color: '#999', fontSize: '14px' }}>メッセージできる相手がいません</p>
                ) : (
                    dmUsers.map(dmUser => (
                        <li key={dmUser.id}>
                            <a
                                href={`/message/${dmUser.id}`}
                                className="message-list-item" // 💡 global.cssでホバーを制御するためにクラスを付与
                                style={{
                                    display: 'block',
                                    padding: '14px 20px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // ほんのり透ける白
                                    backdropFilter: 'blur(5px)',
                                    border: '1px solid rgba(0, 0, 0, 0.05)',
                                    borderRadius: '12px', // ドロップダウンと合わせた可愛い角丸
                                    color: '#555', // 優しいグレー
                                    fontWeight: '600',
                                    fontSize: '15px',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)' // ほんの僅かな影
                                }}
                            >
                                <span style={{ marginRight: '8px' }}>💬</span> {/* チャットっぽさを演出 */}
                                {dmUser.displayName} とのメッセージ
                            </a>
                        </li>
                    ))
                )}
            </ul>
        </div>
    )
}