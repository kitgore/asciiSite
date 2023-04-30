import { css } from '/src/modules/color.js'
import { vec2, dist, mulN } from '/src/modules/vec2.js'
import { map } from '/src/modules/num.js'
const { sin, cos, atan2, floor, min } = Math

export const settings = {
	fps : 30,
	backgroundColor : 'rgb(66, 66, 112)',
	color: 'rgb(195, 195, 219)'
}

// const density = ' ..._-:=+abcXW@#ÑÑÑ'
// const density = '                                 .-:++@$$'
let click = false;
const density = '                  .-+@$'
let scrollingText = "      ETERNAL NOW      ETERNAL NOW      ETERNAL NOW      ETERNAL NOW      ETERNAL NOW      ETERNAL NOW      ETERNAL NOW      ETERNAL NOW      ETERNAL NOW      ETERNAL NOW      I AM NOT AFRAID OF THE COLD AND I AM NOT AFRAID OF THE DOLDRUMS      I AM NOT AFRAID OF THE COLD AND I AM NOT AFRAID OF THE DOLDRUMS      I AM NOT AFRAID OF THE COLD AND I AM NOT AFRAID OF THE DOLDRUMS      SMILE AT THE PAST WHEN I SEE IT      SMILE AT THE PAST WHEN I SEE IT      SMILE AT THE PAST WHEN I SEE IT      SMILE AT THE PAST WHEN I SEE IT      HEARTS ALIVE      HEARTS ALIVE      HEARTS ALIVE      HEARTS ALIVE      HEARTS ALIVE      HEARTS ALIVE      HEARTS ALIVE      HEARTS ALIVE      HEARTS ALIVE      HEARTS ALIVE      AM I GOING THROUGH THE MOTIONS OR ARE THE MOTIONS GOING THROUGH ME?      AM I GOING THROUGH THE MOTIONS OR ARE THE MOTIONS GOING THROUGH ME?      AM I GOING THROUGH THE MOTIONS OR ARE THE MOTIONS GOING THROUGH ME?";
let scrollCounter = 0;
let activeLink = -1;
const menuTextxOffset = 4;
const menuTextyOffset = 3;

const arr = [
	"ben",
	"griepp",
	"",
	"",
	"github", //links
	"resume",
	"",
	"projects",
	"about"
]

//y offset of each link in arr
const links = [ 4, 5, 7, 8 ]

export const pointerDown = () => click = true;

export function pre(context, cursor, buffer, data) {
	//Text Scroller
	scrollCounter -= .4; //speed
	if (scrollCounter <= 0) { //reset
	  scrollCounter = scrollingText.length;
	}

	//reset activeLink and cursor
	activeLink = -1;
	context.settings.element.style.cursor = 'default'

	//check if cursor is within bounds of links
	for(let i = 0; i < links.length; i++) {
		if(Math.floor(cursor.y) === menuTextyOffset + links[i]) {
			if(cursor.x >= menuTextxOffset && cursor.x < menuTextxOffset + arr[links[i]].length){
				//set activeLink and cursor
				activeLink = i;
				context.settings.element.style.cursor = 'pointer'
			}
		}
	}
	//check if click and reset if true (to prevent multiple actions per click)
	if(click) {
		click = false;

		//if hovering over link on click, do its action
		if( activeLink != -1){

			//github
			if(activeLink === 0) {
				window.open('https://github.com/bengriepp', '_blank');

			//resume
			} else if(activeLink === 1) {
				window.open('https://drive.google.com/file/d/1SWXpejQXAzTf_rSRM2bH3WQ63EANR-U9/view?usp=sharing', '_blank');
			}
		}
	}
}

export function main(coord, context, cursor, buffer) {

	//Character Density Display Logic
	const t = context.time * 0.00005
	const m = min(context.cols, context.rows)
	const st = {
		x : 2.0 * (coord.x - context.cols / 2) / m,
		y : 2.0 * (coord.y - context.rows / 2) / m,
	}
	st.x *= context.metrics.aspect

	const centerA = mulN(vec2(cos(t*3), sin(t*7)), 0.5)
	const centerB = mulN(vec2(cos(t*5), sin(t*4)), 0.5)

	const A = dist(st, centerA)
	const B = atan2(centerB.y-st.y, centerB.x-st.x)

	const aMod = map(cos(t*2.12), -1, 1, 6, 60)
	const bMod = map(cos(t*3.33), -1, 1, 6, 60)
	//const aMod = 27
	//const bMod = 29

	const a = cos(A * aMod)
	const b = cos(B * bMod)

	const i = ((a * b) + 1) / 2 // mult
	//const i = ((a + b) + 2) / 4 // sum
	const idx = floor(i * density.length)



	//cursor displays unless hovering over link
	return (activeLink == -1 && coord.x == Math.floor(cursor.x) && coord.y == Math.floor(cursor.y)) ? '█' :

	//Text Scroller
	coord.y === 0 ? scrollingText[((coord.x - Math.floor(scrollCounter)) % scrollingText.length + scrollingText.length) % scrollingText.length] :
	//menu line
	coord.x === 30 ? '|' :

	coord.y === 1 ? ' ' :
	//right area
	coord.x > 30 ? density[idx] :

	//check if character within bounds of menu array
	//check if y value is within bounds of menu array based on offset and length of array
	(coord.y >= menuTextyOffset && coord.y < arr.length + menuTextyOffset &&
	//check if x value is within bounds of menu array based on offset and length of given string in array
	coord.x < arr[coord.y - menuTextyOffset].length + menuTextxOffset && coord.x >= menuTextxOffset) ?

		//check if character is part of activeLink
		activeLink != -1 && coord.y === menuTextyOffset + links[activeLink] && coord.x >= menuTextxOffset && coord.x <= menuTextxOffset + arr[links[activeLink]].length ?
		
		//character is in activeLink
		{
			char : arr[coord.y - menuTextyOffset].charAt(coord.x - menuTextxOffset),
			color : css(66, 66, 112),
			backgroundColor : css(195, 195, 219) // r, g, b are floats
		} :
		//character is not in activeLink
		{
			char : arr[coord.y - menuTextyOffset].charAt(coord.x - menuTextxOffset),
			color : css(195, 195, 219),
			backgroundColor : css(66, 66, 112) // r, g, b are floats
		} : ' '
}