# connect-the-dots

**Reverse Engineering & Application Development**

by Brandon

I was asked to make a simple connect the dots ui for React and React Native. I am starting with Fabric because I found a neat example reference and am looking to translate the functionality to React JS for the sake of familiarity and personal reference and finally to react-native svg for ease of use on mobile os.

Inspired by https://github.com/deepsheth/connect-the-dots-game

I think the idea is to use the parts of the application connect-the-dots-game I see myself needing. To identify the necessary parts of the program for repurposing, I must understand the code, at least the parts that I need and anything required for them to run. I must take care to understand any consequences of translating code or adapting implementations to React from regular JavaScript. Some strategies that might be helpful include annotating the code, running code snippets in isolation or in parallel across platforms, and starting with a base case or simplified version of the problem I am looking to solve.

Converting a vanilla JavaScript app into a React app involves breaking down the original app into smaller components that can be managed more easily. Each component should have its own state, and changes to the state should trigger re-renders of the component. The original app's functions and logic can be translated into the React components and their associated methods. Additionally, third-party libraries and frameworks may need to be replaced with React-specific alternatives, or modified to work with React (Notion AI).

[Part 1: Fabric.js on React - fabric.Canvas(‘…’)](https://aprilescobar.medium.com/part-1-fabric-js-on-react-fabric-canvas-e4094e4d0304)

Good place to start:

Minimum Viable Solution (drawing parallels from connect-the-dots game)

- connect 2 dots using mouse events
- upon clicking one dot, make a line starting from the center point of the dot, and extend it dynamically to the cursor’s position
- upon click release, if the cursor position is aligned with the area of another dot, the line snaps to the center point of this dot, connecting the 2 dots’ centers otherwise the line is deleted

fabric js simple makeLine

```jsx
function makeLine(x_start, x_end, y_start, y_end) {
  let line = new fabric.Line([x_start, x_end, y_start, y_end], {
    stroke: 'green'
  });

  return line
}
```

Necessary Work

- make dots
    - save or get center point
- mouse events
    - make line
- write snap conditions

[https://github.com/deepsheth/connect-the-dots-game](https://github.com/deepsheth/connect-the-dots-game)

Organize Sections Key:

- Structures and Scopes
    - Global Variables
    - Formal Variables
- JS + Classes + Objects + Methods + Properties

[https://www.javascripttutorial.net/web-apis/javascript-draw-line/](https://www.javascripttutorial.net/web-apis/javascript-draw-line/)

refer to below components for relevant mouse events

**Structures & Scopes:**

**Global Variables:**

- *color_scheme*
- *CANVAS_SIZE*
- *grid*
- *CIRCLES_PER_ROW*
- *linked_list*
- *lockLine*
- *currentCircle*
- *line*
- *isDown*
- *lineExists*
- *totalLines*
- *activeColor*
- *allLines*
- *gameOver*

**JS + Library Objects and Properties:**

- *$(document).ready(function() {});* like componentDidMount for JQuery
- *initModal();*
- *fabric.Canvas(’’) initialization and properties ie. canvas.propertyFunc();*
    - canvas.on()
        - mouse:down
        - mouse:out
        - mouse:move
    - canvas.add()
    - canvas.renderAll();
    - canvas.getPointer();
- fabric.Circle({}) initialization and properties ie. circle.propertyFunc();
    - id
    - in
    - out
    - left
    - top
    - radius
    - fill
    - strokeWidth
    - stroke
    - originX
    - originY
    - centeredRotation
    - selectable
- fabric.line(args) initialization and properties ie fabric.propertyFunc();
    - strokeWidth,
    - stroke,
    - originX
    - originY
    - remove
- *Math.floor, Math.Random & Math.abs in context*
- *e.target.setStroke(’’), e.target.getFill(), e.target.getCenterPoint(); → bindings to e and callback properties…*
- object.prototype

**Custom Functions:**

- getColumnsToAddDotsTo()
- removeSelectedDots
- updateScore

**********Control Data Structures:**********

- for loop create grid

********************************Data Structures:********************************

- Node
    - DoublyList → linked list with a head and a tail
