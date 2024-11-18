import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './remove-dialog.component.html',
  styleUrls: ['./remove-dialog.component.scss'],
})
export class RemoveDialogComponent {
  constructor(
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<RemoveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: Employee
  ) {}

  onRemove() {
    const removeLevel = this.employeeService.removeEmployee(this.dialogData);
    this.dialogRef.close(removeLevel);
  }
}
