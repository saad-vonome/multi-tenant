import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Patient {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  isActive: boolean;

  @Column()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column()
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;
}
