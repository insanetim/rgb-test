import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DealStatus } from 'generated/prisma/enums';

export class DealQueryDto {
  @IsOptional()
  @IsEnum(DealStatus, { message: 'Status must be a valid deal status' })
  @Type(() => String)
  status?: DealStatus;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  clientId?: string;
}
