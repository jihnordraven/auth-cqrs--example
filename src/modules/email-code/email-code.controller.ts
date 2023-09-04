import { Controller } from '@nestjs/common';
import { EmailCodeService } from './email-code.service';

@Controller('email-code')
export class EmailCodeController {
  constructor(private readonly emailCodeService: EmailCodeService) {}
}
