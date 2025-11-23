import { IsString, IsEmail, IsOptional, MinLength, IsBoolean } from 'class-validator';

export class CreateCompanyDtoTemp {
  @IsString()
  @MinLength(2)
  companyName: string;  

  @IsEmail()
  companyEmail: string;  

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  numberOfEmployees?: string;

  @IsOptional()
  @IsBoolean()
  approvedByAdmin?: boolean; 

  
  @IsOptional()
  profilePic?: { secure_url: string; public_id: string };

  @IsOptional()
  coverPic?: { secure_url: string; public_id: string };

  @IsOptional()
  legalAttachment?: { secure_url: string; public_id: string };
}


export class UpdateCompanyDto {

  @IsOptional()
  @IsString()
  @MinLength(2)
  companyName?: string;

  @IsOptional()
  @IsEmail()
  companyEmail?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  numberOfEmployees?: string;

  @IsOptional()
  @IsBoolean()
  approvedByAdmin?: boolean;

  @IsOptional()
  profilePic?: { secure_url: string; public_id: string };

  @IsOptional()
  coverPic?: { secure_url: string; public_id: string };

}