import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Employee, EmployeeFormData } from './employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  // employees: Employee[] = [
  //   {
  //     id: 1,
  //     name: 'John Doe',
  //     managerId: null,
  //     imageUrl: 'https://via.placeholder.com/150',
  //     email: 'john.doe@example.com',
  //     subordinates: [2, 3],
  //     designation: 'CEO',
  //     active: false,
  //   },
  //   {
  //     id: 2,
  //     name: 'Jane Smith',
  //     managerId: 1,
  //     imageUrl: 'https://via.placeholder.com/150',
  //     email: 'jane.smith@example.com',
  //     subordinates: [4, 5],
  //     designation: 'CTO',
  //     active: false,
  //   },
  //   {
  //     id: 3,
  //     name: 'Bob Johnson',
  //     managerId: 1,
  //     imageUrl: 'https://via.placeholder.com/150',
  //     email: 'bob.johnson@example.com',
  //     subordinates: [6],
  //     designation: 'CFO',
  //     active: false,
  //   },
  //   {
  //     id: 4,
  //     name: 'Alice Brown',
  //     managerId: 2,
  //     imageUrl: 'https://via.placeholder.com/150',
  //     email: 'alice.brown@example.com',
  //     subordinates: [8, 9],
  //     designation: 'Engineering Manager',
  //     active: false,
  //   },
  //   {
  //     id: 5,
  //     name: 'Charlie White',
  //     managerId: 2,
  //     imageUrl: 'https://via.placeholder.com/150',
  //     email: 'charlie.white@example.com',
  //     subordinates: [10, 11],
  //     designation: 'Product Manager',
  //     active: false,
  //   },
  //   {
  //     id: 6,
  //     name: 'David Black',
  //     managerId: 3,
  //     imageUrl: 'https://via.placeholder.com/150',
  //     email: 'david.black@example.com',
  //     subordinates: [7],
  //     designation: 'Finance Manager',
  //     active: false,
  //   },
  //   {
  //     id: 7,
  //     name: 'Eva Green',
  //     managerId: 6,
  //     imageUrl: 'https://via.placeholder.com/150',
  //     email: 'eva.green@example.com',
  //     subordinates: null,
  //     designation: 'Accountant',
  //     active: false,
  //   },
  //   {
  //     id: 8,
  //     name: 'Eva Green',
  //     managerId: 4,
  //     imageUrl: 'https://via.placeholder.com/150',
  //     email: 'eva.green@example.com',
  //     subordinates: null,
  //     designation: 'Accountant',
  //     active: false,
  //   },
  //   {
  //     id: 9,
  //     name: 'Eva Green',
  //     managerId: 4,
  //     imageUrl: 'https://via.placeholder.com/150',
  //     email: 'eva.green@example.com',
  //     subordinates: null,
  //     designation: 'Accountant',
  //     active: false,
  //   },
  //   {
  //     id: 10,
  //     name: 'Eva Green',
  //     managerId: 5,
  //     imageUrl: 'https://via.placeholder.com/150',
  //     email: 'eva.green@example.com',
  //     subordinates: null,
  //     designation: 'Accountant',
  //     active: false,
  //   },
  //   {
  //     id: 11,
  //     name: 'Eva Green',
  //     managerId: 5,
  //     imageUrl: 'https://via.placeholder.com/150',
  //     email: 'eva.green@example.com',
  //     subordinates: null,
  //     designation: 'Accountant',
  //     active: false,
  //   },
  // ];

  private API_URL = 'https://organization-tree3-default-rtdb.asia-southeast1.firebasedatabase.app/';

  employees!: Employee[];

  constructor(private http: HttpClient) {}

  addSubordinate(employeeDetails: EmployeeFormData, manager: Employee | undefined): number {
    const employee: Employee = {
      id: (this.employees?.length || 0) + 1,
      managerId: manager ? manager.id : null,
      subordinates: null,
      active: false,
      ...employeeDetails,
    };

    if (manager) {
      if (manager.subordinates) manager.subordinates.push(employee.id);
      else manager.subordinates = [employee.id];
      this.updateEmployee(manager);
    }
    this.employees.push(employee);

    this.postEmployee(employee);
    return employee.id;
  }

  removeEmployee(employee: Employee): boolean {
    this.employees.splice(this.employees.indexOf(employee), 1);
    this.http.delete(`${this.API_URL}employee-data/${employee.firebaseKey}.json`).subscribe();

    const manager = this.employees.find(e => e.id === employee.managerId);
    if (!manager || !manager.subordinates) return true;

    if (manager.subordinates.length !== 1) {
      const index = manager.subordinates.indexOf(employee.id);
      manager.subordinates.splice(index, 1);
      this.updateEmployee(manager);
      return false;
    } else {
      manager.subordinates = null;
      manager.active = false;
      this.updateEmployee(manager);
      return true;
    }
  }

  changeManager(manager: Employee, id: number) {
    const employee = this.employees.find(e => e.id === id)!;

    [manager.name, employee.name] = [employee.name, manager.name];
    [manager.designation, employee.designation] = [employee.designation, manager.designation];
    [manager.imageUrl, employee.imageUrl] = [employee.imageUrl, manager.imageUrl];
    [manager.email, employee.email] = [employee.email, manager.email];
  }

  fetchEmployees() {
    return this.http.get<Employee[]>(this.API_URL + 'employee-data.json').pipe(
      map(response => {
        if (!response) return [];
        const employees = Object.entries(response).map(res => {
          const [key, employee] = res;
          return {
            ...employee,
            active: false,
            firebaseKey: key,
          };
        });
        return employees;
      }),
      tap(employees => {
        this.employees = employees;
      })
    );
  }

  postEmployee(employee: Employee) {
    this.http.post<Employee>(this.API_URL + 'employee-data.json', employee).subscribe(res => {
      console.log(res);
    });
  }

  updateEmployee(employee: Employee) {
    this.http.put(`${this.API_URL}employee-data/${employee.firebaseKey}.json`, employee).subscribe(res => {
      console.log(res);
    });
  }
}
