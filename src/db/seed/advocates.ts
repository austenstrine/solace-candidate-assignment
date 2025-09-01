const specialtyNames = [
  'Bipolar',
  'LGBTQ',
  'Medication/Prescribing',
  'Suicide History/Attempts',
  'General Mental Health (anxiety, depression, stress, grief, life transitions)',
  'Men\'s issues',
  'Relationship Issues (family, friends, couple, etc)',
  'Trauma & PTSD',
  'Personality disorders',
  'Personal growth',
  'Substance use/abuse',
  'Pediatrics',
  'Women\'s issues (post-partum, infertility, family planning)',
  'Chronic pain',
  'Weight loss & nutrition',
  'Eating disorders',
  'Diabetic Diet and nutrition',
  'Coaching (leadership, career, academic and wellness)',
  'Life coaching',
  'Obsessive-compulsive disorders',
  'Neuropsychological evaluations & testing (ADHD testing)',
  'Attention and Hyperactivity (ADHD)',
  'Sleep issues',
  'Schizophrenia and psychotic disorders',
  'Learning disorders',
  'Domestic abuse',
];

const firstNames = [
  'John',
  'Jane',
  'Michael',
  'Emily',
  'Chris',
  'Jessica',
  'David',
  'Laura',
  'Daniel',
  'Sarah',
  'James',
  'Megan',
  'Joshua',
  'Amanda',
];

const lastNames = [
  'Smith',
  'Brown',
  'Davis',
  'Martinez',
  'Taylor',
  'Harris',
  'Clark',
  'Lewis',
  'Lee',
  'King',
  'Green',
  'Walker',
  'Hall',
];

const cities = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
  'San Antonio',
  'San Diego',
  'Dallas',
  'San Jose',
  'Austin',
  'Jacksonville',
  'Columbus',
  'Fort Worth',
];

const degrees = [
  'MD',
  'PhD',
  'MSW',
  'MA',
  'MBA',
];

const randomSpecialty = () => {
  const random1 = Math.floor(Math.random() * 24);
  const random2 = Math.floor(Math.random() * (24 - random1)) + random1 + 1;

  return [random1, random2];
};

function generateAdvocate() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const degree = degrees[Math.floor(Math.random() * degrees.length)];

  const yearsOfExperience = Math.floor(Math.random() * 20) + 1;
  const phoneNumber = Math.floor(Math.random() * 9000000000) + 1000000000;

  return {
    firstName,
    lastName,
    city,
    degree,
    yearsOfExperience,
    phoneNumber,
  };
}

const advocateData = Array.from({ length: 1000 }, generateAdvocate);

const specialtyData = specialtyNames.map(name => ({
  name,
}));

// Helper function to generate random specialties for an advocate
export function generateRandomSpecialties(specialtyCount: number) {
  const numberOfSpecialties = Math.floor(Math.random() * 4) + 2; // 2 to 5 specialties
  const selectedSpecialtyIndexes = new Set<number>();
  
  // Randomly select unique specialty indexes
  while (selectedSpecialtyIndexes.size < numberOfSpecialties) {
    const randomIndex = Math.floor(Math.random() * specialtyCount);
    selectedSpecialtyIndexes.add(randomIndex);
  }
  
  return Array.from(selectedSpecialtyIndexes);
}

export { advocateData, specialtyData };
