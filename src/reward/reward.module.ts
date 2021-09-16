import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { RewardController } from './reward.controller';

@Module({
  imports: [UserModule],
  controllers: [RewardController]
})
export class RewardModule { }
