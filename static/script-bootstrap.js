$(window).on("load", function () {
    $(".loader-wrapper").fadeOut("slow");

});

//Canvas Variables
var canvas = document.getElementById("paint");
var svg = document.getElementById("svgovercanvas");
//svgc = svg.getContext("2d");
document.getElementById("paint").style.cursor = "cell";
var ctx = canvas.getContext("2d");
var clientX = 0.0;
var clientY = 0.0;
var curX, curY, prevX, prevY;
ctx.lineWidth = 3;
var height = canvas.height;
var width = canvas.width;
var canvas_data = { "pencil": [], "rectangle": [] }
var rectt = canvas.getBoundingClientRect();
var scaleX = canvas.width / rectt.width;   // relationship bitmap vs. element for X
var scaleY = canvas.height / rectt.height;

//IMAGE AND COLOR VARIABLES
var colorList = ["Push", "#EE0000", "#334CFF", "#52FF6D", "#AF5AFF", "#FF5A5A", "#FF7ECC", "#00C5FF", "#7EF5FF", "#FBFF00", "#FFBD00"];
var count2 = 0;
var hold = false;
var imgs = document.getElementById("imagetest");
var imgs2 = document.getElementById("imagetest2");
var imgrealwidth, imgrealheight;
var defaultlinewidth = 12;
var fill_value = false;
var stroke_value = true;
var pushimagename, pushlabel, pushstartx, pushstarty, pushendx, pushendy, pushtool, pushcolor;
var counterimage = 0;
var drawimage;
var recordannotation = 0;
var x = document.getElementById("showcoordinate");
var labelarray = [];
var imagearray = [];
var dottoolactive = false;
var rectoolactive = false;
var modaltitle, modalbody, modalfooter;
var dotovercanvas = "";
var rectovercanvas = "";


$(document).ready(function () {
    $('.imageclass').each(function (index, element) {
        imagearray.push($(element).text());
    });
    loadimage();

    document.getElementById("totalimagenumber").innerHTML = imagearray.length;
    document.getElementById("recordannotation").innerHTML = recordannotation;
});

svg.addEventListener('mousemove', function (e) {
    clientX = e.offsetX;
    clientY = e.offsetY;
    document.getElementById("coordinatex").innerHTML = clientX;
    document.getElementById("coordinatey").innerHTML = clientY;
});

svg.onmousemove = function (e) {
    x.style.display = "inline";
};

svg.onmouseout = function (e) {
    x.style.display = "none";
};

canvas.addEventListener('mousemove', function (e) {
    clientX = e.offsetX;
    clientY = e.offsetY;
    document.getElementById("coordinatex").innerHTML = clientX;
    document.getElementById("coordinatey").innerHTML = clientY;
});

canvas.onmousemove = function (e) {
    x.style.display = "inline";
};

canvas.onmouseout = function (e) {
    x.style.display = "none";
};

function dialog(message, yesCallback, noCallback) {
    $('.titlemessage').html(message);
    var dialog = $('#modal_dialog').dialog();

    $('#btnYes').click(function () {
        dialog.dialog('close');
        yesCallback();
    });
    $('#btnNo').click(function () {
        dialog.dialog('close');
        noCallback();
    });
    //     dialog('Are you sure you want to do this?',
    //     function() {
    //         // Do something
    //         alert("Hello Yes!");
    //     },
    //     function() {
    //         // Do something else
    //         alert("Hello No!");
    //     }
    // );
}

function loadimage() {
    var html = "";
    for (var i = 0; i < imagearray.length; i++) {
        html += "<img id='image" + i + "' src='static/images/" + imagearray[i] + "'>";
    }
    document.getElementById("listimages").innerHTML = html;
}

function nextimage() {
    ++counterimage;

    for (var i = 0; i < counterimage; i++) {
        if (counterimage <= imagearray.length) {
            drawimage = document.getElementById('image' + i);
            ctx.drawImage(drawimage, 0, 0, canvas.width, canvas.height);
            imgrealwidth = drawimage.width;
            imgrealheight = drawimage.height;
            pushimagename = imagearray[i];
        } else {
            counterimage = imagearray.length;
        }
    }
    document.getElementById("imagenumber").innerHTML = counterimage;
}

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
    ctx.drawImage(drawimage, 0, 0, canvas.width, canvas.height);
    canvas_data = { "pencil": [], "rectangle": [] }
    // svg.onmousedown = function (e) {
      
    
    // }
}

function warningmodal() {
    modaltitle = "You can't do that.";
    modalfooter = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
}

function callmodal() {
    document.getElementById("exampleModalLabel").innerHTML = modaltitle;
    document.getElementById("modalBody").innerHTML = modalbody;
    document.getElementById("modalFooter").innerHTML = modalfooter;
    $('#exampleModal').modal('toggle');
}


function rectangle() {
    if (labelarray.length == 0) {
        modalbody = "Please create a label first!";
        warningmodal();
        callmodal();
    } else {
        if (ctx.fillStyle == "#000000") {
            modalbody = "Please choose a color based on the label!";
            warningmodal();
            callmodal();
        } else {
            if (dottoolactive == true) {
                modalbody = "Pencil tool is active. Please refresh the page to change tools!";
                warningmodal();
                callmodal();
                // if (confirm("We detected annotations of Dot tool. Do you want to reset and switch to Rectangle tool?")) {
                //     reset();
                //     canvas.onmousedown = function (e) {
                //         rectoolactive = true;
                //         img = ctx.getImageData(0, 0, width, height);
                //         prevX = e.offsetX;
                //         prevY = e.offsetY;
                //         //prevX = e.clientX - canvas.offsetLeft;
                //         //prevY = e.clientY - canvas.offsetTop;
                //         hold = true;
                //     };

                //     canvas.onmousemove = function (e) {
                //         x.style.display = "inline";
                //         if (hold) {
                //             ctx.putImageData(img, 0, 0);
                //             curX = e.offsetX - prevX;
                //             curY = e.offsetY - prevY;

                //             ctx.strokeRect(prevX, prevY, curX, curY);
                //         }
                //     };

                //     canvas.onmouseup = function (e) {
                //         hold = false;
                //         var realendx = curX + prevX;
                //         var realendy = curY + prevY;

                //         var startxcalc = imgrealwidth * prevX;
                //         var startycalc = imgrealheight * prevY;
                //         var endxcalc = imgrealwidth * realendx;
                //         var endycalc = imgrealheight * realendy;

                //         var finalstartxcalc = startxcalc / width;
                //         var finalstartycalc = startycalc / height;
                //         var finalendxcalc = endxcalc / width;
                //         var finalendycalc = endycalc / height;
                //         for (var i = 0; i < labelarray.length; i++) {
                //             if (ctx.fillStyle.toUpperCase() == labelarray[i].value) {
                //                 pushlabel = labelarray[i].label;
                //                 pushstartx = finalstartxcalc;
                //                 pushstarty = finalstartycalc;
                //                 pushendx = finalendxcalc;
                //                 pushendy = finalendycalc;
                //                 pushtool = "Rectangle Tool";
                //                 pushcolor = labelarray[i].value;
                //                 savepost();
                //                 //canvas_data.rectangle.push({ "label": labelarray[i].label, "starx": finalstartxcalc, "stary": finalstartycalc, "endx": finalendxcalc, "endy": finalendycalc, "recwidth": curX, "recheight": curY, "thick": ctx.lineWidth, "stroke": stroke_value, "stroke_color": ctx.strokeStyle });
                //             }
                //         }
                //     };

                //     canvas.onmouseout = function (e) {
                //         hold = false;
                //         x.style.display = "none";
                //     };

                //}
            } else {
                canvas.onmousedown = function (e) {
                    img = ctx.getImageData(0, 0, width, height);
                    prevX = e.offsetX;
                    prevY = e.offsetY;
                    //prevX = e.clientX - canvas.offsetLeft;
                    //prevY = e.clientY - canvas.offsetTop;
                    hold = true;
                };

                canvas.onmousemove = function (e) {
                    x.style.display = "inline";
                    rectoolactive = true;
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
                        if (ctx.fillStyle.toUpperCase() == labelarray[i].value.toUpperCase()) {
                            pushlabel = labelarray[i].label;
                            pushstartx = finalstartxcalc;
                            pushstarty = finalstartycalc;
                            pushendx = finalendxcalc;
                            pushendy = finalendycalc;
                            pushtool = "Rectangle Tool";
                            pushcolor = labelarray[i].value;
                            savepost();
                            //canvas_data.rectangle.push({ "label": labelarray[i].label, "starx": finalstartxcalc, "stary": finalstartycalc, "endx": finalendxcalc, "endy": finalendycalc, "recwidth": curX, "recheight": curY, "thick": ctx.lineWidth, "stroke": stroke_value, "stroke_color": ctx.strokeStyle });
                        }
                    }
                    ++recordannotation;
                    document.getElementById("recordannotation").innerHTML = recordannotation;
                };

                canvas.onmouseout = function (e) {
                    hold = false;
                    x.style.display = "none";
                };
            }
        }
    }

}



//============================= SVG RECTANGLE ELEMENT!========================================== 
//var svgrectfinal >> no need to create global var bcs creating local var 
//without 'var' can be accessed globally.
const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
var rectcount = 0;

function rectelement() {
    if (labelarray.length == 0) {
        modalbody = "Please create a label first!";
        warningmodal();
        callmodal();
    } else {
        if (ctx.fillStyle == "#000000") {
            modalbody = "Please choose a color based on the label!";
            warningmodal();
            callmodal();
        } else {
            if (dottoolactive == true) {
                modalbody = "Pencil tool is active. Please refresh the page to change tools!";
                warningmodal();
                callmodal();

            } else {
                svg.onmousedown = function (e) {

                    prevX = e.offsetX;
                    prevY = e.offsetY;
                    hold = true;
                }

                svg.onmousemove = function (e) {
                    x.style.display = "inline";
                    rectoolactive = true;
                    if (hold) {
                        //ctx.putImageData(img, 0, 0);
                        curX = e.offsetX - prevX;
                        curY = e.offsetY - prevY;
                        //ctx.strokeRect(prevX, prevY, curX, curY);
                        
                        rect.setAttributeNS(null, 'x', prevX);
                        rect.setAttributeNS(null, 'y', prevY);
                        rect.setAttributeNS(null, 'width', curX);
                        rect.setAttributeNS(null, 'height', curY);
                        rect.setAttributeNS(null, 'fill', "none");
                        rect.setAttributeNS(null, 'stroke', ctx.strokeStyle);
                        rect.setAttributeNS(null, 'stroke-width', 5);

                        svg.appendChild(rect);
                        //document.getElementById("svgovercanvas").innerHTML = svgrect;
                        // svgrectfinal = svgrect;
                    }

                }

                svg.onmouseup = function (e) {
                    hold = false;
                    ++rectcount;
                    var realendx = curX + prevX;
                    var realendy = curY + prevY;

                    svg.removeChild(rect);
                    var svgrect = '<rect id=rectangle'+ rectcount  +' x="' + prevX + '" y="' + prevY + '" width="' + curX + '" height="' + curY + '" onmouseover="showrectelements(' + rectcount + ')" onmouseout="hiderectelements(' + rectcount + ')" fill="none" stroke="red" stroke-width="5"/>';
                    var svgrectborder = '<rect id=rectborder'+ rectcount  +' x="' + prevX + '" y="' + prevY + '" width="' + curX + '" height="' + curY + '" onmouseover="showrectelements(' + rectcount + ')" onmouseout="hiderectelements(' + rectcount + ')" style="fill:none;stroke-width:6;stroke:green;display:none" />';
                    var svgrectdel = '<circle style="display:none" id=rectdel' + rectcount +' cx="' + realendx + '" cy="' + realendy + '" r="10" fill="black" onclick="removerect(' + rectcount + ')" onmouseover="showrectelements(' + rectcount + ')" onmouseout="hiderectelements(' + rectcount + ')" />';
                    //alert(svgrect);
                    //alert(svgrectborder);
                    document.getElementById("svgovercanvas").innerHTML += svgrect;
                    document.getElementById("svgovercanvas").innerHTML += svgrectborder;
                    document.getElementById("svgovercanvas").innerHTML += svgrectdel;
                }

                canvas.onmousedown = function (e) {
                    img = ctx.getImageData(0, 0, width, height);
                    prevX = e.offsetX;
                    prevY = e.offsetY;
                    //prevX = e.clientX - canvas.offsetLeft;
                    //prevY = e.clientY - canvas.offsetTop;
                    hold = true;
                };

                canvas.onmousemove = function (e) {
                    x.style.display = "inline";
                    rectoolactive = true;
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
                        if (ctx.fillStyle.toUpperCase() == labelarray[i].value.toUpperCase()) {
                            pushlabel = labelarray[i].label;
                            pushstartx = finalstartxcalc;
                            pushstarty = finalstartycalc;
                            pushendx = finalendxcalc;
                            pushendy = finalendycalc;
                            pushtool = "Rectangle Tool";
                            pushcolor = labelarray[i].value;
                            savepost();
                            //canvas_data.rectangle.push({ "label": labelarray[i].label, "starx": finalstartxcalc, "stary": finalstartycalc, "endx": finalendxcalc, "endy": finalendycalc, "recwidth": curX, "recheight": curY, "thick": ctx.lineWidth, "stroke": stroke_value, "stroke_color": ctx.strokeStyle });
                        }
                    }
                    ++recordannotation;
                    document.getElementById("recordannotation").innerHTML = recordannotation;
                };

                canvas.onmouseout = function (e) {
                    hold = false;
                    x.style.display = "none";
                };
            }
        }
    }
}

function removerect(rectnum){
    var element = document.getElementById("rectangle" + rectnum);
    var element2 = document.getElementById("rectborder" + rectnum);
    var element3 = document.getElementById("rectdel" + rectnum);
    element.parentNode.removeChild(element);
    element2.parentNode.removeChild(element2);
    element3.parentNode.removeChild(element3);
   // svg.removeAttributeNS(element);
    rectelement();
}

function showrectelements(rectnum) {
    document.getElementById("rectborder" + rectnum).style.display = "inline";
    document.getElementById("rectdel" + rectnum).style.display = "inline";

    svg.onmousedown = function (e) {
        
    }
    svg.onmousemove = function (e) {
        
    }
    svg.onmouseup = function (e) {
        
    }
}

function hiderectelements(rectnum) {
    document.getElementById("rectborder" + rectnum).style.display = "none";
    document.getElementById("rectdel" + rectnum).style.display = "none";
    rectelement();
}
//========================================================================================



//============NEW SVG DOT SHOW HIDE DELETE FUNCTION================
// var svgdot = "";
var circlecount = 0;

function showelements(circlenum) {
    document.getElementById("circleborder" + circlenum).style.display = "inline";
    document.getElementById("circledel" + circlenum).style.display = "inline";

    svg.onmousedown = function (e) { //biar bs di klik pas tombol delete ditunjukan
        
    };
}

function hidelements(circlenum) {
    document.getElementById("circleborder" + circlenum).style.display = "none";
    document.getElementById("circledel" + circlenum).style.display = "none";

    dotelement(); //biar abis onmouseout, bisa langsung annotate lagi.
}

function delelements(circlenum) {
    //var element = document.getElementById("circle"+circlenum);
    //element.parentNode.removeChild(element);
    //element.remove();
    $("#circle" + circlenum).remove();
    $("#circleborder" + circlenum).remove();
    $("#circledel" + circlenum).remove();
}

function dotelement() {
    if (labelarray.length == 0) {
        modalbody = "Please create a label first!";
        warningmodal();
        callmodal();
    } else {
        if (ctx.fillStyle == "#000000" || ctx.fillstyle == "transparent") {
            modalbody = "Please choose a color based on the label!";
            warningmodal();
            callmodal();
        } else {
            if (rectoolactive == true) {
                modalbody = "Rectangle tool is currently active. Please refresh the page to change tools!";
                warningmodal();
                callmodal();

            } else {
                canvas.onmousemove = function (e) {
                    x.style.display = "inline";
                };

                svg.onmousedown = function (e) {
                    ++circlecount;
                    curX = e.offsetX;
                    curY = e.offsetY;
                    delbtnposX = curX + 10;
                    delbtnposY = curY - 10;
                    // svgdot = '<circle id=circle'+circlecount+' cx="'+ curX  +'" cy="'+  curY  +'" r="'+ defaultlinewidth  +'" fill="'+ ctx.fillStyle +'" onclick="removecircle('+ circlecount +')" />';
                    var svgdot = '<circle id=circle' + circlecount + ' cx="' + curX + '" cy="' + curY + '" r="' + defaultlinewidth + '" fill="' + ctx.fillStyle + '" onmouseover="showelements(' + circlecount + ')" onmouseout="hidelements(' + circlecount + ')" />';
                    var dotborder = '<circle style="display:none;z-index:2" id=circleborder' + circlecount + ' cx="' + curX + '" cy="' + curY + '" r="' + defaultlinewidth + '" fill="none" stroke="green" stroke-width="4" />';
                    var dotdel = '<circle style="display:none" id=circledel' + circlecount + ' cx="' + delbtnposX + '" cy="' + delbtnposY + '" r="10" fill="black" onclick="removecircle(' + circlecount + ')" onmouseover="showelements(' + circlecount + ')" onmouseout="hidelements(' + circlecount + ')" />';
                    
                    document.getElementById("svgovercanvas").innerHTML += svgdot; //append method using +=
                    document.getElementById("svgovercanvas").innerHTML += dotborder;
                    document.getElementById("svgovercanvas").innerHTML += dotdel;

                    ++recordannotation;
                    document.getElementById("recordannotation").innerHTML = recordannotation;

                }

                canvas.onmousedown = function (e) {
                    // getPosition(e); 
                    dottoolactive = true;
                    curX = e.offsetX;//* scaleX; //- canvas.offsetLeft;
                    curY = e.offsetY;//* scaleY;// -canvas.offsetTop;
                    newX = (e.clientX - rectt.left) * scaleX;
                    newY = (e.clientY - rectt.top) * scaleY;

                    //new2X = (e.clientX - rectt.left) / (rectt.right - rectt.left) * canvas.width;
                    //new2y= (e.clientY - rectt.top) / (rectt.bottom - rectt.top) * canvas.height;
                    // newX = e.clientX - canvas.left;
                    // newY = e.clientY - canvas.top;
                    dotovercanvas += '<div style="cursor:crosshair;position:absolute;width:7px;height:7px;top:' + curY + 'px;left:' + curX + 'px;border-radius:50%;background-color:' + ctx.fillStyle + '">   </div>';
                    dotovercanvas += '<button style="position:absolute;top:50px;right:350px">test</button>';
                    document.getElementById("overcanvas").innerHTML = dotovercanvas;


                    //curX = e.clientX - canvas.offsetLeft;
                    //curY = e.clientY - canvas.offsetTop;
                    // drawCoordinates(curX, curY);
                    ++recordannotation;
                    document.getElementById("recordannotation").innerHTML = recordannotation;
                    // prevX = curX;
                    // prevY = curY;
                    // // ctx.beginPath();
                    // // ctx.moveTo(prevX, prevY);
                };
                canvas.onmouseout = function (e) {
                    x.style.display = "none";
                };
            }
        }
    }
    function drawCoordinates(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, ctx.lineWidth, 0, Math.PI * 2, true);
        ctx.fill();

        var xcalculation = imgrealwidth * curX;
        var ycalculation = imgrealheight * curY;
        var finalxcalculation = xcalculation / width;
        var finalycalculation = ycalculation / height;

        for (var i = 0; i < labelarray.length; i++) {
            if (ctx.fillStyle.toUpperCase() == labelarray[i].value.toUpperCase()) {
                pushlabel = labelarray[i].label;
                pushstartx = finalxcalculation;
                pushstarty = finalycalculation;
                pushendx = 0;
                pushendy = 0;
                pushtool = "Dot Tool";
                pushcolor = labelarray[i].value;
                savepost();
                // alert(pushtool);
                //canvas_data.pencil.push({ "label": labelarray[i].label, "startx": finalxcalculation, "starty": finalycalculation, "thick": ctx.lineWidth, "color": ctx.strokeStyle });
            }
        }
    }
}

function removecircle(circlenum) {
    var element = document.getElementById("circle" + circlenum);
    var element2 = document.getElementById("circleborder"+circlenum);
    var element3 = document.getElementById("circledel"+circlenum);
    element.parentNode.removeChild(element);
    element2.parentNode.removeChild(element2);
    element3.parentNode.removeChild(element3);
    dotelement();
}
//==================================================================


function pencil() {
    if (labelarray.length == 0) {
        modalbody = "Please create a label first!";
        warningmodal();
        callmodal();
    } else {
        if (ctx.fillStyle == "#000000" || ctx.fillstyle == "transparent") {
            modalbody = "Please choose a color based on the label!";
            warningmodal();
            callmodal();
        } else {
            if (rectoolactive == true) {
                modalbody = "Rectangle tool is currently active. Please refresh the page to change tools!";
                warningmodal();
                callmodal();
                // if (confirm("We detected annotations of Rectangle tool. do you want to reset and switch to Dot tool?")) {
                //     reset();
                //     canvas.onmousemove = function (e) {
                //         x.style.display = "inline";
                //     };
                //     canvas.onmousedown = function (e) {
                //         // getPosition(e); 
                //         dottoolactive = true;
                //         curX = e.offsetX;
                //         curY = e.offsetY;
                //         //curX = e.clientX - canvas.offsetLeft;
                //         //curY = e.clientY - canvas.offsetTop;
                //         drawCoordinates(curX, curY);

                //         prevX = curX;
                //         prevY = curY;
                //         // // ctx.beginPath();
                //         // // ctx.moveTo(prevX, prevY);
                //     };
                //     canvas.onmouseout = function (e) {
                //         x.style.display = "none";
                //     };
                // }
            } else {
                canvas.onmousemove = function (e) {
                    x.style.display = "inline";
                };
                canvas.onmousedown = function (e) {
                    // getPosition(e); 
                    dottoolactive = true;
                    curX = e.offsetX;
                    curY = e.offsetY;
                    //curX = e.clientX - canvas.offsetLeft;
                    //curY = e.clientY - canvas.offsetTop;
                    drawCoordinates(curX, curY);
                    ++recordannotation;
                    document.getElementById("recordannotation").innerHTML = recordannotation;
                    prevX = curX;
                    prevY = curY;
                    // // ctx.beginPath();
                    // // ctx.moveTo(prevX, prevY);
                };
                canvas.onmouseout = function (e) {
                    x.style.display = "none";
                };
            }
        }
    }
    function drawCoordinates(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, ctx.lineWidth, 0, Math.PI * 2, true);
        ctx.fill();

        var xcalculation = imgrealwidth * curX;
        var ycalculation = imgrealheight * curY;
        var finalxcalculation = xcalculation / width;
        var finalycalculation = ycalculation / height;

        for (var i = 0; i < labelarray.length; i++) {
            if (ctx.fillStyle.toUpperCase() == labelarray[i].value.toUpperCase()) {
                pushlabel = labelarray[i].label;
                pushstartx = finalxcalculation;
                pushstarty = finalycalculation;
                pushendx = 0;
                pushendy = 0;
                pushtool = "Dot Tool";
                pushcolor = labelarray[i].value;
                savepost();
                // alert(pushtool);
                //canvas_data.pencil.push({ "label": labelarray[i].label, "startx": finalxcalculation, "starty": finalycalculation, "thick": ctx.lineWidth, "color": ctx.strokeStyle });
            }
        }
    }
}

function savepost() {
    $.post("/profile", { save_imagename: pushimagename, save_label: pushlabel, save_startx: pushstartx, save_starty: pushstarty, save_endx: pushendx, save_endy: pushendy, save_tool: pushtool, save_color: pushcolor });
}

function savedot() {
    $.post("/profile", { save_label: pushlabel, save_startx: pushstartx, save_starty: pushstarty, save_endx: pushendx, save_endy: pushendy, save_tool: pushtool, save_color: pushcolor });
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

function addlabel() {
    var labeltrigger = false;
    var labelname = document.getElementById("labelname").value;

    if (labelname == "") {
        modalbody = "Label name must be filled!"
        warningmodal();
        callmodal();
    } else if (labelarray.length >= 10) {
        modalbody = "Maximum label limit reached!"
        warningmodal();
        callmodal();
    } else {
        for (var y = 0; y < labelarray.length; y++) {
            if (labelname == labelarray[y].label) {
                modalbody = "Label already exists!";
                warningmodal();
                callmodal();
                labeltrigger = true;
            }
        }
        if (labeltrigger == false) {
            count2++;

            // for(var i = 0;i<labelarray.length;i++){
            //     ++count2;
            // }
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

            // for(var i = 0;i<10;i++){
            // var colorIncrement = '#EE000' + i;
            // }
            labelarray.push({ label: labelname, value: colorList[count2] });
            // colorList.pop();
            labelname = "";
            document.getElementById("labelname").value = labelname;
            printlabelarray();

        }
    }
}

function printlabelarray() {
    var html = "<table cellpadding = '5' cellspacing = '5'><th>Label Name</th><th>Color</th>";
    var html2 = "";
    for (var i = 0; i < labelarray.length; i++) {
        html += "<tr>";
        html += "<td>" + labelarray[i].label + "</td>";
        html += "<td><button style='background-color:" + labelarray[i].value + "; height: 20px; width: 20px'" + 'onclick=\'changecolor(' + i + ')\'>' + " " + "</button></td>";
        html += "<td><button class='btn btn-danger' id='deletelabelbtn' onclick='deletelabel(" + i + ")'style='background-color:red'>Del</td>";
        html += "</tr>";
        //creating buttons in toolset
        html2 += "<td><button style='background-color:" + labelarray[i].value + "; height: 20px; width: 20px; margin-right:10px'" + 'onclick=\'changecolor(' + i + ')\'>' + " " + "</button></td>";
    }
    html += "</table>";
    // html2 += "</tr>";

    document.getElementById("labellist").innerHTML = html;
    //document.getElementById("colortoolset").innerHTML = html2;
}

function changecolor(i) {
    color(labelarray[i].value);
    var labeling = document.getElementById("currentlabel");
    var labeling2 = document.getElementById("currentlabel2");
    labeling2.style.display = "inline";

    labeling.style.color = labelarray[i].value;

    var changecurrentactivelabel = " " + labelarray[i].label;
    document.getElementById("currentlabel").innerHTML = changecurrentactivelabel;
}

function deletelabel(y) {
    modaltitle = "Please Confirm Action";
    modalbody = "Are you sure you want to delete  " + labelarray[y].label + "  ?";
    modalfooter = '<button type="button" class="btn btn-danger" data-dismiss="modal" onclick="deletelabelconfirmed(' + y + ')">Delete</button>'
        + '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>';
    callmodal();

    // if (confirm("Are you sure you want to delete  " + labelarray[y].label + "  ?")) {
    //     if (labelarray[y].value == ctx.fillStyle) {
    //         color('transparent');
    //         ctx.fillStyle = "transparent";
    //         colorList.push(labelarray[y].value);

    //         labelarray.splice(y, 1);
    //         printlabelarray();
    //         alert("Same");
    //     } else {
    //         colorList.push(labelarray[y].value);

    //         labelarray.splice(y, 1);
    //         printlabelarray();
    //         alert("Different");
    //     }
    // }
}

function deletelabelconfirmed(y) {
    if (labelarray[y].value.toUpperCase() == ctx.fillStyle.toUpperCase()) {
        color('transparent');
        ctx.fillStyle = "transparent";
        colorList.push(labelarray[y].value);
        labelarray.splice(y, 1);
        printlabelarray();
    } else {
        colorList.push(labelarray[y].value);
        labelarray.splice(y, 1);
        printlabelarray();
    }
}

function alerttest() {
    alert("success! image width :" + imgrealwidth + "and height : " + imgrealheight);
}

function deldummyjs() {
    var element = document.getElementById("testcircle");
    element.parentNode.removeChild(element);
}

function dummyjs() {
    //var dummyvar='<circle id="circleborder1" cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="none" onclick="alerttest()" onmouseout="hidedummyjs()"/>';
    document.getElementById("testcircle1").style.display = "inline";
    document.getElementById("deltestcircle1").style.display = "inline";
    // document.getElementById("testcircle1").innerHTML += dummyvar;
}

function hidedummyjs() {
    document.getElementById("testcircle1").style.display = "none";
    document.getElementById("deltestcircle1").style.display = "none";
}


//commented, might be useful who knows
//============================================
//$('#myModal').on('shown.bs.modal', function () {
//     $('#myInput').trigger('focus')
// })
//===============================================
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
//============================================
// function openNav() {
//     document.getElementById("mySidepanel").style.width = "270px";
// }
// function closeNav() {
//     document.getElementById("mySidepanel").style.width = "0";
// }
