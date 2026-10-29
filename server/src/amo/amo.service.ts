import { Injectable } from '@nestjs/common';
import { CreateAmoDto } from './dto/create-amo.dto';
import { UpdateAmoDto } from './dto/update-amo.dto';

@Injectable()
export class AmoService {
  create(createAmoDto: CreateAmoDto) {
    return 'This action adds a new amo';
  }

  findAll() {
    return `This action returns all amo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} amo`;
  }

  update(id: number, updateAmoDto: UpdateAmoDto) {
    return `This action updates a #${id} amo`;
  }

  remove(id: number) {
    return `This action removes a #${id} amo`;
  }
}
