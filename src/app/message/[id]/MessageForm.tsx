"use client"

import { createMessage, getMessages } from "@/actions/message";
import { useState, useEffect, useRef } from "react";
import { Message } from "@/entities/Message";
import { supabase } from "@/lib/supabase"; // 👈 先ほど作成したsupabaseクライアントをインポート


export default function MessageForm({ receiverId, senderId }: { receiverId: number, senderId: number }) {
    const [text, setText] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [skip, setSkip] = useState(0);

    const [error, setError] = useState<string | null>(null);

    // 💡 変更：コンテナ自体を指すRefを追加します
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 💡 過去ログ読み込み時のスクロール位置保持用の状態
    const [scrollOffsetInfo, setScrollOffsetInfo] = useState<{
        previousScrollHeight: number;
        previousScrollTop: number;
    } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setText(null)
        }
        else {
            setText(e.target.value)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const sendedText = text
        setText(null);
        const result = await createMessage(receiverId, sendedText);
        if (result && result.error) {
            console.error(result.error);
            setError(result.error);
        }
        else {
            // 💡 自分が送信したメッセージを即座に画面に反映
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
            }, 50);
        }
    }

    const handleClick = async () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // データが追加される「直前」の高さとスクロール位置を保存
        const previousScrollHeight = container.scrollHeight;
        const previousScrollTop = container.scrollTop;

        const pastMessages = await getMessages(receiverId, messages.length, skip);
        if (pastMessages && "error" in pastMessages) {
            return;
        }

        // 状態をセット（これによりDOMが更新されます）
        setMessages(prev => [...pastMessages, ...prev]);
        setSkip(prev => prev + messages.length);

        // スクロール位置を復元するための情報を記録
        setScrollOffsetInfo({ previousScrollHeight, previousScrollTop });
    };

    // 💡 過去ログが追加されてDOMが更新された後、スクロール位置を「補正」する副作用
    useEffect(() => {
        if (!scrollOffsetInfo || !scrollContainerRef.current) return;

        const container = scrollContainerRef.current;

        // 【新しい全体の高さ】 - 【古い全体の高さ】 = 追加された要素分の高さ
        const heightDifference = container.scrollHeight - scrollOffsetInfo.previousScrollHeight;

        // 元々いたスクロール位置に、増えた高さを足すことで位置をキープ
        container.scrollTop = scrollOffsetInfo.previousScrollTop + heightDifference;

        // 処理が終わったらリセット
        setScrollOffsetInfo(null);
    }, [messages, scrollOffsetInfo]);


    // 💡 初回読み込み ＆ Supabase Realtime の監視設定
    useEffect(() => {
        // ① 初回読み込み専用の関数（10件だけ取る）
        const fetchInitialMessages = async () => {
            const initialMessages = await getMessages(receiverId, 50, skip);
            if (initialMessages && "error" in initialMessages) return;

            setSkip(prev => prev + 50);
            setMessages(initialMessages);

            if (isFirstLoad) {
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
                    setIsFirstLoad(false);
                }, 50);
            }
        };

        fetchInitialMessages();

        // ② リアルタイムの監視設定
        const channel = supabase
            .channel(`realtime-messages-${[senderId, receiverId].sort().join('_')}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'message' },
                (payload) => {
                    // 💡 payload.new に新しく追加されたメッセージデータが入っています
                    const newMessage = payload.new as Message;

                    // 💡 setMessages(prev => [...]) を使うことで、クロージャ問題を回避し、
                    // 過去のメッセージを残したまま、末尾に最新の1件を追加できます。
                    setMessages(prev => {
                        // 重複追加を防ぐための安全弁（念のため）
                        if (prev.some(m => m.id === newMessage.id)) return prev;
                        return [...prev, newMessage];
                    });

                    // スキップカウントも1増やす
                    setSkip(prev => prev + 1);

                    // スクロール最下部へ移動
                    if(newMessage.senderId === senderId){
                        setTimeout(() => {
                            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                        }, 50);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [receiverId]);


    return (
        <div className="chat-container">
            {/* 💡 変更：最外枠のメッセージ履歴コンテナに ref={scrollContainerRef} を付与 */}
            <div className="message-history" ref={scrollContainerRef} style={{ overflowY: 'auto' }}>
                {!isFirstLoad && <button onClick={handleClick}>さらに過去のメッセージを表示する</button>}

                {/* 💡 不要になったmessagesStartRefのdivは削除 */}

                {messages.length === 0 ? (
                    <p className="no-messages">まだメッセージはありません</p>
                ) : (
                    messages.map((message, index) => {
                        const isMe = message.receiverId === Number(receiverId);

                        return (
                            <div key={`${message.id}-${index}`} className={`message-row ${isMe ? "me" : "other"}`}>
                                {!isMe && (
                                    <div className="message-user-name">
                                        {message.sender?.displayName}
                                    </div>
                                )}
                                <div className="message-bubble">
                                    <p className="message-text">{message.content}</p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {error && <p className="error-message">{error}</p>}
            <form className="input-area" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={text ? text : ""}
                    onChange={handleChange}
                    placeholder="メッセージを入力..."
                />
                {text && (
                    <button type="submit" className="send-button" aria-label="送信">
                        <svg viewBox="0 0 24 24" className="send-icon">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                        </svg>
                    </button>
                )}
            </form>
        </div>
    );
}