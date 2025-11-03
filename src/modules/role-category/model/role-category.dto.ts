import { IsNotEmpty, IsString } from 'class-validator';

export class RoleCategoryDto {
  constructor(name: string) {
    this.name = name;
  }

  @IsString()
  @IsNotEmpty()
  name: string;
}
