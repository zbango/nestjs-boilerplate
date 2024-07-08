import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './book.schema';
import { ObjectId } from 'mongodb';
import { CreateBookRequest, UpdateBookRequest } from './books.type';

@Injectable()
export class BooksService {
  constructor(@InjectModel('Book') private readonly bookModel: Model<Book>) {}

  async create(bookDto: CreateBookRequest): Promise<Book> {
    const createdBook = new this.bookModel(bookDto);
    return createdBook.save();
  }
  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }
  async findOne(id: string): Promise<Book> {
    //return this.bookModel.findById(new ObjectId(id)).exec();
    const book = await this.bookModel.findById(this.toObjectId(id)).exec();
    if (!book) {
      throw new NotFoundException('Libro no encontrado');
    }
    return book;
  }
  async update(id: string, bookDto: UpdateBookRequest): Promise<Book> {
    //return this.bookModel.findByIdAndUpdate(id, bookDto, { new: true }).exec();
    const updatedBook = await this.bookModel
      .findByIdAndUpdate(this.toObjectId(id), bookDto, { new: true })
      .exec();
    if (!updatedBook) {
      throw new NotFoundException('Libro no encontrado');
    }
    return updatedBook;
  }
  async delete(id: string): Promise<Book> {
    //return this.bookModel.findOneAndDelete(new ObjectId(id)).exec();
    const deletedBook = await this.bookModel
      .findByIdAndDelete(this.toObjectId(id))
      .exec();
    if (!deletedBook) {
      throw new NotFoundException('Libro no encontrado');
    }
    return deletedBook;
  }

  private toObjectId(id: string): ObjectId {
    return new ObjectId(id);
  }
}
