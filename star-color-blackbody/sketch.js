let c = 299792458
let h = 6.62607004E-34
let kb = 1.38064852E-23
let temp;
let aSlider;

function setup() {
  canvas = createCanvas(.9*windowWidth, .7*windowHeight);
  canvas.parent('sketch-holder');

  containerDiv = createDiv()
  containerDiv.parent('sketch-holder')
  //containerDiv.style('width', '500 px' )

  aSlider = createSlider(2000,15000,5000,1);
  aSlider.parent(containerDiv);
  aSlider.style('width', width*.33+'px');
  background(250);
  frameRate(30);
  //lets make an array to fill
  aTextBox = createInput('');
  aTextBox.parent('sketch-holder');
  aTextBox.position(50,40);
  aTextBox.size(80)

  aTextBox.class('sim-textbox')
  //aTextBox.style('height','40px')
  aSlider.position(aTextBox.x, aTextBox.y+100)
aSlider.input(sliderChange);
aSlider.class("sim-slider");

aTextBox.value(aSlider.value());

button = createButton('Set Temperature');
button.parent('sketch-holder');
button.position(aTextBox.x + aTextBox.width+30, aTextBox.y);
button.class('sim-button ')
button.mousePressed(updateValue);

y = new Array(1000);
}


function draw() {
  background(255)
  stroke(0)
  //move things to the middle
  rgb = temptoRGB(aSlider.value())
  temp = aSlider.value();


    push()
    fill(0)
    rect(width-height/3,0,height/3,height/3)
    fill(color(rgb['red'],rgb['green'],rgb['blue']))
    noStroke()
    translate(width-height/6,height/6)
    circle(0,0,100)
    pop()




    lambdaStart = 370;
    lambdaEnd = 750;
    // for (i = lambdaStart;i<lambdaEnd;i++) {
    //   push()
    // specColor = getRGB(i)
    // stroke(specColor)
    // //xscaled = map(x,0,y.length,0,width)
    // lambdaScaled = map(i,lambdaStart,lambdaEnd,370*width/y.length,750*width/y.length)
    // line(lambdaScaled,.8*height,lambdaScaled,.9*height)
    // pop()
    // }


        fill(color(rgb['red'],rgb['green'],rgb['blue']));
        textAlign(CENTER);
        textSize(32);
        text(temp+' K', width-height/6, 50);

    fill(100)
    noStroke()
    textSize(18)
    text('2000 K', aSlider.x, aSlider.y+20)
    text('15000 K', aSlider.x+width*.33-10, aSlider.y+20)
    translate(0, .9*height)
    //x axis
    stroke(1)
    line(0, 0, width, 0)

    //stroke('red')
    //calculate this points
    calcFunction();
    //display discrete points
    renderPoints();
    //display connected line
    //renderLine();

    peakLambda = .002897771955/temp*1E9;
    peakLambdaScaled = peakLambda*width/y.length
    stroke(180)
    fill(0)
    //ellipse(peakLambdaScaled,0,30,30)
    line(peakLambdaScaled,0,peakLambdaScaled,-height/2)
    noStroke()
    textSize(24);
    text('Max λ = '+peakLambda.toFixed(0)+' nm',peakLambdaScaled,35 )


}

function calcFunction() {
  //this function fills the aray with values
  for (var x = 0; x < y.length; x += 1) {
    let lambda = (1+x)*1E-9
    y[x] = 1.5E-12*(2*h*pow(c,2)/pow(lambda,5))*(1/(exp((h*c)/(lambda*kb*temp))-1))
  }

}

function renderPoints() {
  //this function puts ellipses at all the positions defined above.
  noStroke()

  for (var x = 0; x < y.length; x += 4) {

    yscaled = map(y[x],0,max(y),0,height/2)
    xscaled = map(x,0,y.length,0,width)

    specColor = getRGB(x)
    if (x >= 370 && x <= 750){
      fill(specColor);
      stroke(specColor)

    }
    else if (x < 370){
      fill(255)
      stroke('violet')
    }
    else if (x > 750){
      fill(255)
      stroke('red')
    }
    ellipse(xscaled, -yscaled, 8, 8);

  }

}

function renderLine() {
  //this function puts a line through all the positions defined above.

  push();
  noFill();
  stroke('blue');

  beginShape();
  for (var x = 0; x < y.length; x += 2) {
    yscaled = map(y[x],0,max(y),0,height/2)
    xscaled = map(x,0,y.length,0,width)
    curveVertex(xscaled, -yscaled);
  }
  endShape();
  pop();
}

function updateValue(){
  aSlider.value(aTextBox.value())
}

function sliderChange() {
  aTextBox.value(aSlider.value());
}

function temptoRGB(kelvin) {

  //from https://github.com/neilbartlett/color-temperature

  var temperature = kelvin / 100.0;
  let red, green, blue;

  if (temperature < 66.0) {
    red = 255;
  } else {
    // a + b x + c Log[x] /.
    // {a -> 351.97690566805693`,
    // b -> 0.114206453784165`,
    // c -> -40.25366309332127
    //x -> (kelvin/100) - 55}
    red = temperature - 55.0;
    red = 351.97690566805693+ 0.114206453784165 * red - 40.25366309332127 * Math.log(red);
    if (red < 0) red = 0;
    if (red > 255) red = 255;
  }

  /* Calculate green */

  if (temperature < 66.0) {

    // a + b x + c Log[x] /.
    // {a -> -155.25485562709179`,
    // b -> -0.44596950469579133`,
    // c -> 104.49216199393888`,
    // x -> (kelvin/100) - 2}
    green = temperature - 2;
    green = -155.25485562709179 - 0.44596950469579133 * green + 104.49216199393888 * Math.log(green);
    if (green < 0) green = 0;
    if (green > 255) green = 255;

  } else {

    // a + b x + c Log[x] /.
    // {a -> 325.4494125711974`,
    // b -> 0.07943456536662342`,
    // c -> -28.0852963507957`,
    // x -> (kelvin/100) - 50}
    green = temperature - 50.0;
    green = 325.4494125711974 + 0.07943456536662342 * green - 28.0852963507957 * Math.log(green);
    if (green < 0) green = 0;
    if (green > 255) green = 255;

  }

  /* Calculate blue */

  if (temperature >= 66.0) {
    blue = 255;
  } else {

    if (temperature <= 20.0) {
      blue = 0;
    } else {

      // a + b x + c Log[x] /.
      // {a -> -254.76935184120902`,
      // b -> 0.8274096064007395`,
      // c -> 115.67994401066147`,
      // x -> kelvin/100 - 10}
      blue = temperature - 10;
      blue = -254.76935184120902 + 0.8274096064007395 * blue + 115.67994401066147 * Math.log(blue);
      if (blue < 0) blue = 0;
      if (blue > 255) blue = 255;
    }
  }

  return {red: Math.round(red), blue: Math.round(blue), green: Math.round(green)};
}

function getRGB(Wavelength) {
    let Red;
    let Green;
    let Blue;
    if (Wavelength >= 380 && Wavelength<440)
    	{
        Red = -(Wavelength - 440) / (440 - 380);
        Green = 0.0;
        Blue = 1.0;
    	}
  		else if (Wavelength >= 440 && Wavelength<490)
      {
        Red = 0.0;
        Green = (Wavelength - 440) / (490 - 440);
        Blue = 1.0;
    	}
  		else if (Wavelength >= 490 && Wavelength<510)
      {
        Red = 0.0;
        Green = 1.0;
        Blue = -(Wavelength - 510) / (510 - 490);
  	  }
  		else if (Wavelength >= 510 && Wavelength<580)
      {
        Red = (Wavelength - 510) / (580 - 510);
        Green = 1.0;
        Blue = 0.0;
  	  }
  		else if(Wavelength >= 580 && Wavelength<645)
      {

        Red = 1.0;
        Green = -(Wavelength - 645) / (645 - 580);
        Blue = 0.0;
    	}
  		else if (Wavelength >= 645 && Wavelength<781)
      {
        Red = 1.0;
        Green = 0.0;
        Blue = 0.0;
    	}
  		else{

        Red = 0.0;
        Green = 0.0;
        Blue = 0.0;
    	};

    // Let the intensity fall off near the vision limits

    if((Wavelength >= 380) && (Wavelength<420)){
        factor = 0.3 + 0.7*(Wavelength - 380) / (420 - 380);
    }else if((Wavelength >= 420) && (Wavelength<701)){
        factor = 1.0;
    }else if((Wavelength >= 701) && (Wavelength<781)){
        factor = 0.3 + 0.7*(780 - Wavelength) / (780 - 700);
    }else{
        factor = 0.0;
    };
  return cc = color(Red*255*factor,Green*255*factor,Blue*255*factor)
}

// function touchMoved() {
//   // do some stuff
//   return false;
// }
