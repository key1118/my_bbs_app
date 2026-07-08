// 💡 ここには "use client" を書かない（サーバーコンポーネントにする）
import { Suspense } from "react";
import Loader from "@/app/Loader";
import EditProfileForm from "./EditProfileForm"; // ステップ1でリネームしたファイルをインポート

export default function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
    return (
        // 💡 読み込み中のフォールバックを指定しつつ、サスペンスで囲んでフォームを呼び出す
        <Suspense fallback={<Loader />}>
            <EditProfileForm params={params} />
        </Suspense>
    );
}