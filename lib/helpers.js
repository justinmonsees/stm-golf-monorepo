export function convertToLocalDate(date) {
  const utcDate = new Date(date);

  const localDate = new Date(
    utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
  );

  return localDate;
}
