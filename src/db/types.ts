import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { advocates, specialties, advocateSpecialties } from './schema';

// Automatically inferred types from schema
export type Advocate = InferSelectModel<typeof advocates>;
export type NewAdvocate = InferInsertModel<typeof advocates>;

export type Specialty = InferSelectModel<typeof specialties>;
export type NewSpecialty = InferInsertModel<typeof specialties>;

export type AdvocateSpecialty = InferSelectModel<typeof advocateSpecialties>;
export type NewAdvocateSpecialty = InferInsertModel<typeof advocateSpecialties>;

// Joined types for queries with relationships
export type AdvocateWithSpecialties = Advocate & {
  specialties: Specialty[];
};
