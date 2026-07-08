'use server';

import { InitialGoodState } from "@/actions/good";
import GoodButton from "./GoodButton";

export default async function InitialGoodButton({ postId }: { postId: number }) {
    const results = await InitialGoodState(postId);
   // 1. エラーがあればここで早期リターン
    if ("error" in results) {
        return <p className="error-message">{results.error}</p>;
    }

    // 2. エラーチェックを通過したため、TypeScriptが自動で「エラーなしの型」に絞り込んでくれます
    const { initialLiked, goods } = results;

    return (
        <GoodButton postId={postId} initialLiked={initialLiked} goods={goods} />
    )
}