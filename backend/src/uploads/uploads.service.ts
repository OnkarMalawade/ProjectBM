import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from './entities/upload.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,
  ) {}

  async saveFile(file: Express.Multer.File, user: User) {
    const upload = this.uploadRepository.create({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      uploadedBy: user,
    });
    return this.uploadRepository.save(upload);
  }

  async getFilesByUser(userId: number) {
    return this.uploadRepository.find({
      where: { uploadedBy: { id: userId } },
    });
  }
}
