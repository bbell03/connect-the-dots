// import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef, createRef} from 'react';
import {fabric} from 'fabric';
import DoublyList from './LL';

// var CANVAS_SIZE = 600; // defined in css
var grid = 60; // spacing between circles
// var CIRCLES_PER_ROW = 6; // rows & columns
var linked_list = new DoublyList(); // linked list of selected dots
var lockLine = false; // if line should be snapped to a dot
// var currentCircle; // current circle that was hovered over

var line; // current line being moved around
var isDown; // if the mouse is down (dragging line)
var lineExists = false; // At least one line exists
var totalLines = 0; // total number of lines connecting dots
var activeColor = "#000"; // color of active line
var allLines = []; // array of all drawn lines
// var gameOver = false;

function makeLine(x_start, x_end, y_start, y_end) {
  let line = new fabric.Line([x_start, x_end, y_start, y_end], {
    stroke: 'green'
  });

  return line
}

// function mouseDown() {
//   if (o.target && o.target.get('type') == "circle") {
//       // If line color already exists, it cannot be changed.
//       if (lineExists && activeColor != o.target.getFill()) {
//           console.log("Color not not match existing.");
//           line = null;
//           return;
//       } else {
//           activeColor = o.target.getFill();
//           // Add first, starting circle to list (line does not exist at this point)
//           linked_list.add(o.target.id);
//           o.target.out = true;
//           console.log(linked_list);
//       }
//       let activeCircleCenter = o.target.getCenterPoint();
//       isDown = true;
//       let points = [activeCircleCenter.x, activeCircleCenter.y, activeCircleCenter.x, activeCircleCenter.y];
//       allLines[totalLines] = new fabric.Line(points, {
//           strokeWidth: 12,
//           stroke: activeColor,
//           originX: 'center',
//           originY: 'center'
//       });

//       line = allLines[totalLines];

//       canvas.current.add(line);

//   }


// }


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
              left: n * grid,
              top: i * grid,
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

  // canvas.current.on('mouse:down', mouseDown());


  // Primarily used for first down
  canvas.current.on('mouse:down', function (o) {

    if (o.target && o.target.get('type') == "circle") {
        console.log(o.target);
        // If line color already exists, it cannot be changed.
        if (lineExists) {
            console.log("Color not not match existing.");
            line = null;
            return;
        } else {
            // activeColor = o.target.getFill();
            // Add first, starting circle to list (line does not exist at this point)
            linked_list.add(o.target.id);
            o.target.out = true;
            console.log(linked_list);
        }
        let activeCircleCenter = o.target.getCenterPoint();

        isDown = true;

        let points = [activeCircleCenter.x, activeCircleCenter.y, activeCircleCenter.x, activeCircleCenter.y];

        allLines[totalLines] = new fabric.Line(points, {
            strokeWidth: 12,
            stroke: activeColor,
            originX: 'center',
            originY: 'center'
        });

        line = allLines[totalLines];

        canvas.current.add(line);

    }


  });

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
      <h3>Dots and a Line</h3>
      <canvas id="c"></canvas>
    </div>
  );
}

export default App;
