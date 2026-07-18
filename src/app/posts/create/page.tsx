'use client'

import { createPost } from "@/actions/post";
import Loader from "@/app/Loader";
import Link from "next/link";
import { useState, useTransition } from "react";

export default function CreatePostPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const changeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value)
    }

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            const result = await createPost(formData);
            if (result && result.error) {
                console.log(result.error);
                setError(result.error);
            }
        })
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
                &larr; 投稿一覧に戻る
            </Link>
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
                            value={title}
                            onChange={changeTitle}
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
                            value={content}
                            onChange={changeContent}
                        ></textarea>
                    </div>
                    {error && <p className='error-message'>{error}</p>}
                    {isPending ? <Loader /> :
                        <button type='submit' className='btn'>
                            投稿
                        </button>
                    }
                </form>
            </div>
        </div>
    );
}
