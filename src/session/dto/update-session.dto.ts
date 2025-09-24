import { OmitType } from '@nestjs/mapped-types';
import { CreateSessionDto } from './create-session.dto';

export class UpdateSessionDto extends OmitType(CreateSessionDto, ['userId', 'id'] as const) {}
