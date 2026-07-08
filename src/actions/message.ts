'use server'

import { Message } from "@/entities/Message";
import { getRepository } from "@/utils/data-source";
import { verifySession } from "@/utils/session";

export async function createMessage(receiverId: number, message: string | null) {
    if (!message) {
        return { error: 'メッセージを入力してください' }
    }

    const session = await verifySession();
    if (!session || !session.userId) {
        return { error: 'ログインしてください' }
    }
    const senderId = session.userId


    const messageRepository = await getRepository(Message);
    const newMessage = messageRepository.create({
        receiverId: Number(receiverId),
        senderId: Number(senderId),
        content: message
    })
    const updatedMessages = await messageRepository.save(newMessage);

    return {
        ...updatedMessages
    };
}

export async function getMessages(receiverId: number, take: number, skip: number) {
    const session = await verifySession();
    if (!session || !session.userId) {
        return { error: 'ログインしてください' }
    }
    const senderId = session.userId;

    const messageRepository = await getRepository(Message);

    const messages = await messageRepository.find({
        where: [
            { senderId: Number(senderId), receiverId: Number(receiverId) },
            { senderId: Number(receiverId), receiverId: Number(senderId) }
        ],
        relations: {
            sender: true,
            receiver: true
        },
        order: {
            updatedAt: "DESC" // 1. まずは最新のものから順に並べる
        },
        take: take,
        skip: skip // 2. 最新の10件だけを取得
    });

    // 3. 最新の10件を、画面表示用に古い順（時系列順）にひっくり返す
    messages.reverse();

    return messages.map(message => ({
        ...message,
        sender: { ...message.sender },
        receiver: { ...message.receiver },

    }))
}