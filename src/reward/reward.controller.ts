import { Controller, Get } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, MessagePattern, Transport } from '@nestjs/microservices';
import { UserService } from 'src/user/services/user.service';

@Controller('reward')
export class RewardController {
    client: ClientProxy

    constructor(
        private userService : UserService
    ) {
        this.client = ClientProxyFactory.create({
            transport: Transport.REDIS,
            options: {
                url: 'redis://localhost:6379',
            },
        })
    }

    @Get('allReward')
    async getAllReward(){
        const pattern  = { cmd: "allReward"}
        return await this.client.send(pattern, {})
    }

    @Get('posible')
    async getPosibleReward(){
        const pattern  = { cmd: "posibleReward"}
        return await this.client.send<number[]>(pattern, [1,2,3,4])
    }

    // 
    @MessagePattern({ cmd: "owner" }, Transport.REDIS)
    async getRewardOwner() {
        return await this.userService.findAll()
    }

    @MessagePattern({ cmd: "awarder" }, Transport.REDIS)
    async getAwardUsers(array: number[]) {
        return await this.userService.findByIdList(array)
    }
}
