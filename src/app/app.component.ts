import { Component, OnDestroy, OnInit } from '@angular/core';
import { Employee } from './employee.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { RemoveDialogComponent } from './remove-dialog/remove-dialog.component';
import { EmployeeService } from './employee.service';
import { Subscription } from 'rxjs';

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
      transition('* => void', [animate(150, style({ opacity: 0, scale: '0 1' }))]),
    ]),
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  levels: number[][] = [];
  employees!: Employee[];
  subscription!: Subscription;

  constructor(private employeeService: EmployeeService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.subscription = this.employeeService.emploeeChanged.subscribe(employees => {
      this.employees = employees;
    });
    this.employees = this.employeeService.employees;
    this.start();
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

  start() {
    const manager = this.employees.find(e => e.managerId === null)!;
    this.levels.push([manager.id]);
  }

  getSubordinates(ids: number[]) {
    return this.employees.filter(e => ids.includes(e.id));
  }

  openRemoveDialog(employee: Employee) {
    const dialogRef = this.dialog.open(RemoveDialogComponent, { data: employee });
    dialogRef.afterClosed().subscribe((removed: Employee) => {
      if (!removed) return;
      console.log(this.employees, this.levels);
      const manager = this.employees.find(e => e.id === employee.managerId);
      console.log(manager);
      console.log(this.levels[this.levels.length - 1]);
      if (this.levels[this.levels.length - 1].length === 1) {
        this.levels.pop();
        if (manager) {
          manager.active = false;
          return;
        }
      } else {
        this.levels[this.levels.length - 1] = manager?.subordinates as number[];
      }
      console.log(this.employees, this.levels);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
