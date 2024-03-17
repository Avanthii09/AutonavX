class Road{


    constructor(x,width,laneCount=3){
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;


        this.left = x-width/2;
        this.right = x+width/2;


        const infinity = 10000000;
        this.top = -infinity;
        this.bottom = infinity;


        // To track where the borders is , we use array here because now we only 2 borders but later more borders can be added
        const topLeft = {x:this.left,y:this.top};
        const topRight = {x:this.right,y:this.top};
        const bottomLeft = {x:this.left,y:this.bottom};
        const bottomRight = {x:this.right,y:this.bottom};
        this.borders = [
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ];
    }


    // To Find centre of the line  ******


    getLaneCentre(laneIndex){
        // Gives the centre of the lane
        const laneWidth = this.width/this.laneCount;
        //return the index of the lane  
        // Min func : if there are 3 lanes and if we specify four it shouldnt go outside the canvas so to keep it inside the canvas we specify this
        return this.left+laneWidth/2 +
            Math.min(laneIndex,this.laneCount-1)*laneWidth


    }


    draw(ctx){


        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";


        //Drawing line in the left side of the screen


        //***** */
        for(let i=1;i<=this.laneCount-1;i++){
            const x = lerp(
                this.left,
                this.right,
                i/this.laneCount
            );
           
            //Adding Dashes in middle of line
   
            ctx.setLineDash([20,20])
            ctx.beginPath();
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            ctx.stroke();


        }


        ctx.setLineDash([]);
        this.borders.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x,border[0].y);
            ctx.lineTo(border[1].x,border[1].y);
            ctx.stroke();


        });




    }


}
