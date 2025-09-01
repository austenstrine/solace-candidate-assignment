import db from '../../../db';
import { advocates, specialties, advocateSpecialties } from '../../../db/schema';
import { eq, count, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Pagination parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '25');
  const offset = (page - 1) * limit;

  // Search parameter
  const search = searchParams.get('search') || '';

  try {
    // Build comprehensive search condition across multiple fields
    const searchCondition = (search 
      ? (sql`(
          ${advocates.firstName} || ' ' || ${advocates.lastName} ILIKE ${`%${search}%`}
          OR ${advocates.city} ILIKE ${`%${search}%`}
          OR ${advocates.degree} ILIKE ${`%${search}%`}
          OR ${advocates.phoneNumber}::text ILIKE ${`%${search}%`}
          OR EXISTS (
            SELECT 1 FROM ${advocateSpecialties} as_search 
            INNER JOIN ${specialties} s_search ON as_search.specialty_id = s_search.id
            WHERE as_search.advocate_id = ${advocates.id}
            AND s_search.name ILIKE ${`%${search}%`}
          )
        )`)
      : undefined
    );

    // Run count and data queries in parallel for better performance
    const [totalCountResult, advocatesData] = await Promise.all([
      // Count query with search filter
      (db
        .select({ count: count() })
        .from(advocates)
        .where(searchCondition)
      ),
      // Main data query with aggregated specialties in a single query
      (db
        .select({
          // Advocate fields (using actual schema column names)
          id: advocates.id,
          firstName: advocates.firstName,
          lastName: advocates.lastName,
          city: advocates.city,
          degree: advocates.degree,
          yearsOfExperience: advocates.yearsOfExperience,
          phoneNumber: advocates.phoneNumber,
          createdAt: advocates.createdAt,
          // Computed full name for convenience
          fullName: (sql<string>`${advocates.firstName} || ' ' || ${advocates.lastName}`),
          // Aggregated specialties using PostgreSQL's row-to-JSON magic
          // COALESCE ensures we get an empty array [] instead of null for advocates with no specialties
          // JSON_AGG aggregates multiple specialty rows into a single JSON array
          // The FILTER clause excludes NULL specialties (advocates with no specialties)
          specialties: (sql<any[]>`
            COALESCE(
              JSON_AGG(${specialties} ORDER BY ${specialties.name}) 
                FILTER (WHERE ${specialties.id} IS NOT NULL),
              '[]'::json
            )
          `),
        })
        .from(advocates)
        .leftJoin(advocateSpecialties, eq(advocates.id, advocateSpecialties.advocateId))
        .leftJoin(specialties, eq(advocateSpecialties.specialtyId, specialties.id))
        .where(searchCondition)
        .groupBy(advocates.id, advocates.firstName, advocates.lastName, advocates.city, advocates.degree, advocates.yearsOfExperience, advocates.phoneNumber, advocates.createdAt)
        .orderBy(advocates.firstName, advocates.lastName)
        .limit(limit)
        .offset(offset)
      ),
    ]);

    const totalCount = totalCountResult[0].count;
    const totalPages = Math.ceil(totalCount / limit);

    // Data is already properly structured with row-to-JSON magic
    const groupedData = advocatesData;

    return Response.json({ 
      data: groupedData,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } 
  catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: 'Failed to fetch advocates' }, 
      { status: 500 }
    );
  }
}
