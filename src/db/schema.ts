import { sql } from 'drizzle-orm';
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  bigint,
} from 'drizzle-orm/pg-core';

// Specialties table
const specialties = pgTable('specialties', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Advocates table (removed specialties JSONB field)
const advocates = pgTable('advocates', {
  id: serial('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  city: text('city').notNull(),
  degree: text('degree').notNull(),
  yearsOfExperience: integer('years_of_experience').notNull(),
  phoneNumber: bigint('phone_number', { mode: 'number' }).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Junction table for many-to-many relationship
const advocateSpecialties = pgTable('advocate_specialties', {
  advocateId: integer('advocate_id').notNull().references(() => advocates.id, { onDelete: 'cascade' }),
  specialtyId: integer('specialty_id').notNull().references(() => specialties.id, { onDelete: 'cascade' }),
}, (table) => ({
  // Composite primary key
  pk: { name: 'advocate_specialties_pkey', columns: [table.advocateId, table.specialtyId] },
}));

export { advocates, specialties, advocateSpecialties };
