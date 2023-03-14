import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef, createRef} from 'react';
import {fabric} from 'fabric';

function App() {
  const [canvas, setCanvas] = useState('');
  // let canvas = React.createRef();

  useEffect(() => {
    setCanvas(initCanvas());
    // canvas.current = initCanvas();
    console.log(canvas);
  }, []);

  const initCanvas = () => {
    new fabric.Canvas('c', {
      height: 800,
      width: 800,
      backgroundColor: 'pink'
    })
  };

  return (
    <div className="App">
      <h1>Fabric Canvas</h1>
      <canvas id="c"></canvas>
    </div>
  );
}

export default App;
