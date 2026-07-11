"use server"
import { getUser } from "@/actions/users"; 
import { notFound } from "next/navigation";
import Link from "next/link";
import { verifySession } from "@/utils/session";
import FollowButton from "../buttons/follow";
import DMButton from "../buttons/Dm";
import { Suspense } from "react";
import Loader from "@/app/Loader";

interface Props {
    params: Promise<{ id: string }>;
}

// 💡 1. paramsのPromiseをそのまま受け取って、Suspenseの内側で await させる
export async function UserDetailContent({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
    // 💡 ここで await することで、正しく <Suspense> の fallback（Loader）が起動します
    const { id: resolvedId } = await paramsPromise;
    const id = Number(resolvedId);

    const user = await getUser(id);

    if (!user) {
        notFound();
    }
    const session = await verifySession();
    const isOwner = session && session.userId && parseInt(session.userId) === user.id;

    return (
        <div className="card" style={{
            border: '1px solid #ddd',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            backgroundColor: "#fff",
        }}>
            {/* 背景画像 */}
            <div style={{
                height: '180px',
                backgroundColor: '#4a5568',
                backgroundImage: user.coverUrl ? `url(${user.coverUrl})` : 'linear-gradient(135deg, #fff 0%, #fff 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }} />

            {/* コンテンツ部分 */}
            <div style={{ padding: '30px', marginTop: '-60px', textAlign: 'center' }}>
                {/* アバター画像 */}
                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: '#e2e8f0',
                    margin: '0 auto 20px',
                    border: '5px solid #fff',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    backgroundImage: user.avatarUrl ? `url(${user.avatarUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px'
                }}>
                    {!user.avatarUrl && "👤"}
                </div>

                {/* ユーザー名・ニックネーム */}
                <h2 style={{ margin: '0 0 5px 0', color: '#666' }}>
                    {user.displayName || "ニックネーム未設定"}
                </h2>
                <p style={{ color: '#999999', margin: '0 0 20px 0' }}>@{user.userName}</p>
                
                {/* 投稿数 & フォロワー & フォロー中 */}
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', fontSize: '0.9rem', color: '#666', padding: '10px 0' }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <span style={{ display: 'block', color: '#666', fontSize: '0.75rem' }}>投稿数</span>
                        <strong style={{color: "#666"}}>{user.posts.length ?? 0}</strong>
                    </div>
                    <div style={{ borderLeft: '1px solid #666', height: '24px' }} />
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <span style={{ display: 'block', color: '#666', fontSize: '0.75rem' }}>フォロワー</span>
                        <strong style={{color: "#666"}}>{user.followers.length ?? 0}</strong>
                    </div>
                    <div style={{ borderLeft: '1px solid #666', height: '24px' }} />
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <span style={{ display: 'block', color: '#666', fontSize: '0.75rem' }}>フォロー中</span>
                        <strong style={{color: "#666"}}>{user.following.length ?? 0}</strong>
                    </div>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #666', margin: '20px 0' }} />

                {/* プロフィール詳細情報 */}
                <div style={{ textAlign: 'left', display: 'grid', gap: '15px' }}>
                    <div>
                        <span style={{ display: 'block', color: '#aaa', fontSize: '0.8rem' }}>性別</span>
                        <strong style={{color: "#666"}}>{user.gender === 'male' ? '男性' : user.gender === 'female' ? '女性' : '未設定'}</strong>
                    </div>
                    <div>
                        <span style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>年齢</span>
                        <strong style={{color: "#666"}}>{user.age ? `${user.age} 歳` : '未設定'}</strong>
                    </div>
                    <div>
                        <span style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>血液型</span>
                        <strong style={{color: "#666"}}>{user.bloodType ? `${user.bloodType} 型` : '未設定'}</strong>
                    </div>
                    <div>
                        <span style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>自己紹介</span>
                        <p style={{ margin: '5px 0 0 0', color: '#666', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                            {user.bio || "自己紹介はまだ書かれていません。"}
                        </p>
                    </div>
                    <div>
                        <span style={{ display: 'block', color: '#666', fontSize: '0.8rem' }}>投稿一覧</span>
                        {user.posts.length !== 0 ?
                            <ul>{user.posts.map(
                                post => <li key={post.id} style={{ color: '#0070f3' }}><Link href={`/posts/${post.id}`}>{post.title}</Link></li>
                            )}</ul> : <p style={{color: "#666"}}>作成した投稿は特にありません</p>}
                    </div>
                    {isOwner ? (
                        <div style={{ marginTop: '20px' }}>
                            <Link className='btn-edit' href={`/profile/edit/${user.id}`}>プロフィール編集</Link>
                        </div>
                    ) : (
                        <div style={{ marginTop: '20px' }}>
                            <FollowButton userId={id}/>
                            <DMButton userId={id}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// 💡 2. メインのPageコンポーネント（ここでは await を使わない）
export default async function UserDetailPage({ params }: Props) {
    return (
        <div className="container" style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
            <Link href="/profile" style={{ display: 'inline-block', marginBottom: '20px', color: '#0070f3', textDecoration: 'none' }}>
                ← ユーザ一覧に戻る
            </Link>

            {/* 💡 params（Promise）をそのまま子コンポーネントへ渡す */}
            <Suspense fallback={<Loader />}>
                <UserDetailContent paramsPromise={params} />
            </Suspense>
        </div>
    );
}