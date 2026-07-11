"use client"

import { editUser, getUser } from "@/actions/users";
import Loader from "@/app/Loader";
import { Post } from "@/entities/Post";
import Image from "next/image";
import Link from "next/link";
import { use, useState, useEffect, useTransition } from "react"; // 💡 useRef を追加

interface User {
    id?: number;
    userName?: string;
    email?: string;
    displayName?: string;
    age?: number;
    gender?: string;
    bloodType?: string;
    mbti?: string;
    bio?: string;
    avatarUrl?: string;
    coverUrl?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
    posts?: Post[];
}

export default function EditProfileForm({ params }: { params: Promise<{ id: string }> }) {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();;
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    // 💡 選択した新しい画像のプレビュー用ステート
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const { id: userId } = use(params);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getUser(Number(userId));
                if (data) setUser(data);
            } catch (err) {
                console.error("データ取得失敗:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [userId]);

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            const result = await editUser(formData, userId);
            if (result && result.error) {
                setError(result.error);
            }
        });
    }

    // 💡 ファイルが選択された時にプレビューを表示する処理
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'avatar') => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            if (type === 'cover') setCoverPreview(objectUrl);
            if (type === 'avatar') setAvatarPreview(objectUrl);
        }
    };

    if (isLoading) {
        return <Loader />
    }

    // 💡 現在表示すべき画像のURLを判定（新しく選んだ画像 > 既存の画像）
    const currentCoverUrl = coverPreview || user?.coverUrl;
    const currentAvatarUrl = avatarPreview || user?.avatarUrl;

    return (
        <div className='container' style={{ maxWidth: '400px', marginTop: '50px' }}>
            <Link
                href={`/profile/${userId}`}
                style={{
                    display: 'inline-block',
                    marginBottom: '20px',
                    color: '#0070f3',
                }}
            >
                &larr; 戻る
            </Link>
            <div className='card'>
                <h2 style={{ marginBottom: '20px', textAlign: 'center', color: "#fff" }}>
                    プロフィール編集
                </h2>
                <form action={handleSubmit} key={user?.id || 'new'}>

                    {/* 💡 背景画像 の変更エリア */}
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className='form-label'>背景画像</label>
                        <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: '#f3f4f6', overflow: 'hidden', borderRadius: '8px' }}>
                            {currentCoverUrl ? (
                                <Image
                                    src={currentCoverUrl}
                                    alt="背景画像"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>No Image</div>
                            )}
                        </div>
                        {/* 💡 ファイル選択用の input (name="cover" が重要) */}
                        <input
                            type="file"
                            name="coverFile"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'cover')}
                            style={{ marginTop: '8px' }}
                        />
                    </div>

                    {/* 💡 プロフィール画像 (アバター) の変更エリア */}
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label className='form-label'>プロフィール画像</label>
                        {/* アバターっぽく丸型(borderRadius: '50%')にするのもおすすめです */}
                        <div style={{ position: 'relative', width: '120px', height: '120px', backgroundColor: '#f3f4f6', overflow: 'hidden', borderRadius: '50%', margin: '0 auto' }}>
                            {currentAvatarUrl ? (
                                <Image
                                    src={currentAvatarUrl}
                                    alt="プロフィール画像"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#fff' }}>No Image</div>
                            )}
                        </div>
                        <input
                            type="file"
                            name="avatarFile"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'avatar')}
                            style={{ marginTop: '8px', display: 'block', margin: '8px auto 0' }}
                        />
                    </div>

                    {/* 年齢（中略）以下同じ */}
                    <div className='form-group'>
                        <label className='form-label' htmlFor='age'>
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
                            defaultValue={user?.age ?? ""}
                        />
                    </div>

                    {/* 性別 */}
                    <div className='form-group'>
                        <label className='form-label' htmlFor='gender'>
                            性別
                        </label>
                        <select
                            id='gender'
                            name='gender'
                            className='form-input'
                            defaultValue={user?.gender || ""}
                        >
                            <option value="">選択してください</option>
                            <option value="male">男</option>
                            <option value="female">女</option>
                        </select>
                    </div>

                    {/* 血液型 */}
                    <div className='form-group'>
                        <label className='form-label' htmlFor='bloodType'>
                            血液型
                        </label>
                        <select
                            id='bloodType'
                            name='bloodType'
                            className='form-input'
                            defaultValue={user?.bloodType || ""}
                        >
                            <option value="">選択してください</option>
                            <option value="A">A型</option>
                            <option value="B">B型</option>
                            <option value="O">O型</option>
                            <option value="AB">AB型</option>
                        </select>
                    </div>

                    {/* 自己紹介 */}
                    <div className='form-group'>
                        <label className='form-label' htmlFor='bio'>
                            自己紹介
                        </label>
                        <textarea
                            id='bio'
                            name='bio'
                            className='form-input'
                            placeholder='趣味や特技、一言など自由にどうぞ！'
                            rows={10}
                            defaultValue={user?.bio || ""}
                        />
                    </div>

                    {error && <p className='error-message'>{error}</p>}
                    {isPending ? <Loader /> :
                        <button
                            type='submit'
                            className='btn'
                            style={{ width: '100%', marginBottom: '15px' }}
                            disabled={isPending}
                        >
                            編集する
                        </button>
                    }
                </form>
            </div>
        </div>
    );
}