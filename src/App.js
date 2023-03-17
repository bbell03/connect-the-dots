import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef, createRef} from 'react';
import {fabric} from 'fabric';

function makeLine(x_start, x_end, y_start, y_end) {
  let line = new fabric.Line([x_start, x_end, y_start, y_end], {
    stroke: 'green'
  });

  return line
}

function App() {
  // const [canvas, setCanvas] = useState('');
  let canvas = React.createRef();

  useEffect(() => {
    canvas.current = new fabric.Canvas('c', {
      height: 800,
      width: 800,
      backgroundColor: 'pink'
    });
    console.log(canvas.current);
    // canvas.current = initCanvas();
    if (canvas) {
      canvas.current.add(makeLine(50, 10, 200, 150));
    }


    for (var i = 0; i < 1; i++) {

      for (var n = 0; n < 2; n++) {
          var random_color = 'blue'
          var circ = new fabric.Circle({
              id: (i * 2) + n,
              in: false,
              out: false,
              left: n * 60,
              top: i * 60,
              radius: 15,
              fill: random_color,
              strokeWidth: 5,
              stroke: 'rgba(0,0,0,0)',
              originX: 'left',
              originY: 'top',
              centeredRotation: true,
              selectable: true
          });

          canvas.current.add(circ);
    }

  }


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
      <h3>Draw A Line</h3>
      <canvas id="c"></canvas>
    </div>
  );
}

export default App;
