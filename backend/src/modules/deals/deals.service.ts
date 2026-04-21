import { createPaginatedResponse } from '@common/helpers/pagination.helper';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { DealStatus } from 'generated/prisma/enums';
import { CreateDealDto } from './dto/create-deal.dto';
import { DealQueryPaginationDto } from './dto/deal-query-pagination.dto';
import { UpdateDealDto } from './dto/update-deal.dto';

@Injectable()
export class DealsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDealDto) {
    const client = await this.prisma.client.findUnique({
      where: { id: data.clientId },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${data.clientId} not found`);
    }

    return await this.prisma.deal.create({
      data: {
        ...data,
        status: data.status || DealStatus.NEW,
      },
    });
  }

  async findAll(query: DealQueryPaginationDto) {
    const { status, clientId, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    const [deals, total] = await Promise.all([
      this.prisma.deal.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.deal.count({ where }),
    ]);

    return createPaginatedResponse(deals, page, limit, total);
  }

  async findOne(id: string) {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid deal ID is required');
    }

    const deal = await this.prisma.deal.findUnique({
      where: { id },
    });

    if (!deal) {
      throw new NotFoundException(`Deal with id ${id} not found`);
    }

    return deal;
  }

  async update(id: string, data: UpdateDealDto) {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid deal ID is required');
    }

    const existingDeal = await this.prisma.deal.findUnique({
      where: { id },
    });

    if (!existingDeal) {
      throw new NotFoundException(`Deal with id ${id} not found`);
    }

    return await this.prisma.deal.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid deal ID is required');
    }

    const deal = await this.prisma.deal.findUnique({
      where: { id },
    });

    if (!deal) {
      throw new NotFoundException(`Deal with id ${id} not found`);
    }

    return await this.prisma.deal.delete({
      where: { id },
    });
  }
}
