document.addEventListener("DOMContentLoaded", function () {
    const salaryByMonth = window.salaryByMonth || [];
    const dividendsByMonth = window.dividendsByMonth || [];
    const departmentDistribution = window.departmentDistribution || [];
  
    // Chart 1: Lương theo thời gian
    new Chart(document.getElementById('salaryLineChart'), {
      type: 'line',
      data: {
        labels: salaryByMonth.map(item => item.month),
        datasets: [{
          label: 'Tổng lương',
          data: salaryByMonth.map(item => parseFloat(item.total)),
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          fill: true
        }]
      }
    });
  
    // Chart 2: Cổ tức theo tháng
    new Chart(document.getElementById('dividendBarChart'), {
      type: 'bar',
      data: {
        labels: dividendsByMonth.map(item => item.month),
        datasets: [{
          label: 'Tổng cổ tức',
          data: dividendsByMonth.map(item => parseFloat(item.total)),
          backgroundColor: 'orange'
        }]
      }
    });
  
    // Chart 3: Phân bố nhân sự theo phòng ban
    new Chart(document.getElementById('employeePieChart'), {
      type: 'pie',
      data: {
        labels: departmentDistribution.map(item => item.DepartmentName),
        datasets: [{
          label: 'Nhân viên',
          data: departmentDistribution.map(item => item.total),
          backgroundColor: ['red', 'green', 'blue', 'purple', 'orange', 'cyan']
        }]
      }
    });
  });
  