// Re-exportar datos de usuarios desde la carpeta mock existente
export { mockUsers } from '@/mock/users';

// Extraer solo datos útiles de usuarios
import { mockUsers } from '@/mock/users';

export const getMockPhone = () => {
  const phones = mockUsers.filter(u => u.phone).map(u => u.phone!);
  return phones[Math.floor(Math.random() * phones.length)];
};

export const getMockPhones = () => {
  return mockUsers.filter(u => u.phone).map(u => u.phone!);
};

export const getMockUserEmail = () => {
  return mockUsers[Math.floor(Math.random() * mockUsers.length)].email;
};
