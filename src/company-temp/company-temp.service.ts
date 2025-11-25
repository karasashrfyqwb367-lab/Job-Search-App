import { Injectable ,BadRequestException,NotFoundException,ForbiddenException} from '@nestjs/common';
import { CreateCompanyDtoTemp } from './dto/create-company-temp.dto';
//import { UpdateCompanyTempDto } from './dto/update-company-temp.dto';
import { Company, CompanyDocument, companyModel } from 'src/DB/model/Company';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/DB/model/User.Model';

@Injectable()


export class CompanyTempService {
  constructor(
        @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>,
          @InjectModel(User.name) private readonly userModel: Model<User>,

  ){

  }
 async create(createCompanyDto: CreateCompanyDtoTemp) {
  const { companyName, companyEmail } = createCompanyDto;

  const existingCompany = await this.companyModel.findOne({
    $or: [{ companyName }, { companyEmail }],
  });

  if (existingCompany) {
    throw new BadRequestException('Company name or email already exists');
  }

  const newCompany = new this.companyModel(createCompanyDto);
  return newCompany.save();
}

  
// company.service.ts
async updateCompany(companyId: string, userId: string, data: any) {
  // انا هبعت company Id in paramas
  const company = await this.companyModel.findById(companyId);
  if (!company) {
    throw new NotFoundException("Company not found");
  }

  //user aly amlel login how createBy 
  if (company.createdBy.toString() !== userId.toString()) {
    throw new ForbiddenException("You are not allowed to update this company");
  }
  
  if (data.legalAttachment) {
    delete data.legalAttachment; // امسحها من الـ body
  }

  //find companId data اللي مبعوت
  const updatedCompany = await this.companyModel.findByIdAndUpdate(
    companyId,
    data,
    { new: true }
  );

  return {
    message: "Company updated successfully",
    updatedCompany,
  };
}



 async softDeleteCompany(companyId: string, user: User): Promise<{ message: string }> {

    const company = await this.companyModel.findById(companyId);
    if (!company) throw new NotFoundException('Company not found');

const userId = (user as any)._id as Types.ObjectId

    if (user.role !== 'ADMIN' && company.createdBy.toString() == userId.toString()) {
      throw new ForbiddenException('You are not allowed ');
    }

    company.deletedAt = new Date();
    await company.save();
    return { message: " soft deleted successfully" }
  }


  async getCompanyWithJobs(companyId: string) {
  const company = await this.companyModel
    .findById(companyId)
    .populate("jobs"); 

  if (!company) {
    throw new NotFoundException("Company not found");
  }

  return company;
}


  async searchCompanyByName(name: string) {
  const regex = new RegExp(name, 'i'); 
  return this.companyModel.find({ companyName: regex }).exec();
}

async uploadLogo(companyId: string, user: any, file: Express.Multer.File) {
  if (!file) {
    throw new BadRequestException("No file uploaded");
  }

  const company = await this.companyModel.findById(companyId);
  if (!company) {
    throw new NotFoundException("Company not found");
  }

  if (user.role !== "ADMIN" && company.createdBy.toString() !== user._id.toString()) {
    throw new ForbiddenException("You are not allowed to update this company's logo");
  }

  const filePath = `uploads/${file.filename}`;

  company.profilePic = {
    secure_url: filePath,
    public_id: file.filename,
  };

  await company.save();

  return {
    message: "Company logo uploaded successfully",
    filename: file.filename,
    path: filePath,
    company,
  };
}
// company-temp.service.ts
async uploadCoverPic(companyId: string, user: any, file: Express.Multer.File) {
  if (!file) {
    throw new BadRequestException("No file uploaded");
  }
  const company = await this.companyModel.findById(companyId);
  if (!company) {
    throw new NotFoundException("Company not found");
  }
  if (user.role !== "ADMIN" && company.createdBy.toString() !== user._id.toString()) {
    throw new ForbiddenException("You are not allowed to update this company's cover");
  }
  const filePath = `uploads/${file.filename}`;
  company.coverPic = {
    secure_url: filePath,
    public_id: file.filename,
  };
  await company.save();

  return {
    message: "Company cover uploaded successfully",
    filename: file.filename,
    path: filePath,
    company,
  };
}


async deleteLogo(companyId: string, user: any) {
  const company = await this.companyModel.findById(companyId);
  if (!company) {
    throw new NotFoundException("Company not found");
  }

  if (user.role !== "ADMIN" && company.createdBy.toString() !== user._id.toString()) {
    throw new ForbiddenException("You are not allowed to delete this logo");
  }

  if (company.profilePic && company.profilePic.public_id) {
    const fs = require("fs");
    const filePath = `./src/uploads/${company.profilePic.public_id}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  company.profilePic = undefined;
  await company.save();

  return { message: "Company logo deleted successfully" };
}


async deleteCover(companyId: string, user: any) {
  const company = await this.companyModel.findById(companyId);
  if (!company) {
    throw new NotFoundException("Company not found");
  }


  if (user.role !== "ADMIN" && company.createdBy.toString() !== user._id.toString()) {
    throw new ForbiddenException("You are not allowed to delete this cover picture");
  }
  if (company.coverPic && company.coverPic.public_id) {
    const fs = require("fs");
    const filePath = `./src/uploads/${company.coverPic.public_id}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  company.coverPic = undefined;
  await company.save();

  return { message: "Company cover picture deleted successfully" };
}



 
}
