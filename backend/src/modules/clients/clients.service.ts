import { createPaginatedResponse } from '@common/helpers/pagination.helper';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateClientDto) {
    const existingClient = await this.prisma.client.findUnique({
      where: { email: data.email },
    });

    if (existingClient) {
      throw new ConflictException(
        `Client with email ${data.email} already exists`,
      );
    }

    return await this.prisma.client.create({ data });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [clients, total] = await Promise.all([
      this.prisma.client.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.client.count(),
    ]);

    return createPaginatedResponse(clients, page, limit, total);
  }

  async findOne(id: string) {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid client ID is required');
    }

    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        deals: true,
      },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    return client;
  }

  async update(id: string, data: UpdateClientDto) {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid client ID is required');
    }

    const existingClient = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!existingClient) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    // Check for email duplication if email is being updated
    if (data.email && data.email !== existingClient.email) {
      const emailExists = await this.prisma.client.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        throw new ConflictException(
          `Client with email ${data.email} already exists`,
        );
      }
    }

    return await this.prisma.client.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('Valid client ID is required');
    }

    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with id ${id} not found`);
    }

    return await this.prisma.client.delete({
      where: { id },
    });
  }
}
