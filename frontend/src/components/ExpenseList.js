import React, { useState } from "react";
import axios from "axios";

const ExpenseList = ({ expenses, onExpenseDeleted, onExpenseUpdated }) => {
  const [editingExpense, setEditingExpense] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedAmount, setUpdatedAmount] = useState("");
  const [updatedCategory, setUpdatedCategory] = useState("");

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      if (onExpenseDeleted) {
        onExpenseDeleted(id);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense._id);
    setUpdatedTitle(expense.title);
    setUpdatedAmount(expense.amount);
    setUpdatedCategory(expense.category);
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/expenses/${id}`, {
        title: updatedTitle,
        amount: updatedAmount,
        category: updatedCategory,
      });
      setEditingExpense(null);
      if (onExpenseUpdated) {
        onExpenseUpdated(response.data);
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  return (
    <div className="expense-list">
      <h2>Expense List</h2>
      {expenses.length === 0 ? (
        <p>No expenses added yet.</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense._id}>
              {editingExpense === expense._id ? (
                <>
                  <input type="text" value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} />
                  <input type="number" value={updatedAmount} onChange={(e) => setUpdatedAmount(e.target.value)} />
                  <input type="text" value={updatedCategory} onChange={(e) => setUpdatedCategory(e.target.value)} />
                  <button onClick={() => handleUpdate(expense._id)}>Save</button>
                  <button onClick={() => setEditingExpense(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <strong>{expense.title}</strong> - ₹{expense.amount} ({expense.category})
                  <button onClick={() => handleEdit(expense)}>Edit</button>
                  <button onClick={() => handleDelete(expense._id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;
