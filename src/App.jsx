import React from "react";
import { ExpenseProvider } from "./context/ExpenseProvider";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import "./index.css";

function App() {
  return (
    <ExpenseProvider>
      <div className="app">
        <Header />
        <div className="main-container">
          <Sidebar />
          <main className="main">
            <div className="container">
              <h2>Welcome to your personal expense tracker!</h2>
              <p>
                This app will help you track spending, manage budgets, and gain
                insights into your financial habits.
              </p>
              <div className="features">
                <div className="feature">
                  <h3>📊 Track Expenses</h3>
                  <p>Add and categorize your expenses with ease</p>
                </div>
                <div className="feature">
                  <h3>💰 Budget Management</h3>
                  <p>Set monthly budgets and track your spending</p>
                </div>
                <div className="feature">
                  <h3>📈 Analytics</h3>
                  <p>Get insights into your spending patterns</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ExpenseProvider>
  );
}

export default App;
