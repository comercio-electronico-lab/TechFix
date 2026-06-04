// Utilidades de fechas mock

export const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

export const getNextWeekDate = () => {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  return nextWeek.toISOString().split('T')[0];
};

export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

export const MOCK_TIME_SLOTS = [
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '01:00 PM - 03:00 PM',
  '03:00 PM - 05:00 PM',
];

export const getMockTimeSlot = () => {
  return MOCK_TIME_SLOTS[Math.floor(Math.random() * MOCK_TIME_SLOTS.length)];
};

export const getDefaultTimeSlot = () => {
  return MOCK_TIME_SLOTS[0]; // 09:00 AM - 11:00 AM
};
