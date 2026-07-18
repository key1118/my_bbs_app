'use client'

import { createReply } from "@/actions/reply";
import Loader from "@/app/Loader";
import { Post } from "@/entities/Post";
import Link from "next/link";
import { useState, useTransition } from "react";

export default function Reply({ post }: { post: Post }) {
    const [text, setText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    }

    const onClick = async () => {
        if (!text.trim()) return; // 空文字の送信を防ぐ
        setError(null);
        startTransition(async () => {
            const result = await createReply(post, text); // 💡 引数を post.id に合わせる
            if (result && result.error) {
                setError(result.error)
            }
        })
        setText("");
    }

    return (
        // 💡 全体をカード風（.card）の枠で囲んで、綺麗にまとめました
        <div className="card" style={{ marginTop: '30px', padding: '24px' }}>
            <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '16px',
                borderBottom: '2px solid rgba(0,0,0,0.05)',
                paddingBottom: '8px'
            }}>
                この投稿への返信（{post.replies?.length || 0}件）
            </h3>

            {/* 返信一覧のリスト表現をシンプルかつ見やすく */}
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '24px' }}>
                {post.replies && post.replies.length > 0 ? (
                    post.replies.map(reply => (
                        <li key={reply.id} style={{
                            padding: '12px 0',
                            borderBottom: '1px dashed #ddd',
                            fontSize: '15px'
                        }}>
                            {/* 💡 ユーザー名を表示するエリア */}
                            <Link href={`/profile/${reply.user.id}`}
                                style={{
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    color: "rgb(52, 135, 176)", // 💡 前にヘッダーロゴで使った「落ち着いたモーヴピンク」などをここにも使うと、アプリ全体の『リンクの色』として統一感が出ます！
                                    display: 'inline-block'
                                }}
                                className="reply-user-link"
                            >
                                @{reply.user?.displayName || "不明なユーザー"}
                            </Link>
                            {/* 将来的にユーザー名を出せるように、優しく回り込む構造にしています */}
                            <p style={{ margin: 0, color: 'var(--text-color)' }}>{reply.content}</p>
                        </li>
                    ))
                ) : (
                    <p style={{ color: '#999', fontSize: '14px' }}>まだ返信はありません</p>
                )}
            </ul>

            {/* 入力エリアをチャット風、またはフォーム一体型にスタイリング */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={text}
                        onChange={onChange}
                        className="form-input" // 💡 global.css の入力枠スタイルを適用
                        placeholder="返信を入力..."
                        style={{ flex: 1, borderRadius: '6px' }} // 横幅をいっぱいに広げる
                    />
                    {isPending ? <Loader /> :
                        <button
                            onClick={onClick}
                            className="btn" // 💡 global.css のボタンスタイルを適用
                            style={{ whiteSpace: 'nowrap', padding: '10px 24px' }}
                        >
                            返信する
                        </button>
                    }
                </div>
                {error && <p className="error-message" style={{ margin: 0 }}>{error}</p>}
            </div>
        </div>
    )
}