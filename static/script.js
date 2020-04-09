


// window.onload = function() { 
var canvas = document.getElementById("paint");
var ctx = canvas.getContext("2d");
var imgs = document.getElementById("imagetest");

// }
var width = canvas.width;
var height = canvas.height;
var curX, curY, prevX, prevY;
var hold = false;
ctx.lineWidth = 3;
var fill_value = true;
var stroke_value = false;
// var canvas_data = {"pencil": [], "line": [], "rectangle": [], "circle": [], "eraser": []}
var canvas_data = { "rectangle": []}
var image = new Image();
    console.log(image);
    image.onload = function(e) {
        ctx.canvas.width = image.width;
        ctx.canvas.height = image.height;
        c.width = image.width;
        c.height = image.height;
        ctx.drawImage(image, 0, 0);
        console.log(labels);
        for (i = 0; i < labels.length; i++){
            drawLabels(labels[i].id, labels[i].xMin, labels[i].xMax, labels[i].yMin, labels[i].yMax);
        }
    };
    image.style.display="block";
    image.src = "image/{{ image }}";
    var clicked = false;
      var fPoint = {};
      c.onclick = function(e) {
        console.log(clicked);
        if (!clicked) {
            var x = (image.width / c.scrollWidth) * e.offsetX;
            var y = (image.height / c.scrollHeight) * e.offsetY;
            console.log(e);
            ctx.strokeStyle = "pink";
            ctx.fillStyle = "pink";
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2*Math.PI, false);
            ctx.fill();
            fPoint = {
              x: x,
              y: y
            };
        } else {
            var x = (image.width / c.scrollWidth) * e.offsetX;
            var y = (image.height / c.scrollHeight) * e.offsetY;
            var xMin;
            var xMax;
            var yMin;
            var yMin;
            if (x > fPoint.x) {
                xMax = x;
                xMin = fPoint.x;
            } else {
                xMax = fPoint.x;
                xMin = x;
            }
            if (y > fPoint.y) {
              yMax = y;
              yMin = fPoint.y;
            } else {
              yMax = fPoint.y;
              yMin = y;
            }
            fPoint = {};
            window.location.replace("/add/" + (labels.length + 1) +
            "?xMin=" + xMin +
            "&xMax=" + xMax +
            "&yMin=" + yMin +
            "&yMax=" + yMax);
        }
        clicked = !clicked;
      };


function color(color_value){
    ctx.strokeStyle = color_value;
    ctx.fillStyle = color_value;
}    
        
function add_pixel(){
    ctx.lineWidth += 1;
}
        
function reduce_pixel(){
    if (ctx.lineWidth == 1){
        ctx.lineWidth = 1;
    }
    else{
        ctx.lineWidth -= 1;
    }
}
        
function reset(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // canvas_data = { "pencil": [], "line": [], "rectangle": [], "circle": [], "eraser": [] }
    canvas_data = {"rectangle": []}
    rectangle();
}
          
// rectangle tool
        
function rectangle(){
    fill_value = false;
    stroke_value = true; 
    ctx.drawImage(imgs, 0, 0, 750, 450);
    color('#EE0000');
    canvas.onmousedown = function (e){
        img = ctx.getImageData(0, 0, width, height);
        prevX = e.clientX - canvas.offsetLeft;
        prevY = e.clientY - canvas.offsetTop;
        hold = true;
    };
            
    canvas.onmousemove = function (e){
        if (hold){
            ctx.putImageData(img, 0, 0);
            curX = e.clientX - canvas.offsetLeft - prevX;
            curY = e.clientY - canvas.offsetTop - prevY;
            ctx.strokeRect(prevX, prevY, curX, curY);
            if (fill_value){
                ctx.fillRect(prevX, prevY, curX, curY);
            }
            canvas_data.rectangle.push({ "starx": prevX, "stary": prevY, "width": curX, "height": curY, "thick": ctx.lineWidth, "stroke": stroke_value, "stroke_color": ctx.strokeStyle, "fill": fill_value, "fill_color": ctx.fillStyle });
            
        }
    };
            
    canvas.onmouseup = function(e){
        hold = false;
    };
            
    canvas.onmouseout = function(e){
        hold = false;
    };
}



function fill(){
    fill_value = true;
    stroke_value = false;
}
        
function outline(){
    fill_value = false;
    stroke_value = true;
}

// pencil tool
        
function pencil(){
        
    canvas.onmousedown = function(e){
        curX = e.clientX - canvas.offsetLeft;
        curY = e.clientY - canvas.offsetTop;
        hold = true;
            
        prevX = curX;
        prevY = curY;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
    };
        
    canvas.onmousemove = function(e){
        if(hold){
            curX = e.clientX - canvas.offsetLeft;
            curY = e.clientY - canvas.offsetTop;
            draw();
        }
    };
        
    canvas.onmouseup = function(e){
        hold = false;
    };
        
    canvas.onmouseout = function(e){
        hold = false;
    };
        
    function draw(){
        ctx.lineTo(curX, curY);
        ctx.stroke();
        canvas_data.pencil.push({ "startx": prevX, "starty": prevY, "endx": curX, "endy": curY, "thick": ctx.lineWidth, "color": ctx.strokeStyle });
    }
}
        
// line tool
        
function line(){
           
    canvas.onmousedown = function (e){
        img = ctx.getImageData(0, 0, width, height);
        prevX = e.clientX - canvas.offsetLeft;
        prevY = e.clientY - canvas.offsetTop;
        hold = true;
    };
            
    canvas.onmousemove = function linemove(e){
        if (hold){
            ctx.putImageData(img, 0, 0);
            curX = e.clientX - canvas.offsetLeft;
            curY = e.clientY - canvas.offsetTop;
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(curX, curY);
            ctx.stroke();
            canvas_data.line.push({ "starx": prevX, "starty": prevY, "endx": curX, "endY": curY, "thick": ctx.lineWidth, "color": ctx.strokeStyle });
            ctx.closePath();
        }
    };
            
    canvas.onmouseup = function (e){
         hold = false;
    };
            
    canvas.onmouseout = function (e){
         hold = false;
    };
}

// circle tool
function circle(){
            
    canvas.onmousedown = function (e){
        img = ctx.getImageData(0, 0, width, height);
        prevX = e.clientX - canvas.offsetLeft;
        prevY = e.clientY - canvas.offsetTop;
        hold = true;
    };
            
    canvas.onmousemove = function (e){
        if (hold){
            ctx.putImageData(img, 0, 0);
            curX = e.clientX - canvas.offsetLeft;
            curY = e.clientY - canvas.offsetTop;
            ctx.beginPath();
            ctx.arc(Math.abs(curX + prevX)/2, Math.abs(curY + prevY)/2, Math.sqrt(Math.pow(curX - prevX, 2) + Math.pow(curY - prevY, 2))/2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.stroke();
            if (fill_value){
               ctx.fill();
            }
            canvas_data.circle.push({ "starx": prevX, "stary": prevY, "radius": curX - prevX, "thick": ctx.lineWidth, "stroke": stroke_value, "stroke_color": ctx.strokeStyle, "fill": fill_value, "fill_color": ctx.fillStyle });
        }
    };
            
    canvas.onmouseup = function (e){
        hold = false;
    };
            
    canvas.onmouseout = function (e){
        hold = false;
    };
}
        
// eraser tool      
function eraser(){
    
    canvas.onmousedown = function(e){
        curX = e.clientX - canvas.offsetLeft;
        curY = e.clientY - canvas.offsetTop;
        hold = true;
            
        prevX = curX;
        prevY = curY;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
    };
        
    canvas.onmousemove = function(e){
        if(hold){
            curX = e.clientX - canvas.offsetLeft;
            curY = e.clientY - canvas.offsetTop;
            draw();
        }
    };
        
    canvas.onmouseup = function(e){
        hold = false;
    };
        
    canvas.onmouseout = function(e){
        hold = false;
    };
        
    function draw(){
        ctx.lineTo(curX, curY);
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
        canvas_data.pencil.push({ "startx": prevX, "starty": prevY, "endx": curX, "endy": curY, "thick": ctx.lineWidth, "color": ctx.strokeStyle });
    }    
}  

function save(){
    var filename = document.getElementById("fname").value;
    var data = JSON.stringify(canvas_data);
    var image = canvas.toDataURL();

    if(filename==""){
        alert("Image name must be filled!");

    }else{
    
    $.post("/profile", {save_fname: filename, save_cdata: data, save_image: image});
    alert(filename + " saved");
    }
    // else {
    //     $.post("/"+imagename.value,{imagename:imagename.value, string:JSON.stringify(data)});
	// 	alert("saved");
	// }
} 

function alerttest(){
    alert("test alert succesfull!");
}