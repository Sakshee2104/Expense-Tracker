import React, { useState } from "react";
import axios from "axios";

const AddExpense = ({ onExpenseAdded }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !category) return alert("All fields are required!");

    try {
      const response = await axios.post("http://localhost:5000/api/expenses/add", {
        title,
        amount,
        category,
      });
      onExpenseAdded(response.data); // Refresh Expense List
      setTitle("");
      setAmount("");
      setCategory("");
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div className="expense-form">
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Expense Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;
