import { Request, Response } from 'express';
import Book from '../models/Book';

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find().sort({ title: 1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const { isbn, title, author, publisher, category, quantity, shelfLocation, price } = req.body;
    const availableQuantity = quantity;
    const book = await Book.create({
      isbn,
      title,
      author,
      publisher,
      category,
      quantity,
      availableQuantity,
      shelfLocation,
      price,
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data or duplicate ISBN', error });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const { isbn, title, author, publisher, category, quantity, availableQuantity, shelfLocation, price } = req.body;
    const allowedUpdates: Record<string, any> = {};
    if (isbn !== undefined) allowedUpdates.isbn = isbn;
    if (title !== undefined) allowedUpdates.title = title;
    if (author !== undefined) allowedUpdates.author = author;
    if (publisher !== undefined) allowedUpdates.publisher = publisher;
    if (category !== undefined) allowedUpdates.category = category;
    if (quantity !== undefined) allowedUpdates.quantity = quantity;
    if (availableQuantity !== undefined) allowedUpdates.availableQuantity = availableQuantity;
    if (shelfLocation !== undefined) allowedUpdates.shelfLocation = shelfLocation;
    if (price !== undefined) allowedUpdates.price = price;

    const book = await Book.findByIdAndUpdate(req.params.id, allowedUpdates, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
