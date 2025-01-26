import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().$extends({
  result: {
    uniqueReadingInterval: {
      numOfReadPages: {
        needs: { startPage: true, endPage: true },
        compute(uniqueReadingInterval) {
          return (
            uniqueReadingInterval.endPage - uniqueReadingInterval.startPage + 1
          );
        },
      },
    },
  },
});
