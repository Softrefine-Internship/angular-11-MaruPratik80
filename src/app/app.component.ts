import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';

import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';
import { AddSubordinateDialogComponent } from './add-subordinate-dialog/add-subordinate-dialog.component';
import { RemoveDialogComponent } from './remove-dialog/remove-dialog.component';
import { ChangeManagerDialogComponent } from './change-manager-dialog/change-manager-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('opacity', [transition('* => void', [animate(150, style({ opacity: 0 }))])]),
    trigger('vertical', [
      transition('void => *', [style({ opacity: 0, scale: '1 0.2' }), animate(250)]),
      transition('* => void', [animate(100, style({ opacity: 0, scale: '1 0.2' }))]),
    ]),
    trigger('horizontal', [
      transition('void => *', [style({ opacity: 0, scale: '0 1' }), animate(250)]),
      transition('* => void', [animate(100, style({ opacity: 0, scale: '0 1' }))]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  levels: number[][] = [];
  employees!: Employee[];

  constructor(private employeeService: EmployeeService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.employeeService.fetchEmployees().subscribe(() => {
      this.employees = this.employeeService.employees;
    });
  }

  onStart() {
    const manager = this.employees.find(e => !e.managerId);
    if (manager) {
      this.levels.push([manager.id]);
      return;
    }
    const dialogRef = this.dialog.open(AddSubordinateDialogComponent);
    dialogRef.afterClosed().subscribe(id => this.levels.push([id]));
  }

  getSubordinates(ids: number[]) {
    return this.employees.filter(e => ids.includes(e.id));
  }

  showSubordinates(employee: Employee) {
    if (!employee.subordinates) return;
    employee.active = !employee.active;

    const index = this.levels.findIndex(level => level.includes(employee.id));
    const inactiveIds = this.levels
      .slice(index)
      .flat()
      .filter(id => id !== employee.id);
    this.employees.forEach(e => {
      if (inactiveIds.includes(e.id)) e.active = false;
    });
    this.levels.splice(index + 1);

    if (employee.active && employee.subordinates) this.levels.push(employee.subordinates);
  }

  openAddSubordinateDialog(manager: Employee, event: MouseEvent) {
    event.stopPropagation();
    if (manager.subordinates?.length === 5) return;
    this.dialog.open(AddSubordinateDialogComponent, { data: manager });
  }

  openRemoveDialog(employee: Employee, event: MouseEvent) {
    event.stopPropagation();
    if (employee.subordinates) return;

    const dialogRef = this.dialog.open(RemoveDialogComponent, {
      data: employee,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(removeLevel => {
      if (removeLevel) this.levels.pop();
    });
  }

  openChangeManagerDialog(manager: Employee, event: MouseEvent) {
    event.stopPropagation();
    this.dialog.open(ChangeManagerDialogComponent, {
      data: manager,
      width: '50vw',
      minWidth: '32rem',
      exitAnimationDuration: 250,
    });
  }
}
