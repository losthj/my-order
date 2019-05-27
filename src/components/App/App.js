import React from 'react';
// import logo from '../../logo.svg';
import './App.css';
import Header from '../Header/index'
// import OrderItem from  '../OrderItem/index'
import OrderList from  '../OrderList/index'

function App() {
  return (
    <div className="App">
       <Header />
       <OrderList />
    </div>
  );
}

export default App;
