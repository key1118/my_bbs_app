'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { User } from '@/entities/User';
import { getRepository } from '@/utils/data-source';
import { createSession, deleteSession } from '@/utils/session';
import { updateTag } from 'next/cache';
import { storeImage } from './images';

export async function signup(formData: FormData) {
    let redirectUrl = '';

    const userName = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!userName || !email || !password) {
        return { error: "すべてのフィールドを入力してください" };
    }


    try {
        const userRepository = await getRepository(User);

        // メールアドレスの重複チェック
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            return { error: 'このメールアドレスは既に使用されています' };
        }

        // パスワードのハッシュ化
        const hashedPassword = await bcrypt.hash(password, 10);

        // ユーザー作成
        const newUser = userRepository.create({
            userName,
            email,
            password: hashedPassword,
        });

        const savedUser = await userRepository.save(newUser);
        await createSession(savedUser.id.toString());
        redirectUrl = `/profile/create/${savedUser.id}`;

    } catch (e) {
        console.error(e);
        return { error: 'ユーザー登録中にエラーが発生しました' };
    }
    if (redirectUrl) {
        redirect(redirectUrl);
    }
}

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const userRepository = await getRepository(User);
        const user = await userRepository.findOneBy({ email });

        if (!user) {
            return { error: 'メールアドレスまたはパスワードが正しくありません' };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return { error: 'メールアドレスまたはパスワードが正しくありません' };
        }

        await createSession(user.id.toString());
    } catch (e) {
        console.error(e);
        return { error: 'ログイン中にエラーが発生しました' };
    }
    redirect('/')
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}

export async function setProfile(formData: FormData, id : string) {
    const displayName = formData.get('displayName') as string;
    const ageString = formData.get('age') as string;
    const age = Number(ageString);
    const gender = formData.get('gender') as string;
    const bloodType = formData.get('bloodType') as string;
    const bio = formData.get('bio') as string;

        // ファイルオブジェクトの取得
    const avatarFile = formData.get("avatarFile") as File | null;
    const coverFile = formData.get("coverFile") as File | null;

    const {avatarUrl, coverUrl } = await storeImage(avatarFile, coverFile, id);

    let redirectUrl = ''

    try {
        const userRepository = await getRepository(User);

        // id を元にデータを特定して更新
        // （もしエンティティの id が数値型なら、Number(id) にしてください）
        await userRepository.update(id, {
            displayName,
            age,
            gender,
            bloodType,
            bio,
            avatarUrl,
            coverUrl,
        });

        // 更新完了後のリダイレクト処理（必要に応じてパスを変更してください）
        // 例: トップページやマイページへ遷移させる
        redirectUrl = '/'

    } catch (e) {
        console.error(e);
        return { error: 'プロフィールの作成中にエラーが発生しました' };
    }

    updateTag('users')
    updateTag(`user-${id}`)

    if(redirectUrl) {
        redirect(redirectUrl);
    }
}
