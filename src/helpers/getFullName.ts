type NameParts = {
  firstName: string;
  middleName?: string | null;
  lastName: string;
};

const getFullName = ({ firstName, middleName, lastName }: NameParts): string =>
  [firstName, middleName, lastName].filter(Boolean).join(' ');

export default getFullName;
