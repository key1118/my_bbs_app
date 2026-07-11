"use client";

import {
    incrementGoods,
    decrementGoods,
} from "@/actions/good";
import Loader from "@/app/Loader";
import { useState } from "react";

export default function GoodButton({postId, initialLiked, goods }: { postId: number, initialLiked: boolean, goods: number }) {
    const [state, setState] = useState(initialLiked);
    const [goodsCount, setGoodsCount] = useState(goods);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clickHandler = async () => {
        setIsLoading(true);
        setError(null);
        const prevState = state;

        // サーバー側での処理
        const result = prevState
            ? await decrementGoods(postId)
            : await incrementGoods(postId);

        if (result && result.error) {
            setError(result.error);
            setIsLoading(false);
            return
        }
        setState(!prevState);
        setGoodsCount((prev) => (prevState ? prev - 1 : prev + 1));
        setIsLoading(false);

    };

    return (
        <div>
            {error && <p className="error-message">{error}</p>}
            {isLoading ? <Loader /> :
            <>
            
            <span style={{color:"#666"}}>いいね数: </span>
            <button
                onClick={clickHandler}
                className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
        transition-all duration-200 active:scale-95
        ${state
                        ? 'bg-yellow-50 text-pink-600 hover:bg-pink-100'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}
    `}
            >
                <span className={`transition-transform duration-200 ${state ? 'scale-125' : ''}`}>
                    {state ? '❤️' : '🤍'}
                </span>
                <span className={state ? 'font-bold text-pink-600' : 'text-gray-600'}>
                    {goodsCount}
                </span>
            </button>
            </>
}
        </div>
    );
}
