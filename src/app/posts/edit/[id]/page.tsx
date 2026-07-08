import { getPost } from "@/actions/post";
import Link from "next/link";
import EditDetail from "./EditDetail";
import { Post } from "@/entities/Post";
import { Suspense } from "react";
import Loader from "@/app/Loader";

// 1. 実際に非同期データを取得して詳細を表示する内側のコンポーネント
async function EditPostContent({ params }: { params: Promise<{ id: number }> }) {
    const { id: postId } = await params;

    let post: Post | null = null;
    try {
        post = await getPost(postId);
        console.log(postId, post);
    } catch (err) {
        console.error("データ取得失敗:", err);
    }

    if (!post) {
        return <p className="error-message">データを取得できませんでした。</p>;
    }

    return <EditDetail post={post} />;
}

// 2. ページ全体のメインコンポーネント（ここで Suspense で囲む）
export default function EditPostPage({ params }: { params: Promise<{ id: number }> }) {
    return (
        <div className='container' style={{ maxWidth: '600px', marginTop: '30px' }}>
            <Link
                href='/posts'
                style={{
                    display: 'inline-block',
                    marginBottom: '20px',
                    color: '#0070f3',
                }}
            >
                &larr; 一覧に戻る
            </Link>

            {/* 💡 読み込み中のフォールバック（表示）を指定しつつ、サスペンスで囲む */}
            <Suspense fallback={<Loader/>}>
                <EditPostContent params={params} />
            </Suspense>
        </div>
    );
}