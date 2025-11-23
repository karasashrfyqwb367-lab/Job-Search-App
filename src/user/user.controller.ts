import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { UpdateInfoUserDto, UpdatePasswordDTO } from './dto/create-user.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { multerOptions } from 'src/common/utils/upload/multer';
import { DefaultDeserializer } from 'v8';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

@UseGuards(AuthGuard)
@Patch("/updateInfo")
async updateInfo(
  @Request() req,
  @Body() updateInfoUserDto: UpdateInfoUserDto
) {
  const userId = req.user._id;
  const updatedUser = await this.userService.updateUserInfo(userId, updateInfoUserDto);
  return { message: 'User updated successfully', user: updatedUser };
}





@UseGuards(AuthGuard)
@Get("profile")
async getMyProfile(@Req() req) {
  const userId = req.user._id; 
  return this.userService.getMyProfile(userId);
}



@UseGuards(AuthGuard)
@Get("user/:id")
async getUserProfile(@Param("id") userId: string) {
  return this.userService.getUserProfile(userId);
}




/*********************updatePassword*********************************************** */
  @UseGuards(AuthGuard) 
  @Patch('update-password')
  async updatePassword(@Req() req, @Body() dto: UpdatePasswordDTO) {
    return this.userService.updatePassword(req.user._id, dto);
  }


@Post("upload-profile")
@UseGuards(AuthGuard)
@UseInterceptors(FileInterceptor("image", multerOptions))
async uploadProfilePic(
  @Req() req,
  @UploadedFile() image: Express.Multer.File
) {
  const userId = req.user._id;
  return this.userService.uploadProfilePic(userId, image);
}


/***********************upload-cover"******************************** */

@Post("upload-cover")
@UseGuards(AuthGuard)
@UseInterceptors(FileInterceptor("image", multerOptions))
async uploadCoverPic(
  @Req() req,
  @UploadedFile() file: Express.Multer.File
) {
  const userId = req.user._id;
  return this.userService.uploadCoverPic(userId, file);
}
/************************************************************* */

@UseGuards(AuthGuard)
@Delete("profile-pic")
async deleteProfilePic(@Req() req) {
  const userId = req.user._id;
  return this.userService.deleteProfilePic(userId);
}

/********************************************************************* */


@UseGuards(AuthGuard)
@Delete("cover-pic")
async deleteCoverPic(@Req() req) {
  const userId = req.user._id;
  return this.userService.deleteCoverPic(userId);
}




@Post("/upload-file")
@UseInterceptors(FileInterceptor("image",multerOptions))
uploadFile(@UploadedFile() file:Express.Multer.File ){
console.log(file);
 return { message: "File uploaded successfully", file };
}


@Post("/upload-files")
@UseInterceptors(FilesInterceptor("images",5,multerOptions))
uploadFiles(@UploadedFiles() file:Express.Multer.File ){
console.log(file);
 return { message: "Files uploaded successfully", file };
}


@UseGuards(AuthGuard)
@Delete("soft-delete")
async softDeleteAccount(@Req() req) {
  const userId = req.user._id;
  return this.userService.softDeleteAccount(userId);
}

  
  








}



