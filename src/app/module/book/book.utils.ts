import { Book } from './book.model';

const findLastBookId = async () => {
  const lastBook = await Book.findOne({}, { bookID: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastBook?.bookID ? lastBook.bookID : undefined;
};

export const generateBookId = async () => {
  let currentId = (0).toString();
  const lastBookId = await findLastBookId();

  if (lastBookId) {
    currentId = lastBookId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `B-${incrementId}`;

  return incrementId;
};
