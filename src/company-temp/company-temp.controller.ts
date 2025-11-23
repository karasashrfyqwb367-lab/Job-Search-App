import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Req, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CompanyTempService } from './company-temp.service';
import { CreateCompanyDtoTemp, UpdateCompanyDto } from './dto/create-company-temp.dto';
//import { UpdateCompanyTempDto } from './dto/update-company-temp.dto';
import { Company } from 'src/DB/model/Company';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { RoleEnum } from 'src/common/enum/enum';
import { Roles, RolesGuard } from 'src/common/guards/Authorization.guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/upload/multer';


@Controller('company-temp')
export class CompanyTempController {
  constructor(private readonly companyTempService: CompanyTempService) {}

  @Post("create")
  async create(@Body() createCompanyDto: CreateCompanyDtoTemp): Promise<Company> {
    return this.companyTempService.create(createCompanyDto);
  }
@Put(":id")
@UseGuards(AuthGuard)
async updateCompany(
  @Param("id") companyId: string,
  @Req() req,
  @Body() updateDto: UpdateCompanyDto,
) {
  return this.companyTempService.updateCompany(companyId,req.user._id, updateDto);
}
@Delete(':id')
  @UseGuards(AuthGuard, RolesGuard) 
 @Roles([RoleEnum.ADAME, RoleEnum.USER]) 
  async softDelete(@Param('id') id: string, @Req() req) {
    return this.companyTempService.softDeleteCompany(id, req.user);
  }

/***************************Get specific company with related jobs. (2 Grades)************************** */


/************************************************* */


@Get('search')
async searchCompany(@Query('name') name: string) {
  return this.companyTempService.searchCompanyByName(name);
}

/********************************************************* */
@Post("upload-logo/:companyId")
@UseGuards(AuthGuard)
@UseInterceptors(FileInterceptor("image", multerOptions))
async uploadCompanyLogo(
  @Req() req,
  @Param("companyId") companyId: string,
  @UploadedFile() image: Express.Multer.File
) {
  return this.companyTempService.uploadLogo(companyId, req.user, image);
}

/*********************************************** */

@Post("upload-cover/:companyId")
@UseGuards(AuthGuard)
@UseInterceptors(FileInterceptor("image", multerOptions))
async uploadCoverPic(
  @Req() req,
  @UploadedFile() file: Express.Multer.File,
  @Param("companyId") companyId: string
) {
  return this.companyTempService.uploadCoverPic(companyId, req.user, file);
}


@UseGuards(AuthGuard)
@Delete("logo/:companyId")
async deleteCompanyLogo(
  @Req() req,
  @Param("companyId") companyId: string
) {
  return this.companyTempService.deleteLogo(companyId, req.user);
}


@UseGuards(AuthGuard)
@Delete("cover/:companyId")
async deleteCompanyCover(
  @Req() req,
  @Param("companyId") companyId: string
) {
  return this.companyTempService.deleteCover(companyId, req.user);
}





}
