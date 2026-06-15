'use client';

import { useState } from 'react';

export default function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [previous, setPrevious] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const calculate = (a, b, op) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (isNaN(numA) || isNaN(numB)) return b;
    switch (op) {
      case '+': return (numA + numB).toString();
      case '-': return (numA - numB).toString();
      case 'x': return (numA * numB).toString();
      case '÷': return numB === 0 ? 'Error' : (numA / numB).toString();
      default: return b;
    }
  };

  const handleNum = (num) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOp = (op) => {
    if (operator && !waitingForNewValue) {
      const result = calculate(previous, display, operator);
      setDisplay(result);
      setPrevious(result);
    } else {
      setPrevious(display);
    }
    setOperator(op);
    setWaitingForNewValue(true);
  };

  const handleEqual = () => {
    if (!operator || !previous) return;
    const result = calculate(previous, display, operator);
    setDisplay(result);
    setPrevious(null);
    setOperator(null);
    setWaitingForNewValue(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevious(null);
    setOperator(null);
    setWaitingForNewValue(false);
  };

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const Button = ({ children, onClick, variant = 'default', className = '' }) => {
    const baseStyle = "font-heading text-xl md:text-2xl font-bold flex items-center justify-center border-[3px] border-base-content shadow-[4px_4px_0px_var(--color-base-content)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_var(--color-base-content)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all";
    
    let colorStyle = "bg-base-200 text-base-content";
    if (variant === 'primary') colorStyle = "bg-primary text-primary-content";
    if (variant === 'secondary') colorStyle = "bg-secondary text-secondary-content";
    if (variant === 'accent') colorStyle = "bg-accent text-accent-content";

    return (
      <button onClick={onClick} className={`${baseStyle} ${colorStyle} ${className}`}>
        {children}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full bg-base-100 p-4 gap-4 overflow-hidden">
      {/* Screen */}
      <div className="w-full h-24 bg-neutral border-4 border-base-content rounded-xl shadow-[inset_4px_4px_0px_rgba(0,0,0,0.5)] flex flex-col items-end justify-end p-4 relative overflow-hidden">
        <div className="absolute top-2 left-3 text-neutral-content/50 font-heading text-sm">
          {previous && operator ? `${previous} ${operator}` : ''}
        </div>
        <div className="font-heading text-4xl text-neutral-content truncate max-w-full tracking-widest">
          {display}
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-3 flex-1 pb-2">
        <Button onClick={handleClear} variant="secondary" className="col-span-2">C</Button>
        <Button onClick={() => handleOp('÷')} variant="primary">÷</Button>
        <Button onClick={() => handleOp('x')} variant="primary">x</Button>

        <Button onClick={() => handleNum('7')}>7</Button>
        <Button onClick={() => handleNum('8')}>8</Button>
        <Button onClick={() => handleNum('9')}>9</Button>
        <Button onClick={() => handleOp('-')} variant="primary">-</Button>

        <Button onClick={() => handleNum('4')}>4</Button>
        <Button onClick={() => handleNum('5')}>5</Button>
        <Button onClick={() => handleNum('6')}>6</Button>
        <Button onClick={() => handleOp('+')} variant="primary">+</Button>

        <Button onClick={() => handleNum('1')}>1</Button>
        <Button onClick={() => handleNum('2')}>2</Button>
        <Button onClick={() => handleNum('3')}>3</Button>
        <Button onClick={handleEqual} variant="accent" className="row-span-2">=</Button>

        <Button onClick={() => handleNum('0')} className="col-span-2">0</Button>
        <Button onClick={handleDecimal}>.</Button>
      </div>
    </div>
  );
}
