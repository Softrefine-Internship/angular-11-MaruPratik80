import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';

@Component({
  selector: 'app-add-subordinate-dialog',
  templateUrl: './add-subordinate-dialog.component.html',
  styleUrls: ['./add-subordinate-dialog.component.scss'],
})
export class AddSubordinateDialogComponent implements OnInit {
  employeeForm!: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<AddSubordinateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: Employee | undefined
  ) {}

  ngOnInit(): void {
    this.employeeForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      imageUrl: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      designation: new FormControl('', [Validators.required]),
    });
  }

  onSave() {
    if (this.employeeForm.invalid) return;
    const id = this.employeeService.addSubordinate(this.employeeForm.value, this.dialogData);
    this.dialogRef.close(id);
  }
}
