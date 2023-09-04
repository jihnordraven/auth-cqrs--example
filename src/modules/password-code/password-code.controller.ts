import { Controller } from '@nestjs/common';
import { PasswordCodeService } from './password-code.service';

@Controller('password-code')
export class PasswordCodeController {
  constructor(private readonly passwordCodeService: PasswordCodeService) {}
}
