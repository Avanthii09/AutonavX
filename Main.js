// ------------------ CANVAS ------------


// Here we used js to set the size of the canvas coz it will dynamically adjust to the screen size while css will be better suited for static styles
const carCanvas = document.getElementById("carCanvas");
// canvas.height = window.innerHeight; //this sets the height of the canvas element to the height of the browser window so it will cover the entire vertical space
carCanvas.width = 300; //width is set to 200 pixels




const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;


//------------------- CAR ------------------


// to draw the car we need a drawing context first
// getContext() method is a crucial part of the HTML canvas API, and it allows you to access a 2D or 3D rendering context, depending on the argument you pass to it.
const carCtx = carCanvas.getContext("2d");
// here we get the 2d drawing context of the canvas element and store it in the ctx variable. Now we can use ctx variable to draw and manipulate shapes lines colors on the canvas
// ctx is reference to the drawing context
const networkCtx = networkCanvas.getContext("2d");




const road = new Road(carCanvas.width/2 , carCanvas.width*0.9);


// const car = new Car(road.getLaneCentre(1),100,30,50,"KEYS"); //KEYS is added to avoid when a new car is
                                                            //the key listners are overwritten from the orginal car
const N=500;                                                            
const cars= generateCars(N);
let bestCar=cars[0];
if (localStorage.getItem("bestBrain")){
    for (let i=0;i<cars.length;i++){
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain"));
        if (i!=0){
             NeuralNetwork.mutate(cars[i].brain,0.2);


        }  


    }
 
}




//Array of cars
const traffic = [
    new Car(road.getLaneCentre(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCentre(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCentre(2),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCentre(0),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCentre(1),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCentre(1),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCentre(2),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCentre(2),-1000,30,50,"DUMMY",2),
    new Car(road.getLaneCentre(2),-900,30,50,"DUMMY",2),
    new Car(road.getLaneCentre(1),-1000,30,50,"DUMMY",2),




];




animate();




function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));


}


function discard(){
    localStorage.removeItem("bestBrain");
}


function generateCars(N){
    const cars =[];
    for (let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCentre(1),100,30,50,"AI"))
    }
    return cars;


}


function animate(time){
    for(let i=0;i<traffic.length;i++){     //for all cars to update and keep in mind roadborders
        traffic[i].update(road.borders,[]);
    }


    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic); //for the sensor to know where the car is withe respect to roadborders and traffic


    }


    //Finding the min y value of all the y values of the cars
    // Here we are using y, other functions can also be used.
    // These are called fitness functions


    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );
    carCanvas.height = window.innerHeight;  // previously given in the top changed here so the height of the canvas changes dynamically with respect to the car
    networkCanvas.height = window.innerHeight;


    carCtx.save();  // for following the car
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7); // for following the car
   


    road.draw(carCtx)
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha=0.2;
    for (let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"orange");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"orange",true);


    carCtx.restore() ; // for following the car




    // networkCtx.lineDashOffset=time/50;  //feetforward algo. These lines are travelling backwards  
    networkCtx.lineDashOffset=-time/50;  //now the lines are moving forward
    Visualizer.drawNetwork(networkCtx,bestCar.brain);




    requestAnimationFrame(animate)
    // requestAnimateFrame calls the animate method many times per second it gives the illusion of movement that we want.


}
