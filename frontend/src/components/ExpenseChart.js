import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#FF5733", "#33FF57", "#3357FF", "#F4C724", "#C70039"];

const ExpenseChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/expenses/");
      const expenses = response.data;

      // Group expenses by category
      const categoryTotals = {};
      expenses.forEach((expense) => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
      });

      // Convert to chart format
      const chartData = Object.keys(categoryTotals).map((category, index) => ({
        name: category,
        value: categoryTotals[category],
        color: COLORS[index % COLORS.length], // Assign colors dynamically
      }));

      setData(chartData);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  return (
    <div className="expense-chart">
      <h2>Expense Distribution</h2>
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default ExpenseChart;
