import { getPost } from "@/actions/post";
import Link from "next/link";
import EditDetail from "./EditDetail";
import { Post } from "@/entities/Post";


export default async function EditPostPage({params}: {params: Promise<{id: number}>}) {
    const {id: postId} = await params;

    let post: Post | null = null
    try {
        post = await getPost(postId);
        console.log(postId, post);
    } catch (err) {
        console.error("データ取得失敗:", err);
    }

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
            {!post ? <p className="error-message">データを取得できませんでした。</p>
            : <EditDetail post = {post}/>
            }
        </div>
    );
}