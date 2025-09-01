import db from '../../../db';
import { advocates, specialties, advocateSpecialties } from '../../../db/schema';
import { advocateData, specialtyData, generateRandomSpecialties } from '../../../db/seed/advocates';

export async function POST() {
  try {
    // Step 0: Clear existing data (in correct order due to foreign key constraints)
    console.log('Clearing existing data...');
    await db.delete(advocateSpecialties); // Junction table first
    await db.delete(advocates); // Then advocates
    await db.delete(specialties); // Finally specialties
    
    console.log('Cleared existing data');

    // Step 1: Insert specialties first and get their actual IDs
    const insertedSpecialties = await db.insert(specialties)
      .values(specialtyData)
      .returning();

    console.log(`Inserted ${insertedSpecialties.length} specialties`);

    // Step 2: Insert advocates and get their actual IDs
    const insertedAdvocates = await db.insert(advocates)
      .values(advocateData)
      .returning();

    console.log(`Inserted ${insertedAdvocates.length} advocates`);

    // Step 3: Create advocate-specialty relationships using real IDs
    const relationshipData = insertedAdvocates.flatMap((advocate: any) => {
      const specialtyIndexes = generateRandomSpecialties(insertedSpecialties.length);
      
      return specialtyIndexes.map(index => ({
        advocateId: advocate.id,
        specialtyId: insertedSpecialties[index].id,
      }));
    });

    const insertedRelationships = await db.insert(advocateSpecialties)
      .values(relationshipData)
      .returning();

    console.log(`✅ Created ${insertedRelationships.length} advocate-specialty relationships`);

    return Response.json({
      success: true,
      data: {
        specialties: insertedSpecialties.length,
        advocates: insertedAdvocates.length,
        relationships: insertedRelationships.length,
      }
    });

  } 
	catch (error) {
    console.error('Seeding error:', error);
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
