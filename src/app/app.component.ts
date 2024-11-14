import { Component } from '@angular/core';
import { Employee } from './employee.model';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  levels: (number | null)[] = [null];

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

  showSubordinates(employee: Employee) {
    employee.active = !employee.active;
    const colleges = this.employees.find(
      (e) => e.id === employee.managerId
    )?.subordinates;
    if (employee.active) this.levels.push(employee.id);
    else {
      const index = this.levels.indexOf(employee.id);
      if (index !== -1) this.levels.splice(index);
    }
  }

  getSubordinates(managerId: number) {
    const subordinates =
      this.employees.filter((e) => e.managerId === managerId) ||
      this.employees[0];
    return subordinates;
  }
}
