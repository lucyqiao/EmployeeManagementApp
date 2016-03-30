angular.module('myApp', ['ngRoute'])
//routing config
.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl : 'templates/employee_list.html',
                controller : 'EmployeeListCtrl'
            })
            .when('/new_employee', {
                templateUrl :'templates/newEmpolyee.html',
                controller : 'NewEmployeeCtrl'
            })
            .when('/:id', {
                templateUrl : 'templates/employeeDetail.html',
                controller : 'EmployeeDetailCtrl'
            })
            .when('/:id/reports', {
                templateUrl : 'templates/dirReports.html',
                controller : 'DirReportsCtrl'
            })
            .when('/:id/edit', {
                templateUrl : 'templates/editEmployee.html',
                controller : 'EditEmployeeCtrl'
            })
            .otherwise({
                redirectTo :  '/'
            });
    }])
//employee data factory
.factory('employeeFactory', ['$http',function($http) {
    return {
        getEmployees : function() {
            return $http.get('/employees');
        },
        addEmployee : function(data) {
            return $http.post('/employees',data);
        },
        getDirectReports : function(id) {
            return $http.get('/employees/' + id.toString() + '/reports');
        },
        getOneEmployee : function(id) {
            return $http.get('/employees/' + id.toString());
        },
        updateEmployee : function(employee) {
            return $http.put('/employees/' + employee._id.toString(), employee);
        }
    };
}])

//edit employee page
.controller('EditEmployeeCtrl', function($scope, $routeParams, Upload, $timeout, $location, employeeFactory) {
    employeeFactory.getOneEmployee($routeParams.id)
        .then(function(res) {
            $scope.employee = res.data;
        });
    employeeFactory.getEmployees()
        .then(function(res){
            $scope.employees = res.data;
        });
    $scope.updateEmployee = function() {
        employeeFactory.updateEmployee($scope.employee)
            .then(function(res) {
                console.log("Updated"+ res);
                $location.path("/");
            }, function(err) {
                console.log(err);
            });
    };
})

//employee direct reports page
.controller('DirReportsCtrl', function($scope, $routeParams, employeeFactory) {
    $scope.employees = [];
    employeeFactory.getDirectReports($routeParams.id)
        .then(function(res) {
            $scope.employees = res.data;
            if ($scope.employees.length == 0)
                {$scope.message = "Oops, this employee doesn't have any direct reports!";}
        });
})

//employee detail page
.controller('EmployeeDetailCtrl', function($scope, $location, $routeParams, employeeFactory) {
    $scope.employee = {};
    //get employee's detail
    employeeFactory.getOneEmployee($routeParams.id)
        .then(function(res) {
            $scope.employee = res.data;
        });
    $scope.editProfile = function() {
        $location.path("/" + $scope.employee._id + "/edit");
    };

})
//new employee controller
.controller('NewEmployeeCtrl', function($scope, $location, employeeFactory) {
    $scope.addEmployee = function() {
        var employee = {
            name : $scope.name,
            title : $scope.title,
            sex   : $scope.sex,
            startDate : $scope.startDate,
            officePhone : $scope.officePhone,
            cellPhone : $scope.cellPhone,
            email : $scope.email,
            manager : $scope.manager
        };
        employeeFactory.addEmployee(employee)
            .then(function(res) {
                $location.path("/");
                console.log(res);
            }, function(err) {
                $location.path("/");
                console.log(err);
            });

    }
})
//employee list controller
.controller('EmployeeListCtrl', function($scope,$location,employeeFactory) {
    employeeFactory.getEmployees()
        .then(function(res) {
            $scope.employees = res.data;
        });

    $scope.viewDetail = function(employee) {
        $location.path("/" + employee._id);
    };
    //list sorting
    $scope.orderByMe = function(me) {
        $scope.myOrderBy = me;
    };

});
