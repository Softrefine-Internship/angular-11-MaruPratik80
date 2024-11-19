import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Employee, EmployeeDetails } from './employee.model';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private API_URL = 'https://organization-tree3-default-rtdb.asia-southeast1.firebasedatabase.app/';

  employees: Employee[] = [];

  constructor(private http: HttpClient) {}

  addSubordinate(employeeDetails: EmployeeDetails, manager: Employee | undefined): number | void {
    const newEmployee: Employee = {
      id: (this.employees?.length || 0) + 1,
      managerId: manager ? manager.id : null,
      subordinates: null,
      active: false,
      firebaseKey: '',
      ...employeeDetails,
    };

    this.http.post<Employee>(this.API_URL + 'employee-data.json', newEmployee).subscribe(res => {
      newEmployee.firebaseKey = res.name;
      this.employees.push(newEmployee);
    });

    if (!manager) return newEmployee.id;

    if (manager.subordinates) manager.subordinates.push(newEmployee.id);
    else manager.subordinates = [newEmployee.id];

    this.updateSubordinates(manager.firebaseKey, manager.subordinates);
  }

  removeEmployee(employee: Employee): boolean {
    this.employees.splice(this.employees.indexOf(employee), 1);
    this.http.delete(`${this.API_URL}employee-data/${employee.firebaseKey}.json`).subscribe();
    if (!employee.managerId) return true;

    const manager = this.employees.find(e => e.id === employee.managerId)!;

    if (manager.subordinates?.length === 1) {
      manager.subordinates = null;
      manager.active = false;
    } else {
      const index = manager.subordinates?.indexOf(employee.id)!;
      manager.subordinates?.splice(index, 1);
    }

    this.updateSubordinates(manager.firebaseKey, manager.subordinates);
    return !manager.subordinates;
  }

  changeManager(manager: Employee, id: number) {
    const employee = this.employees.find(e => e.id === id)!;

    const [managerDetails, employeeDetails]: EmployeeDetails[] = [manager, employee].map(e => ({
      name: e.name,
      designation: e.designation,
      imageUrl: e.imageUrl,
      email: e.email,
    }));

    forkJoin([
      this.updateEmployeeDetails(manager.firebaseKey, employeeDetails),
      this.updateEmployeeDetails(employee.firebaseKey, managerDetails),
    ]).subscribe(([managerRes, employeeRes]) => {
      Object.assign(manager, managerRes);
      Object.assign(employee, employeeRes);
    });
  }

  fetchEmployees() {
    return this.http.get<Employee[]>(this.API_URL + 'employee-data.json').pipe(
      tap(response => {
        if (!response) return;
        this.employees = Object.entries(response).map(res => {
          const [key, employee] = res;
          return {
            ...employee,
            firebaseKey: key,
          };
        });
      })
    );
  }

  private updateSubordinates(firebaseKey: string, subordinates: number[] | null) {
    this.http.patch(`${this.API_URL}employee-data/${firebaseKey}.json`, { subordinates }).subscribe();
  }

  private updateEmployeeDetails(firebaseKey: string, details: EmployeeDetails): Observable<EmployeeDetails> {
    return this.http.patch<EmployeeDetails>(`${this.API_URL}employee-data/${firebaseKey}.json`, details);
  }
}
