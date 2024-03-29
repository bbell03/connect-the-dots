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
var activeColor = "#FFF"; // color of active line
var color_scheme = [
    "FFFFFF"
];
var allLines = []; // array of all drawn lines
// var gameOver = false;

function addNewDots(coordsToGenerateDots, canvas) {
    console.log("canvas in add");
    console.log(canvas);
    console.log("coordsToGenerateDots");
    console.log(coordsToGenerateDots);
    for (var i = 0; i < coordsToGenerateDots.length; i++) {

        var random_color = Math.floor(Math.random() * (color_scheme.length - 0)) + 0;

        var circ = new fabric.Circle({
            id: coordsToGenerateDots[i].id,
            in: false,
            out: false,
            left: coordsToGenerateDots[i].x,
            top: coordsToGenerateDots[i].y - 20,
            radius: 15,
            fill: color_scheme[random_color],
            opacity: 0,
            strokeWidth: 5,
            stroke: 'rgba(0,0,0,0)',
            originX: 'left',
            originY: 'top',
            centeredRotation: true,
            selectable: false
        });
        canvas.add(circ);

        circ.animate({
            'opacity': '1',
            'top': circ.top + 20
        }, {
            duration: 950,
            onChange: canvas.renderAll.bind(canvas),
            onComplete: function () {

            },
            easing: fabric.util.ease["easeOutElastic"]
        });
    }

}

function removeSelectedDots(canvas) {
    console.log("removeSelectedDots start");
    console.log("canvas in remove");
    console.log(canvas);
    var coordsToGenerateDots = [];

    // Remove selected dots
    console.log("console log function");
    console.log(canvas.forEachObject(function(obj) {console.log(obj);}));
    console.log("lalala");
    canvas.forEachObject(function (obj) {
        if (linked_list._length <= 1) return;

        if (obj.get('type') == "line") {
            obj.animate('opacity', '0', {
                duration: 75,
                onChange: canvas.renderAll.bind(canvas),
                onComplete: function () {
                    canvas.remove(obj);
                }
            });
            return;
        }

        var currentNode = linked_list.head;

        for (var i = 0; i < linked_list._length; i++) {
            if (currentNode.id == obj.id) {

                coordsToGenerateDots.push({
                    "x": obj.left,
                    "y": obj.top,
                    "id": obj.id
                });

                obj.animate('opacity', '0', {
                    duration: 75,
                    onChange: canvas.renderAll.bind(canvas),
                    onComplete: function () {
                        canvas.remove(obj);

                    }
                });
            }

            currentNode = currentNode.next;
        }
    });

    lineExists = false;
    linked_list = new DoublyList();
    return coordsToGenerateDots;
}


function makeLine(x_start, x_end, y_start, y_end) {
  let line = new fabric.Line([x_start, x_end, y_start, y_end], {
    stroke: 'green'
  });

  return line
}

//As of now I don't think this program uses react fabric

//really try and isolate functionality in the vanilla version to
//translate to react

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

//https://aprilescobar.medium.com/part-1-fabric-js-on-react-fabric-canvas-e4094e4d0304

// const App = () => {
//   const [canvas, setCanvas] = useState('');  useEffect(() => {
//     setCanvas(initCanvas());
//   }, []);  const initCanvas = () => (
//     new fabric.Canvas('canvas', {
//       height: 800,
//       width: 800,
//       backgroundColor: 'pink'
//     })
//   )
//   return(
//     <div>
//       <h1>Fabric.js on React - fabric.Canvas('...')</h1>
//       <canvas id="canvas" />
//     </div>
//   );
// }


function App() {
  // const [canvas, setCanvas] = useState('');
  let canvas = React.createRef();
  //try using state instead of ref see if it makes
  //a difference with the callback functions


  // function handleClick() {
  //   canvas.current.clear();
  //   //?
  //   // linked_list.clear();

  //   linked_list = new DoublyList();
  //   allLines = [];
  //   totalLines = 0;
  //   lineExists = false;
  //   canvasLogic();
  // }

  useEffect(() => {canvasLogic()});

  function canvasLogic() {
  // useEffect(() => {
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


    for (var i = 0; i < 5; i++) {

      for (var n = 4; n < 9; n++) {
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
                // e.target.setStroke('white');
                // e.target.setStrokeWidth(5);
                // console.log('after e.target');
              }

              // Line exists as soon as user begins dragging
              // Snaps line to a circle that is hovered over, this can only occur when the user is dragging so isDown needs to be true
              if (line) {
                  // e.target.getFill() ==
                  // line.getStroke() &&
                  if (isDown) {

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
              // e.target.setStroke('rgba(0,0,0,0)');
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

  canvas.current.on('mouse:up', function (o) {
      isDown = false;
  
      // If mouse/line is let go on top of empty canvas and not a circle, delete the line
      if (o.target === null) {
          line.remove();
      }
  
      // otherwise, the mouse/line was released on a circle, and we much error check the line
      else {
          console.log(line);
          // First if statement snaps/locks line with the same colored dot
          // Diagonal lines are not allowed
          if (line.x2 != line.x1 && line.y2 != line.y1) {
              console.log("Diagonal lines are not allowed.");
              line.remove();
          }
          // Lines can only be one unit long -- prevents line from streching across multiple dots
          else if (Math.abs(line.x2 - line.x1) > grid || Math.abs(line.y2 - line.y1) > grid) {
              console.log("Lines can only be one unit long");
              lockLine = false;
              line.remove();
          }
      }
  
  
  
      // var activeDotsColumns = getColumnsToAddDotsTo(linked_list, CIRCLES_PER_ROW);
      // console.log(activeDotsColumns);
      // var dotsToAddPerColumn = shiftDotsDown(activeDotsColumns);
      // console.log(dotsToAddPerColumn);
      console.log("before add remove function calls");
      var coordsToGenerateDots = removeSelectedDots(canvas.current);
      addNewDots(coordsToGenerateDots, canvas.current);
      console.log(coordsToGenerateDots);
  
  
  
  
  });

}

  // }, [canvas.current]);


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
      {/* <button onClick={handleClick}>Clear Canvas</button> */}
    </div>
  );
}

export default App;
