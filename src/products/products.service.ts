// import { Injectable } from '@nestjs/common';
// import { TenantPrismaService } from 'prisma/migrations/tenant/tenant-prisma.service';

// @Injectable()
// export class ProductsService {
//   constructor(private readonly prisma: TenantPrismaService) {}

//   async create(data: {
//     name: string;
//     description?: string;
//     price: number;
//     stock: number;
//     ownerId: string;
//   }) {
//     return this.prisma.product.create({
//       data,
//       include: { owner: true },
//     });
//   }

//   async findAll() {
//     return this.prisma.product.findMany({
//       include: { owner: true },
//     });
//   }

//   async findOne(id: string) {
//     return this.prisma.product.findUnique({
//       where: { id },
//       include: { owner: true },
//     });
//   }

//   async update(
//     id: string,
//     data: Partial<{
//       name: string;
//       description?: string;
//       price: number;
//       stock: number;
//     }>,
//   ) {
//     return this.prisma.product.update({
//       where: { id },
//       data,
//     });
//   }

//   async remove(id: string) {
//     return this.prisma.product.delete({
//       where: { id },
//     });
//   }
// }
