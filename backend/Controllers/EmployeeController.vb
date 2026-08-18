Imports Microsoft.AspNetCore.Mvc
Imports HRMS_Backend.Models

Namespace Controllers
    <ApiController>
    <Route("api/[controller]")>
    Public Class EmployeeController
        Inherits ControllerBase

        ' In-memory data store for demonstration purposes
        Private Shared ReadOnly Employees As New List(Of Employee) From {
            New Employee With {.Id = 1, .FirstName = "John", .LastName = "Doe", .Email = "john.doe@company.com", .Department = "Engineering", .Designation = "Software Engineer", .DateOfJoining = New DateTime(2022, 1, 15), .Status = "Active", .Salary = 85000},
            New Employee With {.Id = 2, .FirstName = "Jane", .LastName = "Smith", .Email = "jane.smith@company.com", .Department = "HR", .Designation = "HR Manager", .DateOfJoining = New DateTime(2021, 3, 10), .Status = "Active", .Salary = 75000},
            New Employee With {.Id = 3, .FirstName = "Mike", .LastName = "Johnson", .Email = "mike.j@company.com", .Department = "Sales", .Designation = "Sales Executive", .DateOfJoining = New DateTime(2023, 6, 1), .Status = "On Leave", .Salary = 60000}
        }

        <HttpGet>
        Public Function GetAllEmployees() As IActionResult
            Return Ok(Employees)
        End Function

        <HttpGet("{id}")>
        Public Function GetEmployeeById(id As Integer) As IActionResult
            Dim emp = Employees.FirstOrDefault(Function(e) e.Id = id)
            If emp Is Nothing Then
                Return NotFound()
            End If
            Return Ok(emp)
        End Function

        <HttpPost>
        Public Function AddEmployee(<FromBody> emp As Employee) As IActionResult
            emp.Id = Employees.Max(Function(e) e.Id) + 1
            Employees.Add(emp)
            Return CreatedAtAction(NameOf(GetEmployeeById), New With {.id = emp.Id}, emp)
        End Function

    End Class
End Namespace
