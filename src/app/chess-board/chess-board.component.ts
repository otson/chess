import {Component, Input, OnInit} from '@angular/core';
import {Piece} from "../piece";

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css']
})
export class ChessBoardComponent implements OnInit {
  public get Piece(): typeof Piece {
    return Piece;
  }

  dragging: boolean  = false;
  startId: number = -1;
  @Input() board: number[] = new Array(64).fill(0);
  validMoves: number[] = new Array(64).fill(0);

  private fenStart = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
  private fen2 = 'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2 '
  private pieceFromSymbol = new Map([
    ['k',Piece.King],
    ['p',Piece.Pawn],
    ['n',Piece.Knight],
    ['b',Piece.Bishop],
    ['r',Piece.Rook],
    ['q',Piece.Queen],
  ])

  ngOnInit(): void {
    function isCharNumber(c: string) {
      return c >= '0' && c <= '9';
    }
    let rank = 7;
    let file = 0;
    for(let i = 0; i < this.fen2.length; i++){
      let c = this.fen2.charAt(i);
      if(c == ' ') break;
      if(c == '/'){
        file = 0;
        rank--;
      } else {
        if(isCharNumber(c)){
          file += Number.parseInt(c);
        } else {
          let color = (c === c.toUpperCase()) ? Piece.Black : Piece.White;
          let piece = this.pieceFromSymbol.get(c.toLowerCase())!;
          this.board[rank * 8 + file] = color * piece;
          file++;
        }
      }
    }
  }

  onMouseDown(id: number, event: MouseEvent) {
    if(this.board[id] != 0){
      this.dragging = true;
      this.startId = id;
      this.setValidMoves(id);
    }
  }

  onMouseUp(id: number) {
    if(this.startId != -1 && this.startId != id){
      this.board[id] = this.board[this.startId];
      this.board[this.startId] = 0;
    }
    this.startId = -1;
    this.dragging = false;
    this.validMoves = new Array(64).fill(0);
  }

  private setValidMoves(id: number){
    this.validMoves[id-7] = 1;
    this.validMoves[id-8] = 1;
    this.validMoves[id-9] = 1;
    this.validMoves[id-1] = 1;
    this.validMoves[id+1] = 1;
    this.validMoves[id+7] = 1;
    this.validMoves[id+8] = 1;
    this.validMoves[id+9] = 1;
  }
}
