import { propertiesRepository } from "../repositories/properties.repository";
import { IFeaturedProperty } from "../interfaces/properties.interface";

export const propertiesService = {
  async getAll(query: {
    city?: string;
    category?: string;
    facilities?: string[];
    minPrice?: number;
    maxPrice?: number;
    guests?: number;
    startDate?: string;
    endDate?: string;
    sort?: "price_asc" | "price_desc" | "rating_desc";
    take?: number;
    skip?: number;
  }): Promise<{ items: IFeaturedProperty[]; total: number }> {
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    const { items, total } = await propertiesRepository.getAll({
      city: query.city,
      category: query.category,
      facilities: query.facilities,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      guests: query.guests,
      startDate,
      endDate,
      sort: query.sort,
      take: query.take,
      skip: query.skip,
    });

    let mapped = items.map((prop) => {
      const minPrice =
        prop.room_types.reduce((acc, rt) => {
          const p = Number(rt.pricings[0]?.value ?? rt.base_price);
          return acc === null || p < acc ? p : acc;
        }, null as number | null) ?? 0;

      const ratingSum = prop.room_types.flatMap((rt) =>
        rt.transactions.map((t) => t.reservation?.review?.rating ?? 0)
      );
      const rating =
        ratingSum.length > 0
          ? ratingSum.reduce((a, b) => a + b, 0) / ratingSum.length
          : 0;

      const dto: IFeaturedProperty = {
        id: prop.id,
        slug: prop.slug,
        name: prop.name,
        description: prop.description,
        city: prop.city.name,
        category: prop.category.name,
        property: prop.name, 
        imageUrl: prop.pictures[0]?.url || null,
        price: minPrice,
        rating,
      };
      return dto;
    });

    if (query.sort === "rating_desc") {
      mapped = mapped.sort((a, b) => b.rating - a.rating);
    }

    return { items: mapped, total };
  },

  async getDetail(slugOrId: string) {
    const prop = await propertiesRepository.getBySlugOrId(slugOrId);
    if (!prop) return null;

    const ratingSum = prop.room_types.flatMap((rt) =>
      rt.transactions.map((t) => t.reservation?.review?.rating ?? 0)
    );
    const rating =
      ratingSum.length > 0
        ? ratingSum.reduce((a, b) => a + b, 0) / ratingSum.length
        : 0;

    const minPrice =
      prop.room_types.reduce((acc, rt) => {
        const p = Number(rt.pricings[0]?.value ?? rt.base_price);
        return acc === null || p < acc ? p : acc;
      }, null as number | null) ?? 0;

    return {
      id: prop.id,
      slug: prop.slug,
      name: prop.name,
      description: prop.description,
      city: prop.city.name,
      category: prop.category.name,
      images: prop.pictures.map((pic) => pic.url),
      price: minPrice,
      rating,
      rooms: prop.room_types.map((rt) => ({
        id: rt.id,
        name: rt.name,
        capacity: rt.capacity,
        price: Number(rt.pricings[0]?.value ?? rt.base_price),
        images: rt.room_type_pictures.map((p) => p.url),
        facilities: rt.facilities.map((f) => f.room_facility.name),
        daily: rt.availabilities.map((a) => ({
          date: a.date,
          available: a.total_rooms - a.held_count - a.booked_count,
          price: Number(
            rt.pricings.find(
              (p) => p.start_date <= a.date && p.end_date >= a.date
            )?.value ?? rt.base_price
          ),
        })),
      })),
    };
  },
};
