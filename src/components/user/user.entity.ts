import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn()
  email: string;

  @Column()
  password: string;

  @Column()
  verifyCode: string;

  @Column()
  isVerified: boolean;
}
