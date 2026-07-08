'use client'
import { User } from "@/entities/User";
import Link from "next/link";

export default function ProfileList({users} : {users : User[]}) {
    return (
        <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px'
            }}>
                {users.map(user => (
                    <div key={user.id} className="card" style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        backgroundColor: "#eee",
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* 1. 背景画像（変更箇所） */}
                        <div style={{
                            height: '100px', // アバターとのバランスを見て少し高さを広げました
                            backgroundColor: '#4a5568',
                            // 画像があればそれを表示、なければグラデーションにする
                            backgroundImage: user.coverUrl
                                ? `url(${user.coverUrl})`
                                : 'linear-gradient(135deg, #fff 0%, #fff 100%)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }} />

                        {/* カードのコンテンツ部分 */}
                        <div style={{ padding: '15px', marginTop: '-40px', textAlign: 'center' }}>
                            {/* 2. プロフィール画像 / アバター（変更箇所） */}
                            <div style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                backgroundColor: '#e2e8f0',
                                margin: '0 auto 10px',
                                border: '3px solid #fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                // 画像がある場合は背景として敷き詰める
                                backgroundImage: user.avatarUrl ? `url(${user.avatarUrl})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                overflow: 'hidden'
                            }}>
                                {/* 画像がない場合だけシルエットアイコン 👤 を出す */}
                                {!user.avatarUrl && "👤"}
                            </div>

                            {/* 3. ユーザー名（以前、登録フォームで `displayName` を入力させていたので、もしあればそちらを優先すると親切です！） */}
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>
                                <Link
                                    href={`/profile/${user.id}`}
                                    style={{
                                        color: '#666',
                                        textDecoration: 'none', // 下線を消す
                                        fontWeight: 'bold'
                                    }}
                                    // マウスを乗せたときに少し薄くするなどのスタイル（お好みで）
                                    className="user-link"
                                >
                                    {user.displayName || user.userName || "未設定"}
                                </Link>
                            </h3>

                            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '10px 0' }} />

                            {/* 性別 & 年齢 */}
                            <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '0.9rem', color: '#666' }}>
                                <div>
                                    <span style={{ display: 'block', color: '#666', fontSize: '0.75rem' }}>フォロワー</span>
                                    <strong style={{color: "#666"}}>
                                        {user.followers.length}
                                    </strong>
                                </div>
                                <div style={{ borderLeft: '1px solid #eee' }} />
                                <div>
                                    <span style={{ display: 'block', color: '#666', fontSize: '0.75rem' }}>性別</span>
                                    <strong style={{color: "#666"}}>
                                        {user.gender === 'male' ? '男性' : user.gender === 'female' ? '女性' : '未設定'}
                                    </strong>
                                </div>
                                <div style={{ borderLeft: '1px solid #eee' }} />
                                <div>
                                    <span style={{ display: 'block', color: '#666', fontSize: '0.75rem' }}>年齢</span>
                                    <strong style={{color: "#666"}}>{user.age ? `${user.age} 歳` : '未設定'}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
    )
}