import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';

interface Option {
  id: number;
  str: string;
}

@Component({
  selector: 'app-change-manager-dialog',
  templateUrl: './change-manager-dialog.component.html',
  styleUrls: ['./change-manager-dialog.component.scss'],
})
export class ChangeManagerDialogComponent implements OnInit {
  manager = new FormControl<string | Option>('', Validators.required);
  options!: Option[];
  filteredOptions!: Observable<Option[]>;

  constructor(
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<ChangeManagerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: Employee
  ) {}

  ngOnInit(): void {
    this.options = this.employeeService.employees
      .filter(e => !!e.managerId)
      .map(e => ({ id: e.id, str: `${e.name} (${e.email})` }));
    this.filteredOptions = this.manager.valueChanges.pipe(
      startWith(''),
      map(value => {
        const str = typeof value === 'string' ? value : value?.str;
        return str ? this._filter(str as string) : this.options.slice();
      })
    );
  }

  onSave() {
    if (!this.manager.value) return;
    this.employeeService.changeManager(this.dialogData, (this.manager.value as Option).id);
    this.dialogRef.close();
  }

  displayFn(option: Option): string {
    return option && option.str ? option.str : '';
  }

  private _filter(value: string): Option[] {
    return this.options.filter(option => option.str.toLowerCase().includes(value.toLowerCase()));
  }
}
