import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';

@Injectable()
export class BoardsService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  // async createBoard(
  //   createBoardDto: CreateBoardDto,
  //   USER: User,
  // ): Promise<Board> {
  //   return this.boardRepository.createBoard(createBoardDto, USER);
  // }
  async createBoard(createBoardDto: CreateBoardDto, USER) {
    try {
      const BOARD = await this.knex.table('BOARD').insert({
        TITLE: createBoardDto.TITLE,
        DESCRIPTION: createBoardDto.DESCRIPTION,
        STATUS: BoardStatus.PUBLIC,
        uSERID: USER.ID,
      });
      return { BOARD };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  // async getBoardById(ID: number): Promise<Board> {
  //   const found = await this.boardRepository.findOne({ where: { ID } });

  //   if (!found) {
  //     throw new NotFoundException('해당 게시물이 존재하지 않습니다');
  //   }

  //   return found;
  // }

  async getBoardById(ID: number) {
    if (!ID) {
      throw new NotFoundException(`Board ${ID} does not exist`);
    }

    const BOARDS = await this.knex.table('BOARD').where('ID', ID);
    return { BOARDS };
  }

  // async getAllBoards(USER: User): Promise<Board[]> {
  //   const query = this.boardRepository.createQueryBuilder('BOARD');

  //   query.where('BOARD.uSERID=:USERID', { USERID: USER.ID });

  //   const BOARDS = await query.getMany();
  //   return BOARDS;
  // }

  async getAllBoards() {
    const BOARDS = await this.knex.table('BOARD');
    return { BOARDS };
  }

  // async updateBoardStatus(ID: number, STATUS: BoardStatus): Promise<Board> {
  //   const BOARD = await this.getBoardById(ID);
  //   BOARD.STATUS = STATUS;
  //   await this.boardRepository.save(BOARD);

  //   return BOARD;
  // }

  async updateBoardStatus(ID: number, STATUS: BoardStatus) {
    try {
      const BOARD = await this.knex.table('BOARD').where('ID', ID).update({
        STATUS,
      });
      return { BOARD };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  // async deleteBoard(ID: number, USER: User): Promise<void> {
  //   const result = await this.boardRepository.delete({
  //     ID,
  //     USER: { ID: USER.ID },
  //   });
  //   if (result.affected === 0) {
  //     throw new NotFoundException('존재하지 않는 게시글입니다.');
  //   }
  // }

  async deleteBoard(ID: number, USER) {
    if (!ID) {
      throw new NotFoundException(`Board ${ID} does not exist.`);
    }

    const BOARD = await this.knex
      .table('BOARD')
      .where('ID', ID)
      .andWhere('USER', { ID: USER.ID })
      .del();
    return { BOARD };
  }
}
