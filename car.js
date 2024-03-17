// The purpose of the Car class is to encapsulate the properties and behavior of a car object. It allows you to create multiple car instances
//  with different positions and sizes, and you can draw each car independently on the canvas by calling the draw() method
//  with the appropriate drawing context (ctx). This way, you can easily manage and draw multiple cars on the canvas
//  for your self-driving car simulation.




class Car{
    //These are the properties of car where should the car be and how big the car should be
    constructor(x,y,width,height,controlType,maxSpeed=3){
        //we store these inside object so it can remember
        this.x = x; //this line assigns the value of the x parameter to the x property of the current instance of the Car class. The this keyword refers to the current instance being created.
        this.y = y;
        this.height = height;
        this.width = width;
        this.speed = 0;
        this.acceleration = 0.2;
        this.maxspeed = maxSpeed; //for the dummy cars the speed value is passed in main.js
        this.friction = 0.05;
        this.angle = 0;
        this.damaged=false;


        this.useBrain=controlType=="AI";


        if(controlType!="DUMMY"){
            this.sensor = new Sensor(this);
            this.brain= new NeuralNetwork(    //4 output layer forward  backward lweft and right
                [this.sensor.rayCount,6,4]    //6 hidden layer
            );
        }
        this.controls = new Controls(controlType);






    }


    //---------------MOVEMENT OF CAR -----------
    // this function is called in loop in the animate() method using requestAnimationFrame()
    update(roadBorders,traffic){


        if(!this.damaged){
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders,traffic);
            // this.sensor.update(roadBorders);
        }
        if(this.sensor){
            this.sensor.update(roadBorders,traffic);
            const offsets=this.sensor.readings.map(
                s=>s==null?0:1-s.offset
            );
            const outputs=NeuralNetwork.feedForward(offsets,this.brain);
               
            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.reverse=outputs[3];
            }


        }
    }


    //This method is used for Collision detection
    #assessDamage(roadBorders,traffic){
        for (let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for (let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }




    //This method can be used to change the shape of the car by changing the below values
    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
         });
         points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
         });
         points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
         });
         points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
         });
         return points;


    }




    #move(){


        // ---- Straight and Reverse Movement ------


        if(this.controls.forward){


            this.speed += this.acceleration;
            // this.y -= 2; //y increases downwards
        }
        if(this.controls.reverse){
            // this.y += 2;
            this.speed -= this.acceleration;
        }
        if(this.speed>this.maxspeed){
            this.speed = this.maxspeed;
        }
        if(this.speed< -this.maxspeed){
            this.speed = -this.maxspeed/2;
        }


        if(this.speed>0){
            this.speed -= this.friction;
        }
        if(this.speed<0){
            this.speed += this.friction;
        }


        // if the speed of the car come less than 0 the speed of friction is constantly being added which will lead the car to move continuously
        // so if the speed of the car comes less than the friction tha car will stop
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }


        // ----- Left and Right Controls -----


        // this function is to flip the controls while reversing the car
        if(this.speed!=0){
            const flip = this.speed > 0? 1:-1;
            if(this.controls.left){
                this.angle += 0.03*flip;
            }
            if(this.controls.right){
                this.angle -= 0.03*flip;
            }
        }




        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed; // this only makes the car go either forward or backward


    }
 
   


    // ---------- CAR DRAWING ---------
    //draw method gets context as parameter
    // draw(ctx){


        // ctx.save();
        // ctx.translate(this.x,this.y);
        // ctx.rotate(-this.angle);


        // ctx.beginPath(); // This line begins a new drawing path , a path is a sequence of point or shapes that the canvas uses to draw something


        // The ctx.rect() method we define a rectangle using coordinates and dimensions. x and y are the coordinates and height width or the dimensions


        // ctx.rect(
        //     this.x-this.width/2, // this.x is the x cordinate of the centre of the car ,by subtracting this.width/2 we move the starting x coordinate of the rectangle to the left by half of the rectangles's width so it will be in centre
        //     this.y-this.height/2,


            //after using the translate function automatically tha point comes there


        //     -this.width/2,
        //     -this.height/2,
        //     this.width,
        //     this.height
        // );
        // ctx.fill(); // This line fills the defined rectangle path


        // ctx.restore();
        //INSTEAD of the above code we draw car using the create polygon method
       
        draw(ctx,color,drawSensor=false){
        if(this.damaged){               //changes colour immediately if it touches border
            ctx.fillStyle="grey";
        }else{
            ctx.fillStyle=color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();




        // ctx.restore();




        if(this.sensor && drawSensor ){                    //if dummy doesnt draw sensors
            this.sensor.draw(ctx);
        }


    }
}
