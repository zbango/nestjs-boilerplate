import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './book.schema';
import { CreateBookRequest, UpdateBookRequest } from './books.type';
import { isValidDate } from 'src/utils/date';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookRequest) {
    if (!createBookDto.title) {
      throw new BadRequestException('El título no puede estar vacío');
    }
    if (!createBookDto.author) {
      throw new BadRequestException('El autor no puede estar vacío');
    }
    if (!isValidDate(createBookDto.year)) {
      throw new BadRequestException(
        "Formato invalido de fecha, utilice: 'dd/mm/aaaa'",
      );
    }
    return this.booksService.create(createBookDto);
  }
  @Get()
  async findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Book> {
    return this.booksService.findOne(id);
  }
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookRequest,
  ): Promise<Book> {
    await this.booksService.update(id, updateBookDto);
    const book = await this.booksService.findOne(id);
    return book;
  }
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<string> {
    const book = await this.booksService.findOne(id);
    if (!book) return 'El libro no existe';
    await this.booksService.delete(id);
    return 'Eliminado correctamente';
  }
}
