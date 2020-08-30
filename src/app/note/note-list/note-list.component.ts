import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NoteFilter } from '../note-filter';
import { NoteService } from '../note.service';
import { Note } from '../note';
import { SortableHeaderDirective, SortEvent } from './sortable.directive';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-note',
  templateUrl: 'note-list.component.html'
})
export class NoteListComponent implements OnInit {
  total$: Observable<number>;

  @ViewChildren(SortableHeaderDirective) headers: QueryList<SortableHeaderDirective>;

  filter = new NoteFilter();
  selectedNote: Note;
  feedback: any = {};

  get noteList(): Note[] {
    return this.noteService.noteList;
  }

  constructor(private noteService: NoteService) {
  }

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.noteService.load(this.filter);
    this.total$ = this.noteService.size$;
  }

  select(selected: Note): void {
    this.selectedNote = selected;
  }

  onSort({column, direction}: SortEvent): void {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.filter.column = column;
    this.filter.direction = direction;
    this.filter.page = 0;

    this.search();
  }

  onChange(pageSize: number): void {
    this.filter.size = pageSize;
    this.filter.page = 0;
    this.search();
  }

  onPageChange(page: number): void {
    this.filter.page = page - 1;
    this.search();
    this.filter.page = page;
  }

  delete(note: Note): void {
    if (confirm('Are you sure?')) {
      this.noteService.delete(note).subscribe(() => {
          this.feedback = {type: 'success', message: 'Delete was successful!'};
          setTimeout(() => {
            this.search();
          }, 1000);
        },
        err => {
          this.feedback = {type: 'warning', message: 'Error deleting.'};
        }
      );
    }
  }
}
