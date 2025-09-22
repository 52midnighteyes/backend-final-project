import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const propertiesRepository = {
  async getAll(options: {
    city?: string;
    category?: string;
    facilities?: string[];
    minPrice?: number;
    maxPrice?: number;
    guests?: number;
    startDate?: Date;
    endDate?: Date;
    sort?: "price_asc" | "price_desc" | "rating_desc";
    take?: number;
    skip?: number;
  }) {
    const {
      city,
      category,
      facilities,
      minPrice = 0,
      maxPrice,
      guests,
      startDate,
      endDate,
      sort,
      take = 20,
      skip = 0,
    } = options;

    const where: any = {
      deleted_at: null,
      city: city
        ? { name: { contains: city, mode: "insensitive" } }
        : undefined,
      category: category
        ? { name: { contains: category, mode: "insensitive" } }
        : undefined,
      room_types: {
        some: {
          base_price: {
            gte: minPrice,
            ...(typeof maxPrice === "number" ? { lte: maxPrice } : {}),
          },
          capacity: guests ? { gte: guests } : undefined,
          facilities: facilities?.length
            ? { some: { room_facility: { name: { in: facilities } } } }
            : undefined,
          availabilities:
            startDate && endDate
              ? {
                  some: {
                    date: { gte: startDate, lte: endDate },
                    total_rooms: { gt: 0 },
                  },
                }
              : undefined,
        },
      },
    };

    let orderBy: any = undefined;
    if (sort === "price_asc")
      orderBy = { room_types: { _min: { base_price: "asc" } } };
    else if (sort === "price_desc")
      orderBy = { room_types: { _min: { base_price: "desc" } } };

    const [items, total] = await Promise.all([
      prisma.property.findMany({
        where,
        take,
        skip,
        orderBy,
        include: {
          city: true,
          category: true,
          pictures: true,
          room_types: {
            include: {
              room_type_pictures: true,
              facilities: { include: { room_facility: true } },
              pricings: { orderBy: { start_date: "asc" }, take: 1 },
              availabilities: true,
              transactions: {
                include: { reservation: { include: { review: true } } },
              },
            },
          },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return { items, total };
  },

  async getBySlugOrId(slugOrId: string) {
    return prisma.property.findFirst({
      where: { OR: [{ slug: slugOrId }, { id: slugOrId }], deleted_at: null },
      include: {
        city: true,
        category: true,
        pictures: true,
        room_types: {
          include: {
            pricings: { orderBy: { start_date: "asc" } },
            availabilities: true,
            room_type_pictures: true,
            facilities: { include: { room_facility: true } },
            transactions: {
              include: { reservation: { include: { review: true } } },
            },
          },
        },
      },
    });
  },
};
