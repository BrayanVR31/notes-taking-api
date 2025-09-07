import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty({
    message: 'Tag cannot be an empty value.',
  })
  @IsString({
    message: 'Tag must be a string.',
  })
  @Length(1, 100, {
    message: 'Tag must be between 1 and 100 characters long.',
  })
  name: string;
}
