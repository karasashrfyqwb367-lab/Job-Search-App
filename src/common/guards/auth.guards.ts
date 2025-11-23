import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { UserDocument,User } from "src/DB/model/User.Model";
@Injectable()

//the goal 
// current exection context provider  access to ditails about the current the requset  pipline && 
// middilware nattul is dumb is donsent konw handler
//retune true && false
export class AuthGuard implements CanActivate{
constructor(
    private jwtService:JwtService,
    @InjectModel(User.name)private readonly userModel:Model<UserDocument>
){}

async canActivate(context: ExecutionContext): Promise<boolean>  {

    const requset =context.switchToHttp().getRequest()

   const  authorizder = requset.headers.authorization  ;

   if (!authorizder || !authorizder.startsWith("Bearer")) {

throw new UnauthorizedException("missing Authoriztion Header Part")    
   }

   const token =authorizder.split(" ")[1]
if (!token) {
    throw new UnauthorizedException("invaild token format")
    
}
   const payload =this.jwtService.verify(token,
    {
        secret:process.env.ACCESS_SECRET_KEY

    })

    const user =  await this.userModel.findById(payload.id)
    if (!user) {
        throw new NotFoundException("user Net Found")
    }
    requset.user=user



    return true
}
}
