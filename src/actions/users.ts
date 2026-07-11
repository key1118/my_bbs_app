"use server"
import { User } from "@/entities/User";
import { getRepository } from "@/utils/data-source";
import { cacheTag, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { storeImage } from "./images";

export async function getUsers() {
    "use cache";
    cacheTag("users");

    const userRepository = await getRepository(User);

    const users = await userRepository.find({
        relations: ['followers']
    });

    return users.map(user => ({
        ...user,
        followers: user.followers ? user.followers.map(follower => ({ ...follower })) : []
    }))
};

export async function getUser(id: number) {
    "use cache"
    cacheTag(`user-${id}`);

    const userRepository = await getRepository(User);
    
    const user = await userRepository.findOne({
        where: {id: Number(id)}, 
        relations: {
            posts: true,
            followers: true,
            following: true
        },
    });

    if (!user) throw new Error("ユーザーデータが見つかりません。");

    return {
        ...user,
        // posts配列が存在する場合、中身の各postオブジェクトを展開してプレーンにする
        posts: user.posts ? user.posts.map(post => ({ ...post })) : [],
        followers: user.followers ? user.followers.map(follower => ({ ...follower })) : [],
        following: user.following ? user.following.map(following => ({ ...following })) : [],

    };
}

export async function editUser(formData: FormData, id : string) {
    const ageString = formData.get('age') as string;
    const age = Number(ageString);
    const gender = formData.get('gender') as string;
    const bloodType = formData.get('bloodType') as string;
    const bio = formData.get('bio') as string;

    const avatarFile = formData.get("avatarFile") as File | null;
    const coverFile = formData.get("coverFile") as File | null;

    let redirectUrl = ''

    try {
        const userRepository = await getRepository(User);
        
        // 💡 1. データベースから現在のユーザー情報を取得（既存のURLを確認するため）
        const currentUser = await userRepository.findOneBy({ id: Number(id) }); // もしidが文字列なら `{ id }` に
        
        // 💡 2. 新しいファイルが選択されているかチェック
        const hasAvatar = avatarFile && avatarFile.size > 0;
        const hasCover = coverFile && coverFile.size > 0;

        // 💡 3. 新しい画像がある場合のみアップロード処理を行う
        const { avatarUrl: newAvatarUrl, coverUrl: newCoverUrl } = await storeImage(
            hasAvatar ? avatarFile : null, 
            hasCover ? coverFile : null, 
            id
        );

        // 💡 4. 「新しいURL」があればそれを使い、なければ「現在のURL」を維持する
        const finalAvatarUrl = hasAvatar ? newAvatarUrl : currentUser?.avatarUrl;
        const finalCoverUrl = hasCover ? newCoverUrl : currentUser?.coverUrl;

        // id を元にデータを特定して更新
        await userRepository.update(id, {
            age,
            gender,
            bloodType,
            bio,
            avatarUrl: finalAvatarUrl || "", // null や undefined を防ぐ
            coverUrl: finalCoverUrl || "",
        });

        redirectUrl = '/profile'

    } catch (e) {
        console.error(e);
        return { error: 'プロフィールの更新中にエラーが発生しました' };
    }

    updateTag('users');
    updateTag(`user-${id}`);


    if(redirectUrl) {
        redirect(redirectUrl);
    }
}
