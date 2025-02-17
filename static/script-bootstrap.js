//Canvas Variables
var canvas = document.getElementById("paint");
var svg = document.getElementById("svgovercanvas");
var svgprevannotation = document.getElementById("svgprevannotation");
//svgc = svg.getContext("2d");
document.getElementById("paint").style.cursor = "cell";
var ctx = canvas.getContext("2d");
var clientX = 0.0;
var clientY = 0.0;
var curX, curY, prevX, prevY;
ctx.lineWidth = 4;
var height = canvas.height;
var width = canvas.width;
var canvas_data = { "pencil": [], "rectangle": [] }
var rectt = canvas.getBoundingClientRect();
var scaleX = canvas.width / rectt.width;   // relationship bitmap vs. element for X
var scaleY = canvas.height / rectt.height;

//IMAGE AND COLOR VARIABLES
var colorList = ["#EE0000", "#334CFF", "#52FF6D", "#AF5AFF", "#FF5A5A", "#FF7ECC", "#00C5FF", "#7EF5FF", "#FBFF00", "#FFBD00"];
var colorListNew = ["#EE0000", "#334CFF", "#52FF6D", "#AF5AFF", "#FF5A5A", "#FF7ECC", "#00C5FF", "#7EF5FF", "#FBFF00", "#FFBD00"];
var count2 = 0;
var hold = false;
var imgrealwidth, imgrealheight;
var defaultlinewidth = 4;
var fill_value = false;
var stroke_value = true;
var pushimagename, pushlabel, pushstartx, pushstarty, pushendx, pushendy, pushtool, pushcolor;
var counterimage = 0;
var drawimage;
var recordannotation = 0;
var x = document.getElementById("showcoordinate");
var labelarray = [], labelcolorarray = [], imagearray = [], imagenamearray = [], imagelabelarray = [], imagecolorarray = []
    , annotateindexarray = [], filteredimagearray = [], toolarray = [], annotatorarray = [], myantns = [];
var startxarray = [], startyarray = [], endxarray = [], endyarray = [], prevsvg_data = [], prevsvgrect_data = [], deldbdot = [], deldbrect = [], tempdot = [], temprect = [], otherantns = [], printotherantns = [];
var dottoolactive = false, rectoolactive = false;
var modaltitle, modalbody, modalfooter;
var dotovercanvas = "", rectovercanvas = "";
var activelabel;
var infobtn = document.getElementById("infobtn");
var username = document.getElementById("username").textContent; //can be textcontent / innertext for < IE9 or innerHTML
var annotatecheckbox = document.getElementById("annotatecheckbox");
var annotationindex = 0, annotationid = 0, getlastindex = 0, totalprevannotation = 0, cursor;
var svg_data = [], svg_rectdata = [], circlecount = 0, rectcount = 0;
const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
var deldbarray = [];
var svgdataarray = [];

function loadfeature() {
    $("#annotatepage").addClass("active");

    $('.imageclass').each(function (index, element) {
        imagearray.push($(element).text());
    });
    $('.labelclass').each(function (index, element) {
        labelarray.push($(element).text());
    });
    $('.labelcolor').each(function (index, element) {
        labelcolorarray.push($(element).text());
    });
    $('.imagenameclass').each(function (index, element) {
        imagenamearray.push($(element).text());
    });
    $('.imagelabelclass').each(function (index, element) {
        imagelabelarray.push($(element).text());
    });
    $('.startxclass').each(function (index, element) {
        startxarray.push($(element).text());
    });
    $('.startyclass').each(function (index, element) {
        startyarray.push($(element).text());
    });
    $('.endxclass').each(function (index, element) {
        endxarray.push($(element).text());
    });
    $('.endyclass').each(function (index, element) {
        endyarray.push($(element).text());
    });
    $('.toolclass').each(function (index, element) {
        toolarray.push($(element).text());
    });
    $('.colorclass').each(function (index, element) {
        imagecolorarray.push($(element).text());
    });
    $('.annotatorclass').each(function (index, element) {
        annotatorarray.push($(element).text());
    });
    $('.cursor').each(function (index, element) {
        cursor = $(element).text();
    });
    $('[data-toggle="popover"]').popover();

    for (var i = 0; i < colorList.length; i++) {
        for (var y = 0; y < labelcolorarray.length; y++) {
            if (colorList[i] == labelcolorarray[y]) {
                var index = colorListNew.indexOf(colorList[i]);
                if (index > -1) {
                    colorListNew.splice(index, 1);
                }
            }
        }
    }
    eventlistener();
    loadimage();
    document.getElementById("totalimagenumber").innerHTML = imagearray.length;
    document.getElementById("recordannotation").innerHTML = recordannotation;
    setTimeout(function () { currentimage(); }, 300);

}

function eventlistener() {
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
}

function changeimage(i) {
    var c = cursor - 1;
    if (i != c) {
        document.getElementById("svgloader").style.display = "inline";
        var updatecursor = ++i;
        var data = JSON.stringify([{ "annotator": "" + username + "", "cursor": "" + updatecursor + "" }]);
        var xhr = new XMLHttpRequest();
        var url = "/updatecursor";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                location.reload();
            }
        };
        xhr.send(data);
    }
}

function limitvalidation() {
    var limit = 3;
    var imagename = "images1.jpeg";
    var countoccur = 0;
    var storeusername = "";
    for (var i = 0; i < imagenamearray.length; i++) {
        if (imagenamearray[i] == imagename) {
            if (storeusername != annotatorarray[i]) {
                if (countoccur < limit) {
                    storeusername = annotatorarray[i];
                    countoccur++;
                } else {
                    var index = imagenamearray.indexOf(imagenamearray[i]);
                    if (index > -1) {
                        imagenamearray.splice(index, 1);
                    }
                }
            }
        }
    }

}

function loadimage() {
    var html = "";
    var html2 = "";
    for (var i = 0; i < imagearray.length; i++) {
        html += "<img id='image" + i + "' src='static/images/" + imagearray[i] + "'>";
    }
    for (var i = 0; i < imagearray.length; i++) {
        html2 += "<img class='mb-2 rounded hvr-glow' style='cursor:pointer' id='navimage" + i + "' onclick='changeimage(" + i + ")' src='static/images/" + imagearray[i] + "' width='205' height='200'>";
    }
    document.getElementById("listimages").innerHTML = html;
    document.getElementById("navigateimages").innerHTML = html2;
}

function nextimagevalidation() {
    if (deldbdot.length > 0 || deldbrect.length > 0) {
        modaltitle = "Please Confirm Action"
        modalbody = "You edited saved annotations. these changes will be applied"
        modalfooter = '<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="cursornextimage()">Submit</button>'
            + '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>';
        callmodal();
    } else {
        cursornextimage();
    }
}

function printprevdot() {
    for (var i = 0; i < prevsvg_data.length; i++) {
        ++circlecount;
        ++recordannotation;

        curX = prevsvg_data[i].startx * canvas.width / imgrealwidth;
        curY = prevsvg_data[i].starty * canvas.height / imgrealheight;

        delbtnposX = curX + 3;
        delbtnposY = curY - 10;
        var svgdot = '<circle id=circle' + circlecount + ' cx="' + curX + '" cy="' + curY + '" r="' + defaultlinewidth + '" fill="' + prevsvg_data[i].imagecolor + '" onmouseover="showelements(' + circlecount + ')" onmouseout="hidelements(' + circlecount + ')" />';
        var dotborder = '<circle style="display:none;z-index:2" id=circleborder' + circlecount + ' cx="' + curX + '" cy="' + curY + '" r="' + defaultlinewidth + '" fill="none" stroke=#b30000 stroke-width="4" />';
        var dotdel = '<image id=circledel' + circlecount + ' href="static/pngguru.png" x="' + delbtnposX + '" y="' + delbtnposY + '" height="25px" width="25px" style="display:none;cursor:pointer" onclick="removecircle(' + circlecount + ')" onmouseover="showelements(' + circlecount + ')" onmouseout="hidelements(' + circlecount + ')" />'

        document.getElementById("svgovercanvas").innerHTML += svgdot; //append method using +=
        document.getElementById("svgovercanvas").innerHTML += dotborder;
        document.getElementById("svgovercanvas").innerHTML += dotdel;
        document.getElementById("recordannotation").innerHTML = recordannotation;
        //alert(prevsvg_data[i].startx + " " + prevsvg_data[i].starty);
        pushlabel = prevsvg_data[i].imagelabel;
        pushstartx = prevsvg_data[i].startx;
        pushstarty = prevsvg_data[i].starty;
        pushendx = 0;
        pushendy = 0;
        pushtool = "Dot Tool";
        pushcolor = prevsvg_data[i].imagecolor;
        //alert(pushstartx + '' + pushstarty);
        tempdot.push({
            image_name: pushimagename, label: pushlabel, startx: pushstartx,
            starty: pushstarty, endx: pushendx, endy: pushendy, tool: pushtool,
            color: pushcolor, index: circlecount, annotator: username//, annotationindex: annotationindex, annotationid: annotationid
        });
    }
}

function printprevrect() {
    for (var i = 0; i < prevsvgrect_data.length; i++) {
        ++rectcount;
        ++recordannotation;
        var prevX = prevsvgrect_data[i].startx * canvas.width / imgrealwidth;
        var prevY = prevsvgrect_data[i].starty * canvas.height / imgrealheight;
        var realendx = prevsvgrect_data[i].endx * canvas.width / imgrealwidth;
        var realendy = prevsvgrect_data[i].endy * canvas.height / imgrealheight;

        var curX = realendx - prevX; //width calculation
        var curY = realendy - prevY; //height calculation
        var compensatedx = realendx - 15;
        var compensatedy = realendy - 15;
        var labelY = prevY - 3;

        var fillY = prevY - 14;
        var countlength = 0;
        var activelabel = prevsvgrect_data[i].imagelabel;
        for (var y = 0; y < activelabel.length; y++) {
            ++countlength;
        }
        var fillWidth = 10.5 * countlength;

        var svgrect = '<rect id=rectangle' + rectcount + ' x="' + prevX + '" y="' + prevY + '" width="' + curX + '" height="' + curY + '" onmouseover="showrectelements(' + rectcount + ')" onmouseout="hiderectelements(' + rectcount + ')" fill="none" stroke="' + prevsvgrect_data[i].imagecolor + '" stroke-width="' + defaultlinewidth + '"/>';
        var svgrectborder = '<rect id=rectborder' + rectcount + ' x="' + prevX + '" y="' + prevY + '" width="' + curX + '" height="' + curY + '" onmouseover="showrectelements(' + rectcount + ')" onmouseout="hiderectelements(' + rectcount + ')" style="fill:none;stroke-width:' + defaultlinewidth + ';stroke:#b30000;display:none" />';
        var svgrectdel = '<image id=rectdel' + rectcount + ' href="static/pngguru.png" x="' + compensatedx + '" y="' + compensatedy + '" height="25px" width="25px" style="display:none;cursor:pointer" onclick="removerect(' + rectcount + ')" onmouseover="showrectelements(' + rectcount + ')" onmouseout="hiderectelements(' + rectcount + ')" />'
            + '<rect id=rectfill' + rectcount + ' x="' + prevX + '" y="' + fillY + '" width="' + fillWidth + '" height="10" fill="' + prevsvgrect_data[i].imagecolor + '" stroke="' + prevsvgrect_data[i].imagecolor + '" stroke-width="' + defaultlinewidth + '"/>'
            + '<text id=recttext' + rectcount + ' x="' + prevX + '" y="' + labelY + '" fill="black" style="font-weight:bold">' + prevsvgrect_data[i].imagelabel + '</text>';

        document.getElementById("svgovercanvas").innerHTML += svgrect;
        document.getElementById("svgovercanvas").innerHTML += svgrectborder;
        document.getElementById("svgovercanvas").innerHTML += svgrectdel;
        document.getElementById("recordannotation").innerHTML = recordannotation;
        //alert(prevsvgrect_data[i].startx + " " + prevsvgrect_data[i].starty + " " + prevsvgrect_data[i].endx + " " + prevsvgrect_data[i].endy);
        pushlabel = prevsvgrect_data[i].imagelabel;
        pushstartx = prevsvgrect_data[i].startx;
        pushstarty = prevsvgrect_data[i].starty;
        pushendx = prevsvgrect_data[i].endx;
        pushendy = prevsvgrect_data[i].endy;
        pushtool = "Rectangle Tool";
        pushcolor = prevsvgrect_data[i].imagecolor;
        temprect.push({
            image_name: pushimagename, label: pushlabel, startx: pushstartx,
            starty: pushstarty, endx: pushendx, endy: pushendy, tool: pushtool, color: pushcolor,
            index: rectcount, annotator: username//, annotationindex: annotationindex, annotationid: annotationid
        });

    }
}

function printotherannotations() {
    document.getElementById("prevannotationdiv").style.display = "inline";
    document.getElementById("prevannotator").innerHTML = printotherantns[0].imageannotator;

    for (var i = 0; i < printotherantns.length; i++) {
        ++totalprevannotation;
        if (printotherantns[i].tool == "Dot Tool") {
            var convertstartx = printotherantns[i].startx * canvas.width / imgrealwidth;
            var convertstarty = printotherantns[i].starty * canvas.height / imgrealheight;
            var svgdot = '<circle cx="' + convertstartx + '" cy="' + convertstarty + '" r="4" fill="' + printotherantns[i].imagecolor + '"  />';
            document.getElementById("svgprevannotation").innerHTML += svgdot;
        } else {
            var convertstartx = printotherantns[i].startx * canvas.width / imgrealwidth;
            var convertstarty = printotherantns[i].starty * canvas.height / imgrealheight;
            var convertendx = printotherantns[i].endx * canvas.width / imgrealwidth;
            var convertendy = printotherantns[i].endy * canvas.height / imgrealheight;
            var rectwidth = convertendx - convertstartx;
            var rectheight = convertendy - convertstarty;
            var labelY = convertstarty - 3;

            var fillY = convertstarty - 14;
            var activelabel = printotherantns[i].imagelabel;
            var countlength = 0;
            for (var y = 0; y < activelabel.length; y++) {
                ++countlength;
            }
            var fillWidth = 10.5 * countlength;
            var svgrect = '<rect x="' + convertstartx + '" y="' + convertstarty + '" width="' + rectwidth + '" height="' + rectheight + '" fill="none" stroke="' + printotherantns[i].imagecolor + '" stroke-width="4"/>'
                + '<rect x="' + convertstartx + '" y="' + fillY + '" width="' + fillWidth + '" height="10" fill="' + printotherantns[i].imagecolor + '" stroke="' + printotherantns[i].imagecolor + '" stroke-width="' + defaultlinewidth + '"/>'
                + '<text x="' + convertstartx + '" y="' + labelY + '" fill="black" style="font-weight:bold">' + printotherantns[i].imagelabel + '</text>';
            document.getElementById("svgprevannotation").innerHTML += svgrect;
        }
    }
    document.getElementById("recordannotation").innerHTML = counter;
}

function currentimage() {
    var c = cursor - 1;

    document.getElementById('navimage' + c).style.borderStyle = "Solid";
    document.getElementById('navimage' + c).style.borderWidth = "5px";

    drawimage = document.getElementById('image' + c);
    ctx.drawImage(drawimage, 0, 0, canvas.width, canvas.height);
    $(".loadergif").fadeOut("fast");
    imgrealwidth = drawimage.width;
    imgrealheight = drawimage.height;
    pushimagename = imagearray[c];

    var datacontent = "Image Name : " + pushimagename;
    infobtn.setAttributeNS(null, 'data-content', datacontent);
    document.getElementById("imagenumber").innerHTML = cursor;

    //SORT ALL YOUR ANNOTATIONS INTO 1 ARRAY
    for (var i = 0; i < annotatorarray.length; i++) {
        //YOUR ANNOTATIONS
        if (annotatorarray[i] == username) {
            myantns.push({
                imagename: imagenamearray[i], imagelabel: imagelabelarray[i],
                startx: startxarray[i], starty: startyarray[i], endx: endxarray[i], endy: endyarray[i],
                imagetool: toolarray[i], imagecolor: imagecolorarray[i], imageannotator: annotatorarray[i]//,imageannotationindex: annotateindexarray[i]
            });
        } else {
            //OTHER ANNOTATIONS
            if (imagenamearray[i] == pushimagename) {
                otherantns.push({
                    imagename: imagenamearray[i], imagelabel: imagelabelarray[i],
                    startx: startxarray[i], starty: startyarray[i], endx: endxarray[i], endy: endyarray[i],
                    imagetool: toolarray[i], imagecolor: imagecolorarray[i], imageannotator: annotatorarray[i]//,imageannotationindex: annotateindexarray[i]
                });
            }
        }
    }
    //CHECK IF YOUR PREVIOUS ANNOTATIONS ON CURRENT IMAGE EXISTS
    for (var i = 0; i < myantns.length; i++) {
        //IF EXISTS, PUSH INTO DIFFERENT ARRAY AND PREPARE FOR PRINTING THE ANNOTATIONS
        if (myantns[i].imagename == pushimagename) {
            if (myantns[i].imagetool == 'Dot Tool') {
                prevsvg_data.push({
                    image_name: myantns[i].imagename, label: myantns[i].imagelabel, startx: myantns[i].startx,
                    starty: myantns[i].starty, endx: myantns[i].endx, endy: myantns[i].endy, tool: myantns[i].imagetool, imagecolor: myantns[i].imagecolor
                });
            } else {
                prevsvgrect_data.push({
                    image_name: myantns[i].imagename, imagelabel: myantns[i].imagelabel, startx: myantns[i].startx,
                    starty: myantns[i].starty, endx: myantns[i].endx, endy: myantns[i].endy, tool: myantns[i].imagetool, imagecolor: myantns[i].imagecolor
                });
            }
        }
    }
    //GETTING LAST OTHER ANNOTATION'S INDEX IN CURRENT IMAGE
    if (otherantns.length > 0) {
        var temp = otherantns.length - 1;
        var otherlastannotator = otherantns[temp].imageannotator;
    }
    for (var i = 0; i < otherantns.length; i++) {
        if (otherantns[i].imageannotator == otherlastannotator) {
            printotherantns.push({
                image_name: otherantns[i].imagename, imagelabel: otherantns[i].imagelabel, startx: otherantns[i].startx,
                starty: otherantns[i].starty, endx: otherantns[i].endx, endy: otherantns[i].endy, tool: otherantns[i].imagetool, imagecolor: otherantns[i].imagecolor, imageannotator: otherantns[i].imageannotator
            });
        }
    }
    //PRINT ALL PREVIOUS ANNOTATIONS IF EXISTED
    if (prevsvg_data.length > 0) {
        printprevdot();
    } if (prevsvgrect_data.length > 0) {
        printprevrect();
    }
    if (printotherantns.length > 0) {
        printotherannotations();
    }
}

function combinedbdelete() {
    if (deldbdot.length > 0) {
        for (var i = 0; i < deldbdot.length; i++) {
            deldbarray.push({ image_name: deldbdot[i].image_name, startx: deldbdot[i].startx, starty: deldbdot[i].starty });
        }
    }
    if (deldbrect.length > 0) {
        for (var i = 0; i < deldbrect.length; i++) {
            deldbarray.push({ image_name: deldbrect[i].image_name, startx: deldbrect[i].startx, starty: deldbrect[i].starty });
        }
    }
}

function combinesvgdata() {
    if (svg_data.length > 0) {
        for (var i = 0; i < svg_data.length; i++) {
            svgdataarray.push({
                image_name: svg_data[i].image_name, label: svg_data[i].label, startx: svg_data[i].startx,
                starty: svg_data[i].starty, endx: svg_data[i].endx, endy: svg_data[i].endy, tool: svg_data[i].tool, color: svg_data[i].color,
                annotator: svg_data[i].annotator//, annotationindex: annotationindex, annotationid: annotationid
            });
        }
    }
    if (svg_rectdata.length > 0) {
        for (var i = 0; i < svg_rectdata.length; i++) {
            svgdataarray.push({
                image_name: svg_rectdata[i].image_name, label: svg_rectdata[i].label, startx: svg_rectdata[i].startx,
                starty: svg_rectdata[i].starty, endx: svg_rectdata[i].endx, endy: svg_rectdata[i].endy, tool: svg_rectdata[i].tool, color: svg_rectdata[i].color,
                annotator: svg_rectdata[i].annotator//, annotationindex: annotationindex, annotationid: annotationid
            });
        }
    }
}

function cursornextimage() {
    document.getElementById("svgloader").style.display = "inline";
    var container = cursor;
    var updatecursor = ++container;
    var xhr = new XMLHttpRequest();
    combinedbdelete();
    combinesvgdata();
    if (deldbarray.length > 0) {
        var url = "/dbdelete";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        var data = JSON.stringify(deldbarray);
        xhr.send(data);
    }
    if (svgdataarray.length > 0) {
        var url = "/annotation";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        var data = JSON.stringify(svgdataarray);
        xhr.send(data);
    }
    if (cursor != imagearray.length) {
        var xhrc = new XMLHttpRequest();
        var url = "/updatecursor";
        var data = JSON.stringify([{ "annotator": "" + username + "", "cursor": "" + updatecursor + "" }]);
        xhrc.open("POST", url, true);
        xhrc.setRequestHeader("Content-Type", "application/json");
        xhrc.onreadystatechange = function () {
            if (xhrc.readyState === 4 && xhrc.status === 200) {
                location.reload();
            }
        };
        xhrc.send(data);
    } else {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                location.reload();
            }
        };
        if (deldbdot.length == 0 && deldbrect.length == 0 && svg_data.length == 0 && svg_rectdata.length == 0) {
            location.reload();
        }
    }
}

function cursorprevimage() {
    if (cursor == 1) {
        modalbody = "No Images before this!";
        warningmodal();
        callmodal();
    } else {
        document.getElementById("svgloader").style.display = "inline";
        var container = cursor;
        var updatecursor = container - 1;
        var data = JSON.stringify([{ "annotator": "" + username + "", "cursor": "" + updatecursor + "" }]);
        var xhr = new XMLHttpRequest();
        var url = "/updatecursor";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                location.reload();
            }
        };
        xhr.send(data);
    }
}

function togglepreviousannotation() {
    if (annotatecheckbox.checked == true) {
        svgprevannotation.style.zIndex = 2;
        svg.style.display = "none";
        document.getElementById("recordannotation").innerHTML = totalprevannotation;
        document.getElementById("previnfo").style.display = "inline";
        if (colorchanged == true) {
            document.getElementById("currentlabel2").style.display = "none";
        }
    } else {
        svgprevannotation.style.zIndex = -1;
        svg.style.display = "inline";
        document.getElementById("recordannotation").innerHTML = recordannotation;
        document.getElementById("previnfo").style.display = "none";
        if (colorchanged == true) {
            document.getElementById("currentlabel2").style.display = "inline";
        }
    }
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
    if (ctx.lineWidth == 4) {
        ctx.lineWidth = 4;
        defaultlinewidth = 4;
    }
    else {
        ctx.lineWidth -= 1;
        defaultlinewidth -= 1;
        document.getElementById("currentlw").innerHTML = defaultlinewidth;
    }
}

function resetvalidation() {
    if (prevsvgrect_data.length > 0 || prevsvg_data.length > 0) {
        modaltitle = "Please Confirm Action";
        modalbody = "This will reset all annotations including saved ones. Continue?"
        modalfooter = '<button type="button" class="btn btn-warning" data-dismiss="modal" onclick="reset()">Reset</button>'
            + '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>';
        callmodal();
    } else {
        reset();
    }
}

function reset() {
    for (var i = 0; i < tempdot.length; i++) {
        deldbdot.push({ image_name: tempdot[i].image_name, startx: tempdot[i].startx, starty: tempdot[i].starty });
    }
    for (var i = 0; i < temprect.length; i++) {
        deldbrect.push({ image_name: temprect[i].image_name, startx: temprect[i].startx, starty: temprect[i].starty });
    }
    svg_data = [];
    svg_rectdata = [];
    rectcount = 0;
    circlecount = 0;
    var cleaner = "";
    document.getElementById("svgovercanvas").innerHTML = cleaner;
    recordannotation = "0";
    document.getElementById("recordannotation").innerHTML = recordannotation;
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

//============================= SVG RECTANGLE ELEMENT!========================================== 
//var svgrectfinal >> no need to create global var bcs creating local var 
//without 'var' can be accessed globally.

function rectelement() {
    dottoolactive = false;
    rectoolactive = true;
    document.getElementById("activetool").innerHTML = "Rectangle";
    svg.onmousedown = function (e) {
        if (labelarray.length == 0) {
            modalbody = "Please create a label first!";
            warningmodal();
            callmodal();
        } else if (ctx.fillStyle == "#000000") {
            modalbody = "Please choose a color based on the label!";
            warningmodal();
            callmodal();
        } else {
            prevX = e.offsetX;
            prevY = e.offsetY;
            hold = true;
        }
    }

    svg.onmousemove = function (e) {
        x.style.display = "inline";
        if (hold) {

            curX = e.offsetX - prevX;
            curY = e.offsetY - prevY;

            rect.setAttributeNS(null, 'x', prevX);
            rect.setAttributeNS(null, 'y', prevY);
            rect.setAttributeNS(null, 'width', curX);
            rect.setAttributeNS(null, 'height', curY);
            rect.setAttributeNS(null, 'fill', "none");
            rect.setAttributeNS(null, 'stroke', ctx.strokeStyle);
            rect.setAttributeNS(null, 'stroke-width', 5);

            svg.appendChild(rect);
        }

    }

    svg.onmouseup = function (e) {
        hold = false;
        ++rectcount;
        var realendx = curX + prevX;
        var realendy = curY + prevY;
        var compensatedx = realendx - 15;
        var compensatedy = realendy - 15;
        var labelY = prevY - 3;

        //FINDING ACTIVE LABEL
        for (var i = 0; i < labelcolorarray.length; i++) {
            if (ctx.fillStyle.toUpperCase() == labelcolorarray[i].toUpperCase()) {
                activelabel = labelarray[i];
            }
        }

        var fillY = prevY - 14;
        var countlength = 0;
        for (var i = 0; i < activelabel.length; i++) {
            ++countlength;
        }
        var fillWidth = 10.5 * countlength;

        svg.removeChild(rect);
        var svgrect = '<rect id=rectangle' + rectcount + ' x="' + prevX + '" y="' + prevY + '" width="' + curX + '" height="' + curY + '" onmouseover="showrectelements(' + rectcount + ')" onmouseout="hiderectelements(' + rectcount + ')" fill="none" stroke="' + ctx.fillStyle + '" stroke-width="' + defaultlinewidth + '"/>';
        var svgrectborder = '<rect id=rectborder' + rectcount + ' x="' + prevX + '" y="' + prevY + '" width="' + curX + '" height="' + curY + '" onmouseover="showrectelements(' + rectcount + ')" onmouseout="hiderectelements(' + rectcount + ')" style="fill:none;stroke-width:' + defaultlinewidth + ';stroke:#b30000;display:none" />';
        var svgrectdel = '<image id=rectdel' + rectcount + ' href="static/pngguru.png" x="' + compensatedx + '" y="' + compensatedy + '" height="25px" width="25px" style="display:none;cursor:pointer" onclick="removerect(' + rectcount + ')" onmouseover="showrectelements(' + rectcount + ')" onmouseout="hiderectelements(' + rectcount + ')" />'
            + '<rect id=rectfill' + rectcount + ' x="' + prevX + '" y="' + fillY + '" width="' + fillWidth + '" height="10" fill="' + ctx.fillStyle + '" stroke="' + ctx.fillStyle + '" stroke-width="' + defaultlinewidth + '"/>'
            + '<text id=recttext' + rectcount + ' x="' + prevX + '" y="' + labelY + '" fill="black" style="font-weight:bold">' + activelabel + '</text>';

        document.getElementById("svgovercanvas").innerHTML += svgrect;
        document.getElementById("svgovercanvas").innerHTML += svgrectborder;
        document.getElementById("svgovercanvas").innerHTML += svgrectdel;

        var startxcalc = imgrealwidth * prevX;
        var startycalc = imgrealheight * prevY;
        var endxcalc = imgrealwidth * realendx;
        var endycalc = imgrealheight * realendy;

        var finalstartxcalc = startxcalc / width;
        var finalstartycalc = startycalc / height;
        var finalendxcalc = endxcalc / width;
        var finalendycalc = endycalc / height;
        for (var i = 0; i < labelarray.length; i++) {
            if (ctx.fillStyle.toUpperCase() == labelcolorarray[i].toUpperCase()) {
                pushlabel = labelarray[i];
                pushstartx = Math.round(finalstartxcalc);
                pushstarty = Math.round(finalstartycalc);
                pushendx = Math.round(finalendxcalc);
                pushendy = Math.round(finalendycalc);
                pushtool = "Rectangle Tool";
                pushcolor = labelcolorarray[i];
                svg_rectdata.push({
                    image_name: pushimagename, label: pushlabel, startx: pushstartx,
                    starty: pushstarty, endx: pushendx, endy: pushendy, tool: pushtool, color: pushcolor,
                    index: rectcount, annotator: username//, annotationindex: annotationindex, annotationid: annotationid
                });
            }
        }

        var arraylength = svg_data.length;
        var data = '<h6 style="font-size:13px">Image Name : <font color="red">' + pushimagename + '</font></h6>'
            + '<h6 style="font-size:13px"> X :  <font color="red">' + finalstartxcalc + '</font></h6>'
            + '<h6 style="font-size:13px"> Y :  <font color="red">' + finalstartycalc + '</font></h6>'
            + '<h6 style="font-size:13px"> Width :  <font color="red">' + curX + '</font></h6>'
            + '<h6 style="font-size:13px"> Height :  <font color="red">' + curY + '</font></h6>';
        //document.getElementById("annotationdata").innerHTML = data;
        ++recordannotation;
        document.getElementById("recordannotation").innerHTML = recordannotation;
    }
}

function removerect(rectnum) {
    var element = document.getElementById("rectangle" + rectnum);
    var element2 = document.getElementById("rectborder" + rectnum);
    var element3 = document.getElementById("rectdel" + rectnum);
    var element4 = document.getElementById("recttext" + rectnum);
    var element5 = document.getElementById("rectfill" + rectnum);
    element.parentNode.removeChild(element);
    element2.parentNode.removeChild(element2);
    element3.parentNode.removeChild(element3);
    element4.parentNode.removeChild(element4);
    element5.parentNode.removeChild(element5);

    for (var i = 0; i < temprect.length; i++) { // FOR DELETING DOT FROM DATABASE IF ANY
        if (rectnum == temprect[i].index) {
            deldbrect.push({ image_name: temprect[i].image_name, startx: temprect[i].startx, starty: temprect[i].starty });
        }
    }

    for (var num = 0; num < svg_rectdata.length; num++) {
        if (rectnum == svg_rectdata[num].index) {
            svg_rectdata.splice(num, 1);
        }
    }

    --recordannotation;
    document.getElementById("recordannotation").innerHTML = recordannotation;
    if (rectoolactive == true) {
        rectelement();
    }
}

function showrectelements(rectnum) {
    document.getElementById("rectborder" + rectnum).style.display = "inline";
    document.getElementById("rectdel" + rectnum).style.display = "inline";

    if (rectoolactive == true) {
        svg.onmousedown = function (e) {

        }
        svg.onmousemove = function (e) {

        }
        svg.onmouseup = function (e) {

        }
    }
}

function hiderectelements(rectnum) {
    document.getElementById("rectborder" + rectnum).style.display = "none";
    document.getElementById("rectdel" + rectnum).style.display = "none";
    if (rectoolactive == true) {
        rectelement();
    } else if (dottoolactive == true) {
        dotelement();
    }
}
//========================================================================================



//============NEW SVG DOT SHOW HIDE DELETE FUNCTION================
// var svgdot = "";

function showelements(circlenum) {
    document.getElementById("circleborder" + circlenum).style.display = "inline";
    document.getElementById("circledel" + circlenum).style.display = "inline";

    svg.onmousedown = function (e) { //biar bs di klik pas tombol delete ditunjukan

    };
}

function hidelements(circlenum) {
    document.getElementById("circleborder" + circlenum).style.display = "none";
    document.getElementById("circledel" + circlenum).style.display = "none";
    if (dottoolactive == true) {
        dotelement();
    } else if (rectoolactive == true) {
        rectelement();
    }
}

function delelements(circlenum) {
    $("#circle" + circlenum).remove();
    $("#circleborder" + circlenum).remove();
    $("#circledel" + circlenum).remove();
}

function dotelement() {
    rectoolactive = false;
    dottoolactive = true;
    document.getElementById("activetool").innerHTML = "Dot";
    svg.onmousemove = function (e) {
        x.style.display = "inline";
        //empty the onmousemove to prevent rect element to be triggered when in dot element
    }

    svg.onmousedown = function (e) {
        if (labelarray.length == 0) {
            modalbody = "Please create a label first!";
            warningmodal();
            callmodal();
        } else if (ctx.fillStyle == "#000000" || ctx.fillstyle == "transparent") {
            modalbody = "Please choose a color based on the label!";
            warningmodal();
            callmodal();

        } else {
            ++circlecount;
            curX = e.offsetX;
            curY = e.offsetY;

            delbtnposX = curX + 3;
            delbtnposY = curY - 10;

            var svgdot = '<circle id=circle' + circlecount + ' cx="' + curX + '" cy="' + curY + '" r="' + defaultlinewidth + '" fill="' + ctx.fillStyle + '" onmouseover="showelements(' + circlecount + ')" onmouseout="hidelements(' + circlecount + ')" />';
            var dotborder = '<circle style="display:none;z-index:2" id=circleborder' + circlecount + ' cx="' + curX + '" cy="' + curY + '" r="' + defaultlinewidth + '" fill="none" stroke=#b30000 stroke-width="4" />';
            var dotdel = '<image id=circledel' + circlecount + ' href="static/pngguru.png" x="' + delbtnposX + '" y="' + delbtnposY + '" height="25px" width="25px" style="display:none;cursor:pointer" onclick="removecircle(' + circlecount + ')" onmouseover="showelements(' + circlecount + ')" onmouseout="hidelements(' + circlecount + ')" />'

            document.getElementById("svgovercanvas").innerHTML += svgdot; //append method using +=
            document.getElementById("svgovercanvas").innerHTML += dotborder;
            document.getElementById("svgovercanvas").innerHTML += dotdel;

            var xcalculation = imgrealwidth * curX;
            var ycalculation = imgrealheight * curY;
            var finalxcalculation = xcalculation / width;
            var finalycalculation = ycalculation / height;

            for (var num = 0; num < labelcolorarray.length; num++) {
                if (ctx.fillStyle.toUpperCase() == labelcolorarray[num].toUpperCase()) {
                    pushlabel = labelarray[num];
                    pushstartx = Math.round(finalxcalculation);
                    pushstarty = Math.round(finalycalculation);
                    pushendx = 0;
                    pushendy = 0;
                    pushtool = "Dot Tool";
                    pushcolor = labelcolorarray[num];
                    svg_data.push({
                        image_name: pushimagename, label: pushlabel, startx: pushstartx,
                        starty: pushstarty, endx: pushendx, endy: pushendy, tool: pushtool,
                        color: pushcolor, index: circlecount, annotator: username//, annotationindex: annotationindex, annotationid: annotationid
                    });
                }
            }

            var arraylength = svg_data.length;
            var data = '<h6 style="font-size:13px">Image Name : <font color="red">' + pushimagename + '</font></h6>'
                + '<h6 style="font-size:13px"> X :  <font color="red">' + finalxcalculation + '</font></h6>'
                + '<h6 style="font-size:13px"> Y :  <font color="red">' + finalycalculation + '</font></h6>';
            //document.getElementById("annotationdata").innerHTML = data;
            ++recordannotation;
            document.getElementById("recordannotation").innerHTML = recordannotation;
        }

    }
}

function removecircle(circlenum) {
    var element = document.getElementById("circle" + circlenum);
    var element2 = document.getElementById("circleborder" + circlenum);
    var element3 = document.getElementById("circledel" + circlenum);
    element.parentNode.removeChild(element);
    element2.parentNode.removeChild(element2);
    element3.parentNode.removeChild(element3);

    //compare the number passed with the index column. index column has the same number with the one that 
    //was assigned to the button on creation.
    for (var i = 0; i < tempdot.length; i++) { // FOR DELETING DOT FROM DATABASE IF ANY
        if (circlenum == tempdot[i].index) {
            deldbdot.push({ image_name: tempdot[i].image_name, startx: tempdot[i].startx, starty: tempdot[i].starty });
            //alert(tempdot[i].startx + " " + tempdot[i].starty);
        }
    }

    for (var num = 0; num < svg_data.length; num++) {
        if (circlenum == svg_data[num].index) {
            svg_data.splice(num, 1);
        }
    }

    --recordannotation;
    document.getElementById("recordannotation").innerHTML = recordannotation;
    if (dottoolactive == true) {
        dotelement();
    }
}
//==================================================================

function getannotationdata() {
    if (rectoolactive == true) {
        var arraylength = svg_rectdata.length;
    } else if (dottoolactive == true) {

    }
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
    } else if (labelname.length > 15) {
        modalbody = "Maximum character length is 15!"
        warningmodal();
        callmodal();
    } else {
        for (var y = 0; y < labelarray.length; y++) {
            if (labelname == labelarray[y]) {
                modalbody = "Label already exists!";
                warningmodal();
                callmodal();
                labeltrigger = true;
            }
        }
        if (labeltrigger == false) {
            for (var num = 0; num < labelcolorarray.length; num++) {
                ++count2;
            }
            var colorcounter = 0;
            // for(var num=0;num<labelcolorarray.length;num++){
            //     if(labelcolorarray[num] == colorList[num]){
            //         ++colorcounter;
            //         //alert(labelcolorarray[num] + colorList[num]);
            //         // colorList.splice(num-1, 1);
            //     }
            // }

            // alert(colorList[colorcounter]);
            $.post("/savelabel", { save_labelname: labelname, save_colorvalue: colorListNew[0] });
            labelname = "";
            // alert(labelcolorarray);
            // alert(colorList);
            document.getElementById("labelname").value = labelname;
            setTimeout(() => { location.reload(); }, 250);

        }
    }
}

function deletelabelall() {
    if (labelarray.length == 0) {
        modalbody = "No labels to delete!";
        warningmodal();
        callmodal();
    } else {
        modaltitle = "Please Confirm Action";
        modalbody = "Are you sure you want to delete all label? This action CANNOT be reverted.";
        modalfooter = '<button type="button" class="btn btn-danger" data-dismiss="modal" onclick="deletelabelallconfirmed()">Delete All</button>'
            + '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>';
        callmodal();
    }
}

function deletelabelallconfirmed() {
    $.post("/deletelabelall");
    setTimeout(() => { location.reload(); }, 250);
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

function changecolor(labelname, labelcolor) {
    color(labelcolor);
    var labeling = document.getElementById("currentlabel");
    var labeling2 = document.getElementById("currentlabel2");
    labeling2.style.display = "inline";
    colorchanged = true;
    labeling.style.color = labelcolor;


    var changecurrentactivelabel = " " + labelname;
    document.getElementById("currentlabel").innerHTML = changecurrentactivelabel;
}

function deletelabel(labelname, labelcolor) {
    modaltitle = "Please Confirm Action";
    modalbody = "Are you sure you want to delete  " + labelname + "  ?";
    modalfooter = '<button type="button" class="btn btn-danger" data-dismiss="modal" onclick="deletelabelconfirmed(\'' + labelcolor + '\')">Delete</button>'
        + '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>';
    callmodal();
}

function deletelabelconfirmed(labelcolor) {
    $.post("/deletelabel", { delete_labelcolor: labelcolor });
    setTimeout(() => { location.reload(); }, 150);
}

function postdefaultcanvas() {
    var defaultwidth = 800;
    var defaultheight = 500;
    document.getElementById("canvas-width").value = defaultwidth;
    document.getElementById("canvas-height").value = defaultheight;
}


