// import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef, createRef} from 'react';
import {fabric} from 'fabric';
import DoublyList from './DoublyList';

// var CANVAS_SIZE = 600; // defined in css
var grid = 60; // spacing between circles
// var CIRCLES_PER_ROW = 6; // rows & columns
var linked_list = new DoublyList(); // linked list of selected dots
var lockLine = false; // if line should be snapped to a dot
var currentCircle; // current circle that was hovered over

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
  //try using state instead of ref see if it makes
  //a difference with the callback functions
  useEffect(() => {
    canvas.current = new fabric.Canvas('c', {
      height: 800,
      width: 800,
      backgroundColor: 'black'
    });
    console.log(canvas.current);
    // canvas.current = initCanvas();
    // if (canvas) {
    //   canvas.current.add(makeLine(50, 10, 200, 150));
    // }


    for (var i = 0; i < 1; i++) {

      for (var n = 2; n < 4; n++) {
          var random_color = 'white'
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
              selectable: false
          });

          canvas.current.add(circ);


    }

  }

  canvas.current.on('mouse:over', function (e) {
              if (e.target) {
                console.log("e.target");
                console.log(e.target);
                e.target.setStroke('white');
                e.target.setStrokeWidth(5);
                console.log('after e.target');
              }

              // Line exists as soon as user begins dragging
              // Snaps line to a circle that is hovered over, this can only occur when the user is dragging so isDown needs to be true
              if (line) {

                  if (e.target.getFill() == line.getStroke() && isDown) {

                      lockLine = true;
                      line.set({
                          x2: e.target.getCenterPoint().x,
                          y2: e.target.getCenterPoint().y
                      });

                      currentCircle = e.target;

                      // First if statement snaps/locks line with the same colored dot
                      // Diagonal lines are not allowed
                      if (line.x2 != line.x1 && line.y2 != line.y1) {
                          console.log("Diagonal lines are not allowed.");
                          lockLine = false;
                      }
                      // Lines can only be one unit long -- prevents line from streching across multiple dots
                      else if (Math.abs(line.x2 - line.x1) > grid || Math.abs(line.y2 - line.y1) > grid) {
                          console.log("Lines can only be one unit long");
                          lockLine = false;
                          // line.remove();

                          // Each circle may only have 1 line connecting into it
                      } else if (e.target.in) {
                          console.log("Circle already has an input");
                          lockLine = false;
                      }

                      // You cannot connect the current circle from the previous circle where the line just came from
                      else if (e.target.id == linked_list.tail.id) {
                          console.log("Cannot move backwards.");
                          lockLine = false;
                      } else {

                          lineExists = true;
                          totalLines++;

                          let activeCircleCenter = e.target.getCenterPoint();
                          var points = [activeCircleCenter.x, activeCircleCenter.y, activeCircleCenter.x, activeCircleCenter.y];

                          allLines[totalLines] = new fabric.Line(points, {
                              strokeWidth: 12,
                              stroke: activeColor,
                              originX: 'center',
                              originY: 'center'
                          });

                          e.target.in = true;

                          line = allLines[totalLines];
                          lockLine = false;
                          canvas.current.add(line);
                          linked_list.add(e.target.id);
                          console.log(linked_list);
                      }
                  } else {
                      currentCircle = null;
                  }
              }

              canvas.current.renderAll();
          })
          .on('mouse:out', function (e) {
            if (e.target) {
              console.log("e.target");
              console.log(e.target);
              e.target.setStroke('rgba(0,0,0,0)');
              lockLine = false;
             canvas.current.renderAll();
           }
          });

  // canvas.current.on('mouse:over', function(o) {
  //   console.log('mouse over');
  //   console.log(o);
  // }).on('mouse:out', function(o) {
  //   console.log('mouse out');
  //   console.log(o);
  // });

  // Primarily used for first down
  canvas.current.on('mouse:down', function (o) {
    console.log('mouse down');
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
        console.log('activeCircleCenter: ');
        console.log(activeCircleCenter);

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

  // canvas.current.on('mouse:up', function(o) {
  //   console.log('mouse up');
  //   console.log(o);
  // });

  }, []);


  // const initCanvas = () => {
  //   new fabric.Canvas('c', {
  //     height: 800,
  //     width: 800,
  //     backgroundColor: 'black'
  //   });
  // };

  return (

    <div className="App">
      <h1 class="text">Fabric Canvas</h1>
      <h3 class="text">Dots</h3>
      <canvas id="c"></canvas>
    </div>
  );
}

export default App;
