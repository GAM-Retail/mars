import db from '~/lib/db';

export const getAllUsers = async () => {
  return db.user.findMany({
    orderBy: { name: 'asc' },
  });
};
