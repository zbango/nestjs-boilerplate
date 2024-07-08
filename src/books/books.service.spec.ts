import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BooksService } from './books.service';
import { Book } from './book.schema';
import { Model } from 'mongoose';

const mockBook = {
  title: 'Test Book',
  author: 'Test Author',
  year: '2020',
  genre: 'Test Genre',
};

const mockBookModel = {
  new: jest.fn().mockResolvedValue(mockBook),
  constructor: jest.fn().mockResolvedValue(mockBook),
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  exec: jest.fn(),
};

describe('BooksService', () => {
  let service: BooksService;
  let model: Model<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken('Book'),
          useValue: mockBookModel,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    model = module.get<Model<Book>>(getModelToken('Book'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new book', async () => {
    jest
      .spyOn(model, 'create')
      .mockImplementationOnce(() => Promise.resolve(mockBook));
    const newBook = await service.create(mockBook);
    expect(newBook).toEqual(mockBook);
  });

  it('should return all books', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce([mockBook]),
    } as any);
    const books = await service.findAll();
    expect(books).toEqual([mockBook]);
  });

  it('should return a book by ID', async () => {
    jest.spyOn(model, 'findById').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockBook),
    } as any);
    const book = await service.findOne('1');
    expect(book).toEqual(mockBook);
  });

  it('should update a book by ID', async () => {
    jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockBook),
    } as any);
    const updatedBook = await service.update('1', mockBook);
    expect(updatedBook).toEqual(mockBook);
  });

  it('should delete a book by ID', async () => {
    jest.spyOn(model, 'findOneAndDelete').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockBook),
    } as any);
    const deletedBook = await service.delete('1');
    expect(deletedBook).toEqual(mockBook);
  });
});
