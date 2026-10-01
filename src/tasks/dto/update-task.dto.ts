import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto.js';
import { taskStatusEnum } from '../../db/schema.js';
import { IsIn, IsOptional } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({ enum: taskStatusEnum.enumValues, required: false })
  @IsIn(taskStatusEnum.enumValues)
  @IsOptional()
  status?: (typeof taskStatusEnum.enumValues)[number];
}
