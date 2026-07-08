// entities/Like.ts
import { Entity, PrimaryGeneratedColumn, Column, Unique, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
@Unique(["id"]) // ★超重要: 同じユーザーが同じ投稿に2回いいねできないようにする（複合ユニーク）
export class Message {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne('user', 'sentMessages', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'senderId' })
    sender!: User;

    @Column()
    senderId!: number;

    @ManyToOne('user', 'receivedMessages', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'receiverId' })
    receiver!: User;

    @Column()
    receiverId!: number;

    // リレーションの設定（必須ではないですが、後々ユーザー情報や投稿情報を引っ張るのに便利です）
    @Column()
    content!: string

    @UpdateDateColumn()
    updatedAt!: Date;
}