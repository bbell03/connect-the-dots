"use client";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, Circle, Line } from "fabric";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Color schemes
const COLOR_SCHEMES = {
    'neon': [
        '#FF00FF', // Magenta
        '#00FFFF', // Cyan
        '#FFFF00', // Yellow
        '#FF00FF', // Fuchsia
        '#00FF00', // Lime
        '#FF0080', // Hot pink
        '#00FF80', // Spring green
        '#8000FF', // Purple
        '#FF8000', // Orange
        '#0080FF'  // Bright blue
    ],
    'pastel': [
        '#FFB3D9', // Pastel pink
        '#B3FFE6', // Pastel mint
        '#FFD9B3', // Pastel peach
        '#D9B3FF', // Pastel lavender
        '#B3FFB3', // Pastel green
        '#FFFFB3', // Pastel yellow
        '#FFB3B3', // Pastel coral
        '#B3D9FF', // Pastel sky blue
        '#FFE6B3', // Pastel cream
        '#E6B3FF'  // Pastel violet
    ],
    'purple-blue': [
        // Purple shades
        '#F3E5F5', '#E1BEE7', '#CE93D8', '#BA68C8', '#AB47BC', '#9C27B0', '#8E24AA', '#7B1FA2',
        // Blue shades
        '#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2'
    ]
};

// Type definitions
type CircleWithTracking = Circle & { 
    id: number; 
    in: boolean; 
    out: boolean;
    fill?: string;
};

// Simple linked list structure (from script.js)
type DoublyListNode = {
    id: number;
    previous: DoublyListNode | null;
    next: DoublyListNode | null;
};

class DoublyList {
    _length: number = 0;
    head: DoublyListNode | null = null;
    tail: DoublyListNode | null = null;

    add(value: number): DoublyListNode {
        const node: DoublyListNode = { id: value, previous: null, next: null };

        if (this._length && this.tail) {
            this.tail.next = node;
            node.previous = this.tail;
            this.tail = node;
        } else {
            this.head = node;
            this.tail = node;
        }

        this._length++;
        return node;
    }
}

//react framework
const DotsInterface = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricCanvasRef = useRef<Canvas | null>(null);
    const [colorScheme, setColorScheme] = useState<'neon' | 'pastel' | 'purple-blue'>('purple-blue');
    
    // Debug mode: connect dots regardless of color (for testing)
    const [debugMode, setDebugMode] = useState<boolean>(false);
    
    // Line drawing state (using refs to persist across renders)
    const isDownRef = useRef<boolean>(false);
    const lineRef = useRef<Line | null>(null);
    const lockLineRef = useRef<boolean>(false);
    const activeColorRef = useRef<string>('');
    const lineExistsRef = useRef<boolean>(false);
    const totalLinesRef = useRef<number>(0);
    const allLinesRef = useRef<Line[]>([]);
    const linkedListRef = useRef<DoublyList>(new DoublyList());
    const currentCircleRef = useRef<Circle | null>(null);

    // Grid configuration constants
    const GRID_SPACING = 60;
    const CIRCLES_PER_ROW = 9;
    const CIRCLES_PER_COLUMN = 9;
    const CIRCLE_RADIUS = 15;

    // Reset line drawing state
    const resetLineState = () => {
        isDownRef.current = false;
        lineRef.current = null;
        lockLineRef.current = false;
        activeColorRef.current = '';
        lineExistsRef.current = false;
        totalLinesRef.current = 0;
        allLinesRef.current = [];
        linkedListRef.current = new DoublyList();
        currentCircleRef.current = null;
    };

    // Create grid of circles
    const createGrid = (fabricCanvas: Canvas, selectedColors: string[]): Circle[] => {
        const circles: Circle[] = [];
        
        for (let i = 0; i < CIRCLES_PER_COLUMN; i++) {
            for (let n = 0; n < CIRCLES_PER_ROW; n++) {
                const randomColor = selectedColors[Math.floor(Math.random() * selectedColors.length)];
                const circleId = (i * CIRCLES_PER_ROW) + n;
                const circle = new Circle({
                    left: n * GRID_SPACING,
                    top: i * GRID_SPACING,
                    radius: CIRCLE_RADIUS,
                    fill: randomColor,
                    strokeWidth: 5,
                    stroke: 'rgba(0,0,0,0)',
                    originX: 'left',
                    originY: 'top',
                    centeredRotation: true,
                    selectable: false,
                    evented: true,
                    hoverCursor: 'pointer'
                });

                // Add tracking properties
                const circleWithTracking = circle as CircleWithTracking;
                circleWithTracking.id = circleId;
                circleWithTracking.in = false;
                circleWithTracking.out = false;

                circles.push(circle);
                fabricCanvas.add(circle);
            }
        }
        
        return circles;
    };

    // Setup event handlers
    const setupEventHandlers = (fabricCanvas: Canvas) => {
        // Mouse over - handles hover and line snapping
        fabricCanvas.on('mouse:over', (e) => {
            if (e.target && e.target instanceof Circle) {
                const target = e.target as CircleWithTracking;
                
                // Hover effect
                target.set({
                    stroke: 'white',
                    strokeWidth: 5
                });

                // Line snapping logic
                if (lineRef.current && isDownRef.current) {
                    const targetFill = target.fill as string;
                    const lineStroke = lineRef.current.stroke as string;

                    // In debug mode, allow any color connection; otherwise match colors
                    if (debugMode || targetFill === lineStroke) {
                        lockLineRef.current = true;
                        const centerPoint = target.getCenterPoint();
                        lineRef.current.set({
                            x2: centerPoint.x,
                            y2: centerPoint.y
                        });

                        currentCircleRef.current = target;

                        // Validation checks
                        const x1 = lineRef.current.x1 || 0;
                        const y1 = lineRef.current.y1 || 0;
                        const x2 = lineRef.current.x2 || 0;
                        const y2 = lineRef.current.y2 || 0;

                        // Diagonal lines not allowed
                        if (x2 !== x1 && y2 !== y1) {
                            console.log("Diagonal lines are not allowed.");
                            lockLineRef.current = false;
                        }
                        // Lines can only be one unit long
                        else if (Math.abs(x2 - x1) > GRID_SPACING || Math.abs(y2 - y1) > GRID_SPACING) {
                            console.log("Lines can only be one unit long");
                            lockLineRef.current = false;
                        }
                        // Each circle may only have 1 line connecting into it
                        else if (target.in) {
                            console.log("Circle already has an input");
                            lockLineRef.current = false;
                        }
                        // Cannot move backwards
                        else if (target.id === linkedListRef.current.tail?.id) {
                            console.log("Cannot move backwards.");
                            lockLineRef.current = false;
                        }
                        // Valid connection - create new line segment
                        else {
                            lineExistsRef.current = true;
                            totalLinesRef.current++;

                            const activeCircleCenter = target.getCenterPoint();
                            const points: [number, number, number, number] = [
                                activeCircleCenter.x, 
                                activeCircleCenter.y, 
                                activeCircleCenter.x, 
                                activeCircleCenter.y
                            ];

                            const newLine = new Line(points, {
                                strokeWidth: 12,
                                stroke: activeColorRef.current,
                                originX: 'center',
                                originY: 'center'
                            });

                            target.in = true;
                            allLinesRef.current[totalLinesRef.current] = newLine;
                            lineRef.current = newLine;
                            lockLineRef.current = false;
                            fabricCanvas.add(newLine);
                            linkedListRef.current.add(target.id!);
                            console.log(linkedListRef.current);
                        }
                    } else {
                        currentCircleRef.current = null;
                    }
                }
                fabricCanvas.renderAll();
            }
        });

        // Mouse out - removes hover effect
        fabricCanvas.on('mouse:out', (e) => {
            if (e.target && e.target instanceof Circle) {
                e.target.set({
                    stroke: 'rgba(0,0,0,0)'
                });
                lockLineRef.current = false;
                fabricCanvas.renderAll();
            }
        });

        // Mouse down - start line drawing
        fabricCanvas.on('mouse:down', (e) => {
            if (e.target && e.target instanceof Circle) {
                const target = e.target as CircleWithTracking;
                
                if (target.fill) {
                    // If line color already exists, it cannot be changed (unless debug mode)
                    if (!debugMode && lineExistsRef.current && activeColorRef.current !== target.fill) {
                        console.log("Color does not match existing.");
                        lineRef.current = null;
                        return;
                    } else {
                        activeColorRef.current = target.fill as string;
                        linkedListRef.current.add(target.id!);
                        target.out = true;
                        console.log(linkedListRef.current);
                    }

                    const activeCircleCenter = target.getCenterPoint();
                    isDownRef.current = true;

                    const points: [number, number, number, number] = [
                        activeCircleCenter.x, 
                        activeCircleCenter.y, 
                        activeCircleCenter.x, 
                        activeCircleCenter.y
                    ];

                    const newLine = new Line(points, {
                        strokeWidth: 12,
                        stroke: activeColorRef.current,
                        originX: 'center',
                        originY: 'center'
                    });

                    allLinesRef.current[totalLinesRef.current] = newLine;
                    lineRef.current = newLine;
                    fabricCanvas.add(newLine);
                }
            }
        });

        // Mouse move - update line position
        fabricCanvas.on('mouse:move', (e) => {
            fabricCanvas.renderAll();
            if (!isDownRef.current) return;

            const pointer = fabricCanvas.getPointer(e.e);
            if (!lockLineRef.current && lineRef.current) {
                lineRef.current.set({
                    x2: pointer.x,
                    y2: pointer.y
                });
            }
            fabricCanvas.renderAll();
        });

        // Mouse up - validate and complete line
        fabricCanvas.on('mouse:up', (e) => {
            isDownRef.current = false;

            if (!lineRef.current) return;

            // If mouse/line is let go on empty canvas, delete the line
            if (!e.target) {
                fabricCanvas.remove(lineRef.current);
                lineRef.current = null;
                return;
            }

            // Otherwise, validate the line
            const x1 = lineRef.current.x1 || 0;
            const y1 = lineRef.current.y1 || 0;
            const x2 = lineRef.current.x2 || 0;
            const y2 = lineRef.current.y2 || 0;

            // Diagonal lines are not allowed
            if (x2 !== x1 && y2 !== y1) {
                console.log("Diagonal lines are not allowed.");
                fabricCanvas.remove(lineRef.current);
                lineRef.current = null;
            }
            // Lines can only be one unit long
            else if (Math.abs(x2 - x1) > GRID_SPACING || Math.abs(y2 - y1) > GRID_SPACING) {
                console.log("Lines can only be one unit long");
                lockLineRef.current = false;
                fabricCanvas.remove(lineRef.current);
                lineRef.current = null;
            }

            // TODO: Add removeSelectedDots and addNewDots functions here
            // For now, just reset the line state
            lineRef.current = null;
        });
    };

    //fabric canvas setup
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let fabricCanvas = fabricCanvasRef.current;
        if (!fabricCanvas) {
            fabricCanvas = new Canvas(canvas, {
                selection: false,
                preserveObjectStacking: true,
            });
            fabricCanvasRef.current = fabricCanvas;
        }

        // Get selected color scheme
        const selectedColors = COLOR_SCHEMES[colorScheme];

        // Clear existing circles and remove event listeners
        fabricCanvas.clear();
        fabricCanvas.off('mouse:over');
        fabricCanvas.off('mouse:out');
        fabricCanvas.off('mouse:down');
        fabricCanvas.off('mouse:move');
        fabricCanvas.off('mouse:up');

        // Reset line drawing state
        resetLineState();

        // Create grid
        createGrid(fabricCanvas, selectedColors);

        // Setup event handlers
        setupEventHandlers(fabricCanvas);

        return () => {
            // Clean up event listeners (but don't dispose on color scheme change)
            if (fabricCanvas) {
                fabricCanvas.off('mouse:over');
                fabricCanvas.off('mouse:out');
                fabricCanvas.off('mouse:down');
                fabricCanvas.off('mouse:move');
                fabricCanvas.off('mouse:up');
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [colorScheme, debugMode]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.dispose();
                fabricCanvasRef.current = null;
            }
        };
    }, []);


    // const [count, setCount] = useState(0);
    


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Select value={colorScheme} onValueChange={(value: 'neon' | 'pastel' | 'purple-blue') => setColorScheme(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select color scheme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="neon">Neon</SelectItem>
                        <SelectItem value="pastel">Pastel</SelectItem>
                        <SelectItem value="purple-blue">Shades of Purple/Blue</SelectItem>
                    </SelectContent>
                </Select>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={debugMode}
                        onChange={(e) => setDebugMode(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px' }}>Debug Mode (connect any color)</span>
                </label>
            </div>
            <canvas ref={canvasRef} width={800} height={600} style={{border: '1px solid black'}} />
        </div>
    );

}

//core logic
/* we must keep in mind core utilities from fabric interfaces which have been changed
//Structures:
//Circle, Line
//Grid, Path
//Double List **bidirectional linked list
*/


//variables
// const color_scheme: string[] = [];
// const CANVAS_SIZE: number = 0;
// const width: number = 0;
// const height: number = 0;


// const linked_list: object | null = null;
// const lockLine: boolean = false; //some similar utility may be necessary depending on implementation
// const currentCircle: object | null = null;

// const line: object | null = null;
// const isDown: boolean | null = null;

//fabric variables... reference to the canvas and context?*
// const canvas = null;
// const ctx = null;

//create grid logic
// const createGrid = () => {}
// const populateGrid = () => {}


//mouse events
// mouse down

// const handlemouseOver = () => {
//     const pointer = fabricCanvasRef.current?.getPointer(opt.e);
//     console.log('Mouse Over at ', pointer);
// };

// const handleMouseMove = () => {
//     console.log('Mouse Move at ', pointer);
// };

// const handleMouseUp = () => {   
//     console.log('Mouse Up at ', pointer);
// };

// const handleMouseOut = () => {
//     console.log('Mouse Out at ', pointer);
// }

// mouse over
// mouse out
// mouse move
// mouse up

//utilities
// shiftDotsDown()
// addNewDots()
// getColumnsToAddDotsTo()
// removeSelectedDots()


//storybook
//stories...

//tests
//utility
//integration

//...corresponding animations

export default DotsInterface;
