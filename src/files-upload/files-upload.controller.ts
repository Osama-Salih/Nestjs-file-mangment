import {
  Controller,
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

type File = Express.Multer.File;

@Controller('files-upload')
export class FilesUploadController {
  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 1) validate file type (extension)
          new FileTypeValidator({
            fileType: /png|jpg/,
          }),

          // 2) validate file size
          new MaxFileSizeValidator({
            maxSize: 2 * 1024 * 1024,
            message: (maxSize) =>
              `File is too big. Max file size is ${maxSize} bytes`,
          }),
        ],
        errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        exceptionFactory: (error: string) => {
          console.log('error', error);
          throw new UnprocessableEntityException(error);
        },
      }),
    )
    file: File,
  ) {
    return file;
  }

  @UseInterceptors(
    FilesInterceptor('files', 3, {
      limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB  (1 * 1024 one byte)
    }),
  )
  @Post('multiple')
  uploadMultipleFiles(@UploadedFiles() files: File[]) {
    return files.map((file) => file.originalname);
  }
}
