import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String, { nullable: true })
  verifyCode?: string;

  @Field(() => Boolean, { nullable: true })
  isVerified?: boolean;
}
