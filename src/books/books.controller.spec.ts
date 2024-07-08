import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

const mockBook = {
  title: 'Test Book',
  author: 'Test Author',
  year: '2020',
  genre: 'Test Genre',
};

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockBook),
            findAll: jest.fn().mockResolvedValue([mockBook]),
            findOne: jest.fn().mockResolvedValue(mockBook),
            update: jest.fn().mockResolvedValue(mockBook),
            delete: jest.fn().mockResolvedValue(mockBook),
          },
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should not create a book with empty title', async () => {
    const newBook = {
      ...mockBook,
      title: '',
    };

    try {
      await controller.create(newBook);
      fail('Expected to throw an error');
    } catch (error) {
      expect(error.message).toEqual('Title cannot be empty');
    }
  });

  it('should not create a book with empty author', async () => {
    const newBook = {
      ...mockBook,
      author: '',
    };

    try {
      await controller.create(newBook);
      fail('Expected to throw an error');
    } catch (error) {
      expect(error.message).toEqual('Author cannot be empty');
    }
  });

  it('should not create a book with invalid year', async () => {
    const newBook = {
      ...mockBook,
      year: 'invalid year',
    };

    try {
      await controller.create(newBook);
      fail('Expected to throw an error');
    } catch (error) {
      expect(error.message).toEqual('Invalid year format');
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new book', async () => {
    const newBook = await controller.create(mockBook);
    expect(newBook).toEqual(mockBook);
  });

  it('should return all books', async () => {
    const books = await controller.findAll();
    expect(books).toEqual([mockBook]);
  });

  it('should return a book by ID', async () => {
    const book = await controller.findOne('1');
    expect(book).toEqual(mockBook);
  });

  it('should update a book by ID', async () => {
    const updatedBook = await controller.update('1', mockBook);
    expect(updatedBook).toEqual(mockBook);
  });

  it('should delete a book by ID', async () => {
    const deleteMessage = await controller.delete('1');
    expect(deleteMessage).toEqual('Eliminado correctamente');
  });
});
