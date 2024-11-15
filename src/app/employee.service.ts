import { Injectable } from '@angular/core';
import { Employee } from './employee.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  employees: Employee[] = [
    {
      id: 1,
      name: 'John Doe',
      managerId: null,
      imageUrl: 'https://via.placeholder.com/150',
      email: 'john.doe@example.com',
      subordinates: [2, 3],
      designation: 'CEO',
      active: false,
    },
    {
      id: 2,
      name: 'Jane Smith',
      managerId: 1,
      imageUrl: 'https://via.placeholder.com/150',
      email: 'jane.smith@example.com',
      subordinates: [4, 5],
      designation: 'CTO',
      active: false,
    },
    {
      id: 3,
      name: 'Bob Johnson',
      managerId: 1,
      imageUrl: 'https://via.placeholder.com/150',
      email: 'bob.johnson@example.com',
      subordinates: [6],
      designation: 'CFO',
      active: false,
    },
    {
      id: 4,
      name: 'Alice Brown',
      managerId: 2,
      imageUrl: 'https://via.placeholder.com/150',
      email: 'alice.brown@example.com',
      subordinates: [8, 9],
      designation: 'Engineering Manager',
      active: false,
    },
    {
      id: 5,
      name: 'Charlie White',
      managerId: 2,
      imageUrl: 'https://via.placeholder.com/150',
      email: 'charlie.white@example.com',
      subordinates: [10, 11],
      designation: 'Product Manager',
      active: false,
    },
    {
      id: 6,
      name: 'David Black',
      managerId: 3,
      imageUrl: 'https://via.placeholder.com/150',
      email: 'david.black@example.com',
      subordinates: [7],
      designation: 'Finance Manager',
      active: false,
    },
    {
      id: 7,
      name: 'Eva Green',
      managerId: 6,
      imageUrl: 'https://via.placeholder.com/150',
      email: 'eva.green@example.com',
      subordinates: null,
      designation: 'Accountant',
      active: false,
    },
  ];
  emploeeChanged = new Subject<Employee[]>();

  removeEmployee(employee: Employee) {
    const managerIndex = this.employees.findIndex(e => e.id === employee.managerId);

    const manager = this.employees[managerIndex];

    if (manager.subordinates)
      manager.subordinates =
        manager.subordinates?.length !== 1 ? manager.subordinates?.filter(id => id !== employee.id) : null;

    this.employees.splice(this.employees.indexOf(employee), 1);
    this.emploeeChanged.next(this.employees);
  }
}
