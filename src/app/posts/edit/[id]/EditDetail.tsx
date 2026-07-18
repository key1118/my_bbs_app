'use client'

import { editPost } from "@/actions/post";
import Loader from "@/app/Loader";
import { Post } from "@/entities/Post";
import { useState, useTransition } from "react";

export default function EditDetail({ post }: { post: Post }) {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();


    const handleSubmit = async (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            const result = await editPost(post.id, formData);
            if (result && result.error) {
                setError(result.error);
            }
        })
    };
    return (
        <div className='card'>
            <h2 style={{ marginBottom: '20px' }}>新規投稿</h2>
            <form action={handleSubmit}>
                <div className='form-group'>
                    <label className='form-label' htmlFor='title'>
                        タイトル
                    </label>
                    <input
                        type='text'
                        id='title'
                        name='title'
                        className='form-input'
                        placeholder='タイトルを入力'
                        // 💡 state の post から安全に初期値を入れる
                        defaultValue={post?.title || ""}
                        // 💡 useEffectで後からデータが入った時に再描画させるための工夫
                        key={post.id}
                        required
                    />
                </div>
                <div className='form-group'>
                    <label className='form-label' htmlFor='content'>
                        本文
                    </label>
                    <textarea
                        id='content'
                        name='content'
                        className='form-textarea'
                        placeholder='本文を入力'
                        defaultValue={post?.content || ""}
                        key={post?.content || "content-empty"}
                        required
                    ></textarea>
                </div>
                {error && <p className='error-message'>{error}</p>}
                {isPending ? <Loader /> :
                    <button type='submit' className='btn'>
                        編集完了
                    </button>
                }
            </form>
        </div>
    )
}