// entities/Like.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";

@Entity('like')
@Unique(["userId", "postId"]) // ★超重要: 同じユーザーが同じ投稿に2回いいねできないようにする（複合ユニーク）
export class Like {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @Column()
    postId!: number;

    // リレーションの設定（必須ではないですが、後々ユーザー情報や投稿情報を引っ張るのに便利です）
    @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
    user!: User;

    @ManyToOne(() => Post, (post) => post.id, { onDelete: "CASCADE" })
    post!: Post;
}