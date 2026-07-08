import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import type { Post } from './Post';
import { Follow } from './Follow';
import { Message } from './Message';
import { Reply } from './Reply';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({nullable: true})
  displayName?: string;

  @Column({nullable: true})
  age?: number;

  @Column({nullable: true})
  gender?: string;

  @Column({nullable: true})
  bloodType?: string;

  @Column({nullable: true})
  mbti?: string;

  @Column({nullable: true})
  bio?: string;

  @Column({nullable: true})
  avatarUrl?: string;

  @Column({nullable: true})
  coverUrl?: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany('post', (post: Post) => post.user)
  posts!: Post[];

  @OneToMany('Follow', (follow: Follow) => follow.following) // 🌟 クラス名ではなく文字列の 'Follow' にする
  followers!: Follow[];

  @OneToMany('Follow', (follow: Follow) => follow.follower) // 🌟 同上
  following!: Follow[];

  // Userクラスの中に以下を追加します

  // 自分が送信したメッセージ一覧
  @OneToMany('Message', (message: Message) => message.sender)
  sentMessages!: Message[]; // ※Message型をインポートして型指定してください

  // 自分が受信したメッセージ一覧
  @OneToMany('Message', (message: Message) => message.receiver)
  receivedMessages!: Message[];

  @OneToMany('Reply', (reply: Reply) => reply.post)
  replies!: Reply[];
}
