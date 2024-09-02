import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

type File = Express.Multer.File;

@Controller('files-upload')
export class FilesUploadController {
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB  (1 * 1024 one byte)
      },
    }),
  )
  @Post('single')
  uploadFile(@UploadedFile() file: File) {
    return file;
  }
}
