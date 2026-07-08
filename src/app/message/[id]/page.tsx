import { Suspense } from "react";
import MessageForm from "./MessageForm";
import Loader from "@/app/Loader";
import Link from "next/link";
import { getUser } from "@/actions/users";
import { verifySession } from "@/utils/session";
import { redirect } from "next/navigation";
import { isMutualFollow } from "@/actions/follow";

interface Props {
    params: Promise<{ id: string }>;
}

// 1. 親コンポーネント：ここでは await をせず、すぐ Suspense を返す
export default function Home({ params }: Props) {
    return (
        <Suspense fallback={<Loader />}>
            {/* 💡 非同期処理を行う子コンポーネントを配置。params をそのまま渡す */}
            <ChatRoomContent params={params} />
        </Suspense>
    );
}

// 2. 子コンポーネント：ここで非同期処理（await）を行う
async function ChatRoomContent({ params }: Props) {
    const receiverId = Number((await params).id);
    const user = await getUser(receiverId);
    const session = await verifySession();

    if (!session || !session.userId) {
        redirect("/login");
    }
    const senderId = Number(session.userId);

    //相互フォローかチェック
    const result = await isMutualFollow(receiverId);
    if(!result) {
        redirect(`/profile/${receiverId}`);
    }

    return (
        <>
            <Link
                href={`/profile/${receiverId}`}
                style={{
                    display: 'inline-block',
                    marginBottom: '20px',
                    color: '#0070f3',
                }}
            >
                &larr; {user.displayName}のプロフィールに戻る
            </Link>
            <h1 style={{textAlign: "center", marginBottom: "10px"}}>
                {user.displayName}とのトークルーム
            </h1>
            <div className="chat-container">
                <MessageForm receiverId={receiverId} senderId={senderId} />
            </div>
        </>
    );
}