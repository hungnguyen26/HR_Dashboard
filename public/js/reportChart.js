document.addEventListener("DOMContentLoaded", function () {
  const salaryCanvas = document.getElementById("salaryLineChart");
  const employeeCanvas = document.getElementById("employeePieChart");

  const salaryByMonth = JSON.parse(
    salaryCanvas.dataset.salary.replace(/&apos;/g, "'")
  );
  const departmentDistribution = JSON.parse(
    employeeCanvas.dataset.departments.replace(/&apos;/g, "'")
  );

  if (salaryByMonth?.length) {
    new Chart(salaryCanvas, {
      type: "line",
      data: {
        labels: salaryByMonth.map((item) => item.month),
        datasets: [
          {
            label: "Tổng lương",
            data: salaryByMonth.map((item) => parseFloat(item.total)),
            borderColor: "blue",
            backgroundColor: "rgba(0, 0, 255, 0.1)",
            fill: true,
          },
        ],
      },
    });
  }

  if (departmentDistribution?.length) {
    new Chart(employeeCanvas, {
      type: "pie",
      data: {
        labels: departmentDistribution.map((item) => item.DepartmentName),
        datasets: [
          {
            label: "Nhân viên",
            data: departmentDistribution.map((item) => parseInt(item.total)),
            backgroundColor: [
              "#f87171",
              "#34d399",
              "#60a5fa",
              "#fbbf24",
              "#a78bfa",
              "#f472b6",
            ],
          },
        ],
      },
    });
  }
});
