import { Express } from 'express';
import 'multer';
import { Controller, Get, Inject, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { fillObject } from '@project/util/util-core';
import { UploadedFileRdo } from './rdo/uploaded-file.rdo';
import { uploaderConfig } from '@project/config/config-uploader';
import { ConfigType } from '@nestjs/config';
import { MongoIdValidationPipe } from '@project/shared/shared-pipes';

@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,

    @Inject(uploaderConfig.KEY)
    private readonly applicationConfig: ConfigType<typeof uploaderConfig>,
  ) { }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @UploadedFile() file: Express.Multer.File
  ) {
    const newFile = await this.fileService.saveFile(file);
    const path = `${this.applicationConfig.serveRoot}${newFile.path}`;

    return fillObject(UploadedFileRdo, Object.assign(newFile, { path }));
  }

  @Get(':id')
  public async show(
    @Param('id', MongoIdValidationPipe) id: string
  ) {
    const existFile = await this.fileService.getFile(id);
    const path = `${this.applicationConfig.serveRoot}${existFile.path}`;

    return fillObject(UploadedFileRdo, Object.assign(existFile, { path }));
  }
}
