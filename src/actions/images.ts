import { put } from "@vercel/blob";

export async function storeImage(avatarFile: File | null, coverFile: File | null, id: string) {
    let avatarUrl = "";
    let coverUrl = "";
            // 2. プロフィール画像のアップロード処理
    if (avatarFile && avatarFile.size > 0) {
    // ファイル名が重複してもVercel Blob側で自動でランダムな文字列を付与してくれます
        const avatarBlob = await put(`avatars/${id}-${avatarFile.name}`, avatarFile, {
            access: "public",
            addRandomSuffix: true
        });
            avatarUrl = avatarBlob.url; // DBに保存するためのURL
    }

    // 3. 背景画像のアップロード処理
    if (coverFile && coverFile.size > 0) {
        const coverBlob = await put(`covers/${id}-${coverFile.name}`, coverFile, {
            access: "public",
            addRandomSuffix: true
        });
        coverUrl = coverBlob.url; // DBに保存するためのURL
    }

    return {avatarUrl, coverUrl}
}