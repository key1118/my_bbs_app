import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { User } from './User';
import { Post } from './Post';

@Entity('reply')
export class Reply {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;


  @ManyToOne('user', (user: User) => user.replies)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: number;

@ManyToOne('post', (post: Post) => post.replies)
  @JoinColumn({ name: 'postId' })
  post!: Post;

  @Column()
  postId!: number;

}
