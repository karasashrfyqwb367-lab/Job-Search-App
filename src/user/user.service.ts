import { ConflictException, Injectable, NotFoundException ,BadRequestException } from '@nestjs/common';
import { UpdateInfoUserDto, UpdatePasswordDTO } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/DB/model/User.Model';
import { Model } from 'mongoose';
import { compare, hash } from 'src/common/utils/security/hash';
import { Types } from "mongoose";
import {decryptMobile,encryptMobile} from "../common/utils/security/encryption"
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
constructor(
  @InjectModel( User.name) private  readonly userModel: Model<UserDocument>
){

}

async updateUserInfo(userId: string, updateInfoUserDto: UpdateInfoUserDto) {

  if (updateInfoUserDto.mobileNumber) {
    updateInfoUserDto.mobileNumber = await encryptMobile(
      updateInfoUserDto.mobileNumber,
      process.env.MOBILE_SECRET_KEY as string
    );
  }


  const updatedUser = await this.userModel.findByIdAndUpdate(
    userId,
    { $set: updateInfoUserDto, $inc: { __v: 1 } },
    { new: true }
  );

  if (!updatedUser) {
    throw new NotFoundException("Invalid User account");
  }

  if (updatedUser.mobileNumber) {
    const decrypted = await decryptMobile(
      updatedUser.mobileNumber,
      process.env.MOBILE_SECRET_KEY as string
    );
    updatedUser.mobileNumber = decrypted ?? '';
  }

  return updatedUser;
}



async getMyProfile(userId: string) {
  const user = await this.userModel.findOne({
    _id: new Types.ObjectId(userId),   
    deletedAt: { $exists: false },     
  }).select("firstName lastName mobileNumber profilePic coverPic");

  if (!user) throw new NotFoundException("User not found");

  const userName = `${user.firstName} ${user.lastName}`;

  return {
    userName,
    profilePic: user.profilePic,
    coverPic: user.coverPic,
  };
}





async getUserProfile(userId: string) {
  const user = await this.userModel.findById(userId).select(
    "firstName lastName mobileNumber profilePic coverPic"
  );

  if (!user) {
    throw new NotFoundException("User not found");
  }


  return {
   firstName:user.firstName,
    lastName:user.lastName,
    profilePic: user.profilePic,
    coverPic: user.coverPic,
  };
}




  //****************updatePassword******************* */

  async updatePassword(userId: string, dto: UpdatePasswordDTO) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(dto.oldPassword,user.password)
    if (!isMatch) throw new ConflictException('Invalid old password');

    const hashedPassword = await hash({plaintext:dto.password})

    user.password = hashedPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  }

async uploadProfilePic(userId: string, file: Express.Multer.File) {
  if (!file) {
    throw new BadRequestException("No file uploaded");
  }

  const filePath = `uploads/${file.filename}`;

  await this.userModel.findByIdAndUpdate(userId, {
    profilePic: {
      secure_url: filePath,
      public_id: file.filename,
    },
  });

  return {
    message: "Profile image uploaded successfully",
    filename: file.filename,
    path: filePath,
  };
}



async uploadCoverPic(userId: string, file: Express.Multer.File) {
  if (!file) {
    throw new BadRequestException("No file uploaded");
  }

  const filePath = `uploads/${file.filename}`;

  await this.userModel.findByIdAndUpdate(userId, {
    coverPic: {
      secure_url: filePath,
      public_id: file.filename,
    },
  });

  return {
    message: "Cover image uploaded successfully",
    filename: file.filename,
    path: filePath,
  };
}

async deleteProfilePic(userId: string) {
  const user = await this.userModel.findById(userId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (user.profilePic && user.profilePic.public_id) {
    const fs = require("fs");
    const filePath = `./src/uploads/${user.profilePic.public_id}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  
  user.profilePic = undefined;
  await user.save();

  return { message: "Profile picture deleted successfully" };
}


async deleteCoverPic(userId: string) {
  const user = await this.userModel.findById(userId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (user.coverPic && user.coverPic.public_id) {
    const fs = require("fs");
    const filePath = `./src/uploads/${user.coverPic.public_id}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  user.coverPic = undefined;  
  await user.save();

  return { message: "Cover picture deleted successfully" };
}



async softDeleteAccount(userId: string) {
  const user = await this.userModel.findById(userId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  user.deletedAt = new Date();
  await user.save();

  return { message: "Account has been soft deleted successfully" };
}



}

