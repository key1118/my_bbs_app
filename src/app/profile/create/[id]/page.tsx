"use client"

import { setProfile } from "@/actions/auth";
import Loader from "@/app/Loader";
import { useState, useTransition } from "react";

export default function CreateProfile({ params }: { params: Promise<{ id: string }> }) {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            const { id } = await params;
            const result = await setProfile(formData, id);
            if (result && result.error) {
                setError(result.error);
            }
        });
    }
    return (
        <div className='container' style={{ maxWidth: '400px', marginTop: '50px' }}>
            <div className='card'>
                <h2 style={{ color: "#fff", marginBottom: '20px', textAlign: 'center' }}>
                    プロフィール作成
                </h2>
                <form action={handleSubmit}>
                    {/* --- 追加：プロフィール画像 --- */}
                    <div className='form-group'>
                        <label className='form-label' htmlFor='avatarFile'>
                            プロフィール画像
                        </label>
                        <input
                            type='file'
                            id='avatarFile'
                            name='avatarFile'
                            accept='image/*'
                            className='form-input'
                        />
                    </div>

                    {/* --- 追加：背景画像 --- */}
                    <div className='form-group'>
                        <label className='form-label' htmlFor='coverFile'>
                            背景画像
                        </label>
                        <input
                            type='file'
                            id='coverFile'
                            name='coverFile'
                            accept='image/*'
                            className='form-input'
                        />
                    </div>

                    <div className='form-group'>
                        <label className='form-label' htmlFor='username'>
                            ニックネーム
                        </label>
                        <input
                            type='text'
                            id='displayName'
                            name='displayName'
                            className='form-input'
                            placeholder='ニックネーム'
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='email'>
                            年齢
                        </label>
                        <input
                            type='number'
                            id='age'
                            name='age'
                            className='form-input'
                            placeholder='18'
                            required
                            min={0}
                        />
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='gender'>
                            性別
                        </label>
                        <select
                            id='gender'
                            name='gender'
                            className='form-input' // 必要に応じてスタイルを調整してください
                        >
                            <option value="">選択してください</option>
                            <option value="male">男</option>
                            <option value="female">女</option>
                        </select>
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='gender'>
                            血液型
                        </label>
                        <select
                            id='bloodType'
                            name='bloodType'
                            className='form-input' // 必要に応じてスタイルを調整してください
                        >
                            <option value="">選択してください</option>
                            <option value="A">A型</option>
                            <option value="B">B型</option>
                            <option value="O">O型</option>
                            <option value="AB">AB型</option>
                        </select>
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='bio'>
                            自己紹介
                        </label>
                        <textarea
                            id='bio'
                            name='bio'
                            className='form-input' // 必要に応じて高さをCSS（rowsなど）で調整してください
                            placeholder='趣味や特技、一言など自由にどうぞ！'
                            rows={10}
                        />
                    </div>
                    {error && <p className='error-message'>{error}</p>}
                    {isPending ? <Loader /> : <button
                        type='submit'
                        className='btn-edit'
                        style={{ width: '100%', marginBottom: '15px' }}
                    >登録する
                    </button>
                    }
                </form>
            </div>
        </div>
    );
}