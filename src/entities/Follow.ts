import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm';
import type { User } from './User'; // typeインポートで型だけ安全に使う

@Entity('follows')
@Unique(['followerId', 'followingId'])
export class Follow {
    @PrimaryGeneratedColumn()
    id!: number;

    // ① フォローした人（自分）のデータ本体
    @ManyToOne('user', 'following', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'followerId' })
    follower!: User;

    // 🌟 これが逃げ道！ただの数字として扱える
    @Column()
    followerId!: number;

    // ② フォローされた人（相手）のデータ本体
    @ManyToOne('user', 'followers', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'followingId' })
    following!: User;

    // 🌟 これが逃げ道！ただの数字として扱える
    @Column()
    followingId!: number;

    @CreateDateColumn()
    createdAt!: Date;
}