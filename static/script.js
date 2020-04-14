
// window.onload = function() { }
$(window).on("load", function () {
    $(".loader-wrapper").fadeOut("slow");
});

var canvas = document.getElementById("paint");
document.getElementById("paint").style.cursor = "crosshair";
var ctx = canvas.getContext("2d");
var imgs = document.getElementById("imagetest");
var imgrealwidth = imgs.width;
var imgrealheight = imgs.height;
var width = canvas.width;
var height = canvas.height;
// canvas.width = width;
// canvas.height = height;
var curX, curY, prevX, prevY;
var hold = false;
ctx.lineWidth = 3;
var defaultlinewidth = ctx.lineWidth;
var fill_value = true;
var stroke_value = false;
var canvas_data = { "pencil": [], "rectangle": [] }
var x = document.getElementById("showcoordinate");
var clientX = 0.0;
var clientY = 0.0;

canvas.addEventListener('mousemove', function (e) {
    clientX = e.offsetX;
    clientY = e.offsetY;
    document.getElementById("coordinatex").innerHTML = clientX;
    document.getElementById("coordinatey").innerHTML = clientY;
});

function color(color_value) {
    ctx.strokeStyle = color_value;
    ctx.fillStyle = color_value;
}

function add_pixel() {
    ctx.lineWidth += 1;
    defaultlinewidth += 1;
    document.getElementById("currentlw").innerHTML = defaultlinewidth;
}

function reduce_pixel() {
    if (ctx.lineWidth == 1) {
        ctx.lineWidth = 1;
        defaultlinewidth = 1;
    }
    else {
        ctx.lineWidth -= 1;
        defaultlinewidth -= 1;
        document.getElementById("currentlw").innerHTML = defaultlinewidth;
    }
}

function reset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // generatecanvas();
    ctx.drawImage(imgs, 0, 0, width, height); //draw the image upon reset, which is called on load
    // canvas_data = { "pencil": [], "line": [], "rectangle": [], "circle": [], "eraser": [] }
    canvas_data = { "pencil": [], "rectangle": [] }

    canvas.onmousemove = function (e) {
        x.style.display = "inline";
    };

    canvas.onmouseout = function (e) {
        x.style.display = "none";
    }

}

function rectangle() {
    fill_value = false;
    stroke_value = true;
    // color('#EE0000');
    if (labelarray.length == 0) {
        alert("Please create a label first!");
    } else {
        if (ctx.fillStyle == "#000000") {
            alert("Please choose a color based on the label!")
        } else {
            canvas.onmousedown = function (e) {
                img = ctx.getImageData(0, 0, width, height); //supposed to be width & height var, but changed so that it takes the width and height realtime
                prevX = e.offsetX;
                prevY = e.offsetY;
                //prevX = e.clientX - canvas.offsetLeft;
                //prevY = e.clientY - canvas.offsetTop;
                hold = true;
            };

            canvas.onmousemove = function (e) {
                x.style.display = "inline";
                if (hold) {
                    ctx.putImageData(img, 0, 0);
                    curX = e.offsetX - prevX;
                    curY = e.offsetY - prevY;
                    ctx.strokeRect(prevX, prevY, curX, curY);
                }
            };

            canvas.onmouseup = function (e) {
                hold = false;
                var realendx = curX + prevX;
                var realendy = curY + prevY;

                var startxcalc = imgrealwidth * prevX;
                var startycalc = imgrealheight * prevY;
                var endxcalc = imgrealwidth * realendx;
                var endycalc = imgrealheight * realendy;

                var finalstartxcalc = startxcalc / width;
                var finalstartycalc = startycalc / height;
                var finalendxcalc = endxcalc / width;
                var finalendycalc = endycalc / height;
                for (var i = 0; i < labelarray.length; i++) {
                    if (ctx.fillStyle == labelarray[i].value) {
                        canvas_data.rectangle.push({"label": labelarray[i].label, "starx": finalstartxcalc, "stary": finalstartycalc, "endx": finalendxcalc, "endy": finalendycalc, "recwidth": curX, "recheight": curY, "thick": ctx.lineWidth, "stroke": stroke_value, "stroke_color": ctx.strokeStyle });
                    }else{}
                }
            };

            canvas.onmouseout = function (e) {
                hold = false;
                x.style.display = "none";
            };
        }
    }

}

function fill() {
    fill_value = true;
    stroke_value = false;
}

function outline() {
    fill_value = false;
    stroke_value = true;
}

function pencil() {
    if (labelarray.length == 0) {
        alert("Please create a label first!");
    } else {
        if (ctx.fillStyle == "#000000") {
            alert("Please choose a color based on the label!")
        } else {
            canvas.onmousemove = function (e) {
                x.style.display = "inline";
            };

            canvas.onmousedown = function (e) {
                // getPosition(e); 
                curX = e.offsetX;
                curY = e.offsetY;
                //curX = e.clientX - canvas.offsetLeft;
                //curY = e.clientY - canvas.offsetTop;
                drawCoordinates(curX, curY);

                prevX = curX;
                prevY = curY;
                // // ctx.beginPath();
                // // ctx.moveTo(prevX, prevY);
            };
            canvas.onmouseout = function (e) {
                x.style.display = "none";
            }
        }
    }
    // var pointSize = 3;
    function drawCoordinates(x, y) {
        // ctx.fillStyle = "#ff2626";
        ctx.beginPath();
        ctx.arc(x, y, ctx.lineWidth, 0, Math.PI * 2, true);
        ctx.fill();

        var xcalculation = imgrealwidth * curX;
        var ycalculation = imgrealheight * curY;
        var finalxcalculation = xcalculation / width;
        var finalycalculation = ycalculation / height;

        for (var i = 0; i < labelarray.length; i++) {
            if (ctx.fillStyle == labelarray[i].value) {
                canvas_data.pencil.push({ "label": labelarray[i].label, "startx": finalxcalculation, "starty": finalycalculation, "thick": ctx.lineWidth, "color": ctx.strokeStyle });
            } else {}
        }
        //canvas_data.pencil.push({ "startx": finalxcalculation, "starty": finalycalculation, "thick": ctx.lineWidth, "color": ctx.strokeStyle });
    }
}

function save() {
    var filename = document.getElementById("fname").value;
    var data = JSON.stringify(canvas_data);
    var image = canvas.toDataURL();

    if (filename == "") {
        alert("Image name must be filled!");

    } else {

        $.post("/profile", { save_fname: filename, save_cdata: data, save_image: image });
        alert(filename + " saved");
    }
    // else {
    //     $.post("/"+imagename.value,{imagename:imagename.value, string:JSON.stringify(data)});
    // 	alert("saved");
    // }
}

function alerttest() {
    alert("success! image width :" + imgrealwidth + "and height : " + imgrealheight);
}
// var labelarray = {namelabel,colorvalue};
// labelarray.push("hello");


var labelarray = [];


function addlabel() {
    var labellist = document.getElementById("labellist");
    var labelname = document.getElementById("labelname").value;

    if (labelname == "") {
        alert("Label name must be filled!");
    } else {
        var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

        labelarray.push({ label: labelname, value: randomColor });
        labellist.style.display = "inline";
        //<table border = "1" cellpadding = "5" cellspacing = "5">
        var html = "<table border = '3' bordercolor = '#333' cellpadding = '5' cellspacing = '5' ><th>Label Name</th><th>Color</th>";

        //VIEWING THE TABLE
        for (var i = 0; i < labelarray.length; i++) {
            html += "<tr>";
            html += "<td>" + labelarray[i].label + "</td>";
            html += "<td><button style='background-color:" + labelarray[i].value + "; height: 20px; width: 20px'" + 'onclick=\'color("' + labelarray[i].value + '")\'>' + " " + "</button></td>";
            // html += "<td>" + rows[i].email + "</td>";

            html += "</tr>";

        }
        html += "</table>";
        document.getElementById("labellist").innerHTML = html;
    }
}

function testpusharray() {
    var labellist = document.getElementById("labellist");
    labellist.style.display = "inline";
    var rows = [{
        name: "John",
        age: 20,
        email: "xx@hotmail.com"
    }, {
        name: "Jack",
        age: 50,
        email: "xxx@hotmail.com"
    }, {
        name: "Son",
        age: 45,
        email: "xxxx@hotmail.com"
    }];

    var html = "<table border='1|1'>";
    for (var i = 0; i < rows.length; i++) {
        html += "<tr>";
        html += "<td>" + rows[i].name + "</td>";
        html += "<td>" + rows[i].age + "</td>";
        html += "<td>" + rows[i].email + "</td>";

        html += "</tr>";

    }
    html += "</table>";
    document.getElementById("labellist").innerHTML = html;
}

//commented, might be useful who knows
// var canvas_data = {"pencil": [], "line": [], "rectangle": [], "circle": [], "eraser": []}
//
// Record the mouse position when it moves.
// canvas.onmousemove = function (e)){
// }
//===============================
//PENCIL TOOL COMMENTS
// function draw(){
//     ctx.lineTo(curX, curY);
//     ctx.stroke();
//     canvas_data.pencil.push({ "startx": prevX, "starty": prevY, "endx": curX, "endy": curY, "thick": ctx.lineWidth, "color": ctx.strokeStyle });
// }
//
//inside function drawCoordinates(x, y)
//canvas_data.pencil.push({ "startx": prevX, "starty": prevY, "endx": curX, "endy": curY, "thick": ctx.lineWidth, "color": ctx.strokeStyle });
//
// function getPosition(event){
//  var rect = canvas.getBoundingClientRect();
//  var x = event.clientX - rect.left;
//  var y = event.clientY - rect.top;
//  drawCoordinates(x,y);
// }
//=======================================
// function generatecanvas(){
//     var resizewidth = document.getElementById("canvas-width");
//     var resizeheight = document.getElementById("canvas-height");

//     $.post("/resize", {canvaswidth : resizewidth, canvasheight: resizeheight});
//     alert("Canvas set to " + resizewidth + "width and " + resizeheight + "height");
// }
//==========================================
//from RECTANGLE TOOL canvas.onmousemove
//
//previous drawing method          
//curX = e.clientX - canvas.offsetLeft - prevX;
//curY = e.clientY - canvas.offsetTop - prevY;
// if (fill_value) {
//     ctx.fillRect(prevX, prevY, curX, curY);
// }
//canvas_data.rectangle.push({ "starx": prevX, "stary": prevY, "width": curX, "height": curY, "thick": ctx.lineWidth, "stroke": stroke_value, "stroke_color": ctx.strokeStyle, "fill": fill_value, "fill_color": ctx.fillStyle });
//
//===========================================
// var image = new Image();
//     console.log(image);
//     image.onload = function(e) {
//         ctx.canvas.width = image.width;
//         ctx.canvas.height = image.height;
//         c.width = image.width;
//         c.height = image.height;
//         ctx.drawImage(image, 0, 0);
//         console.log(labels);
//         for (i = 0; i < labels.length; i++){
//             drawLabels(labels[i].id, labels[i].xMin, labels[i].xMax, labels[i].yMin, labels[i].yMax);
//         }
//     };
//     image.style.display="block";
//     image.src = "image/{{ image }}";
//     var clicked = false;
//       var fPoint = {};
//       c.onclick = function(e) {
//         console.log(clicked);
//         if (!clicked) {
//             var x = (image.width / c.scrollWidth) * e.offsetX;
//             var y = (image.height / c.scrollHeight) * e.offsetY;
//             console.log(e);
//             ctx.strokeStyle = "pink";
//             ctx.fillStyle = "pink";
//             ctx.beginPath();
//             ctx.arc(x, y, 3, 0, 2*Math.PI, false);
//             ctx.fill();
//             fPoint = {
//               x: x,
//               y: y
//             };
//         } else {
//             var x = (image.width / c.scrollWidth) * e.offsetX;
//             var y = (image.height / c.scrollHeight) * e.offsetY;
//             var xMin;
//             var xMax;
//             var yMin;
//             var yMin;
//             if (x > fPoint.x) {
//                 xMax = x;
//                 xMin = fPoint.x;
//             } else {
//                 xMax = fPoint.x;
//                 xMin = x;
//             }
//             if (y > fPoint.y) {
//               yMax = y;
//               yMin = fPoint.y;
//             } else {
//               yMax = fPoint.y;
//               yMin = y;
//             }
//             fPoint = {};
//             window.location.replace("/add/" + (labels.length + 1) +
//             "?xMin=" + xMin +
//             "&xMax=" + xMax +
//             "&yMin=" + yMin +
//             "&yMax=" + yMax);
//         }
//         clicked = !clicked;
//       };
