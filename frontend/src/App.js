import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import AddExpense from "./components/AddExpense";
import ExpenseList from "./components/ExpenseList";
import ExpenseChart from "./components/ExpenseChart";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { AuthProvider } from "./context/AuthContext"; // Import correctly
import AuthContext from "./context/AuthContext"; // Import context

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

function MainApp() {
  const { user, logout } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);

  // Fetch expenses when user logs in
  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/expenses/");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleExpenseAdded = (newExpense) => {
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
  };

  const handleExpenseDeleted = (deletedId) => {
    setExpenses(prevExpenses => 
      prevExpenses.filter(expense => expense._id !== deletedId)
    );
  };

  const handleExpenseUpdated = (updatedExpense) => {
    setExpenses(prevExpenses => 
      prevExpenses.map(expense => 
        expense._id === updatedExpense._id ? updatedExpense : expense
      )
    );
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1>💰 Expense Tracker</h1>
        {user && <button onClick={logout} className="logout-btn">Logout</button>}
      </nav>
      <main className="content">
        {!user ? (
          <>
            <Signup />
            <Login />
          </>
        ) : (
          <>
            <p>Welcome, {user.email}!</p>
            <AddExpense onExpenseAdded={handleExpenseAdded} />
            <ExpenseList 
              expenses={expenses}
              onExpenseDeleted={handleExpenseDeleted}
              onExpenseUpdated={handleExpenseUpdated}
            />
            <ExpenseChart expenses={expenses} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
