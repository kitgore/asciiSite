
import { css } from '/src/modules/color.js';
import { vec2, dist, mulN } from '/src/modules/vec2.js';
import { map } from '/src/modules/num.js';
const { sin, cos, atan2, floor, min } = Math;

export const settings = {
  fps: 30,
  backgroundColor: 'rgb(66, 66, 112)',
  color: 'rgb(195, 195, 219)',
};

let click = false;
const density = '                  .-+@$';
let scrollingText = "      ETERNAL NOW      ETERNAL NOW      ETERNAL NOW      ETERNAL NOW      ETERNAL NOW      ETERNAL NOW      ETERNAL NOW      ETERNAL NOW      ETERNAL NOW      ETERNAL NOW      I AM NOT AFRAID OF THE COLD AND I AM NOT AFRAID OF THE DOLDRUMS      I AM NOT AFRAID OF THE COLD AND I AM NOT AFRAID OF THE DOLDRUMS      I AM NOT AFRAID OF THE COLD AND I AM NOT AFRAID OF THE DOLDRUMS      SMILE AT THE PAST WHEN I SEE IT      SMILE AT THE PAST WHEN I SEE IT      SMILE AT THE PAST WHEN I SEE IT      SMILE AT THE PAST WHEN I SEE IT      HEARTS ALIVE      HEARTS ALIVE      HEARTS ALIVE      HEARTS ALIVE      HEARTS ALIVE      HEARTS ALIVE      HEARTS ALIVE      HEARTS ALIVE      HEARTS ALIVE      HEARTS ALIVE      AM I GOING THROUGH THE MOTIONS OR ARE THE MOTIONS GOING THROUGH ME?      AM I GOING THROUGH THE MOTIONS OR ARE THE MOTIONS GOING THROUGH ME?      AM I GOING THROUGH THE MOTIONS OR ARE THE MOTIONS GOING THROUGH ME?";
let scrollCounter = 0;
let activeLink = -1;
const menuTextxOffset = 4;
const menuTextyOffset = 3;
const menuXBound = 30;

const arr = [
  'ben',
  'griepp',
  '',
  '',
  'github', // links
  'resume',
  '',
  'projects',
  'about',
];

const links = [4, 5, 7, 8];

class Window {
  constructor(title, content, position, size) {
    this.title = title;
    this.content = content;
    this.position = position;
    this.size = size;
    this.scrollOffset = 0;
  }
}

const projectsContent = `Project 1: Description 
Project 2: Description 
Project 3: Description `;

const projectsWindow = new Window('projects.exe', projectsContent, { x: menuXBound + 5, y: 5 }, { width: 30, height: 20 });

const aboutContent = `About me:
I'm a developer with a passion for coding and learning new technologies. I have experience in multiple programming languages and frameworks, and I'm always eager to tackle new challenges.`;

const aboutWindow = new Window('about.exe', aboutContent, { x: menuXBound + 5, y: 15 }, { width: 50, height: 15 });

const openedWindows = [];
function toggleWindow(window) {
	const windowIndex = openedWindows.indexOf(window);
	if (windowIndex !== -1) {
	  // Close the window by removing it from the openedWindows array
	  openedWindows.splice(windowIndex, 1);
	} else {
	  // Open the window by adding it to the openedWindows array
	  openedWindows.push(window);
	}
  }

export const pointerDown = () => {
  click = true;

  // Check if click and reset if true (to prevent multiple actions per click)
  if (click) {
    click = false;

    // If hovering over link on click, do its action
    if (activeLink != -1) {
      // GitHub
      if (activeLink === 0) {
        window.open('https://github.com/bengriepp', '_blank');
      }
      // Resume
      else if (activeLink === 1) {
        window.open('https://drive.google.com/file/d/1SWXpejQXAzTf_rSRM2bH3WQ63EANR-U9/view?usp=sharing', '_blank');
	  //projects
    } else if (activeLink === 2) {
		toggleWindow(projectsWindow);
	  // about
	  } else if (activeLink === 3) {
		toggleWindow(aboutWindow);
	  }
    }
  }
};

export function pre(context, cursor, buffer, data) {
	scrollCounter -= 0.4; // speed
	if (scrollCounter <= 0) {
		// reset
		scrollCounter = scrollingText.length;
	}

	// reset activeLink and cursor
	activeLink = -1;
	context.settings.element.style.cursor = 'default';

	// check if cursor is within bounds of links
	for (let i = 0; i < links.length; i++) {
		if (Math.floor(cursor.y) === menuTextyOffset + links[i]) {
			if (cursor.x >= menuTextxOffset && cursor.x < menuTextxOffset + arr[links[i]].length) {
				// set activeLink and cursor
				activeLink = i;
				context.settings.element.style.cursor = 'pointer';
			}
		}
	}
}
  
export function main(coord, context, cursor, buffer) {
	const t = context.time * 0.00005;
	const m = min(context.cols, context.rows);
	const st = {
		x: 2.0 * (coord.x - context.cols / 2) / m,
		y: 2.0 * (coord.y - context.rows / 2) / m,
	};
	st.x *= context.metrics.aspect;

	const centerA = mulN(vec2(cos(t * 3), sin(t * 7)), 0.5);
	const centerB = mulN(vec2(cos(t * 5), sin(t * 4)), 0.5);

	const A = dist(st, centerA);
	const B = atan2(centerB.y - st.y, centerB.x - st.x);

	const aMod = map(cos(t * 2.12), -1, 1, 6, 60);
	const bMod = map(cos(t * 3.33), -1, 1, 6, 60);

	const a = cos(A * aMod);
	const b = cos(B * bMod);

	const i = ((a * b) + 1) / 2;
	const idx = floor(i * density.length);

	//render cursor if not hovering over link
	if (activeLink == -1 && coord.x == Math.floor(cursor.x) && coord.y == Math.floor(cursor.y)){
		return '█';
	}

	// Menu and text rendering logic
	const menuChar = getMenuChar(coord, arr, activeLink, menuTextxOffset, menuTextyOffset, links);
	if (menuChar) return menuChar;

	// Text Scroller
	if (coord.y === 0) {
		return scrollingText[((coord.x - Math.floor(scrollCounter)) % scrollingText.length + scrollingText.length) % scrollingText.length];
	}

	// Menu line
	if (coord.x === menuXBound) return '|';

	// Render windows
	for (const win of openedWindows.slice().reverse()) {
		const windowChar = getWindowChar(coord, win);
		if (windowChar) return windowChar;
	  }

	// Character Density Display Logic
	return coord.x > menuXBound ? normalize(density[idx]): ' ';
}

function normalize(char){
	return {
		char: char,
		color: css(195, 195, 219),
		backgroundColor: css(66, 66, 112),
	}
}

function invert(char){
	return {
		char: char,
		color: css(66, 66, 112),
		backgroundColor: css(195, 195, 219),
	};
}

function getMenuChar(coord, arr, activeLink, xOffset, yOffset, links) {
	if (coord.y >= yOffset && coord.y < arr.length + yOffset && coord.x < arr[coord.y - yOffset].length + xOffset && coord.x >= xOffset) {
		if (activeLink != -1 && coord.y === yOffset + links[activeLink] && coord.x >= xOffset && coord.x <= xOffset + arr[links[activeLink]].length) {
		return invert(arr[coord.y - yOffset].charAt(coord.x - xOffset));
	} 
	else {
		return normalize(arr[coord.y - yOffset].charAt(coord.x - xOffset));
	}
	}
}

function getWindowChar(coord, win) {
	if (coord.x >= win.position.x && coord.y >= win.position.y && coord.x < win.position.x + win.size.width && coord.y < win.position.y + win.size.height) {
	  const x = coord.x - win.position.x;
	  const y = coord.y - win.position.y;
	  const lines = win.content.split('\n');
	  const borderChar = ' ';
	  const borderTopChar = ' ';
	  const borderBottomChar = '─';
	  const borderLeftChar = '│';
	  const borderRightChar = '│';
	  const bottomLeftCornerChar = '└';
	  const bottomRightCornerChar = '┘';
  
	  // Render the title bar
	  if (y === 0) {
		if (x === win.size.width - 2) {
			return invert('X')
		} else if (x < win.title.length + 1) {
		  return invert(win.title[x - 1]);
		} else {
		  return invert(borderChar);
		}
	  }
  
	  // Render the borders
	  if (x === 0 && y === win.size.height - 1) {
		return normalize(bottomLeftCornerChar);
	  }
	  if (x === win.size.width - 1 && y === win.size.height - 1) {
		return normalize(bottomRightCornerChar);
	  }
	  if (x === 0) {
		return normalize(borderLeftChar);
	  }
	  if (x === win.size.width - 1) {
		return normalize(borderRightChar);
	  }
	  if (y === 0) {
		return normalize(borderTopChar);
	  }
	  if (y === win.size.height - 1) {
		return normalize(borderBottomChar);
	  }
  
	  // Render the content
	  if (y > 0 && y - 1 < lines.length && x < lines[y - 1 - win.scrollOffset]?.length) {
		return normalize(lines[y - 1 - win.scrollOffset].charAt(x - 1));
	  }
	  return normalize(' ');
	}
  }
  