import { FileValidator } from '@nestjs/common/pipes/file/file-validator.interface';
import magicBytes from 'magic-bytes.js';

export class FileSignatureValidator extends FileValidator {
  constructor() {
    super({});
  }

  buildErrorMessage(): string {
    return 'Validation failed (file type does not match file signature)';
  }

  isValid(file: any): boolean {
    // validate file signature
    const fileSignatures = magicBytes(file.buffer).map((file) => file.mime);
    if (!fileSignatures.length) return false;

    const isMatch = fileSignatures.includes(file.mimetype);
    if (!isMatch) return false;

    return true;
  }
}
