import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const {
  VITE_ROLL_DIE_BASE_URL = "http://localhost:8000/roll-die"
} = import.meta.env;

console.log(import.meta.env);

async function rollDie() {
  const response = await fetch(VITE_ROLL_DIE_BASE_URL, {
    headers: {
      "Content-Type": "application/json",
    }
  });

  return (await response.json()).die;
}

function App() {
  const [dice, setDice] = useState([1, 1]);

  async function handleRollClick() {
    const newDice = await Promise.all(dice.map(rollDie));
    setDice(newDice);
  }

  return (
    <main>
      <button onClick={handleRollClick}>Roll</button>

      <div>
        {dice.map((die, index) => (
          <img key={index} src={`https://www.calculator.net/img/dice${die}.png`}></img>
        ))}
      </div>

      <small>{VITE_ROLL_DIE_BASE_URL}</small>
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
