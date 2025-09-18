import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

const base = "https://wilayah.id/api";

type ListResponse<T> = {
  data: T[];
  meta?: { updated_at?: string };
};

type Area = { code: string; name: string };

async function fetchJson<T>(url: string) {
  try {
    const response = await axios.get<T>(url, { timeout: 20000 });

    return response.data;
  } catch (err) {
    console.log("failed to fetch:", url);
    throw err;
  }
}

async function main() {
  try {
    const country = await prisma.country.upsert({
      where: { code: "ID" },
      update: { name: "INDONESIA" },
      create: { code: "ID", name: "INDONESIA" },
    });

    const provinceRes = await fetchJson<ListResponse<Area>>(
      `${base}/provinces.json`
    );

    console.log("provinceRes nih ->>>>>", provinceRes);
    const province = provinceRes.data;

    for (const p of province) {
      try {
        const provinceRow = await prisma.province.upsert({
          where: {
            country_id_name: {
              country_id: country.id,
              name: p.name,
            },
          },
          update: { name: p.name },
          create: { name: p.name, country_id: country.id },
        });

        const regRes = await fetchJson<ListResponse<Area>>(
          `${base}/regencies/${p.code}.json`
        );
        const regencies = regRes.data;

        await prisma.$transaction(
          regencies.map((r) => {
            return prisma.city.upsert({
              where: {
                province_id_name: {
                  province_id: provinceRow.id,
                  name: r.name,
                },
              },
              update: { name: r.name },
              create: { name: r.name, province_id: provinceRow.id },
            });
          })
        );

        console.log(`${p.name}: ${regencies.length} cities`);
      } catch (err) {
        console.error(` Error proses provinsi ${p.name}:`, err);
      }
    }
    console.log("seeding selesai");
  } catch (err) {
    console.error("seeding gagal", err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(() => process.exit(1));
