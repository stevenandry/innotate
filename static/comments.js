//commented, might be useful who knows
//============================================

function loadprevannotation() {
    totalprevannotation = 0;
    for (var num = 0; num < filteredimagearray.length; num++) {

        if (filteredimagearray[num].imageannotationindex == getlastindex) {
            if (filteredimagearray[num].imagetool == 'Dot Tool') {
                ++totalprevannotation;
                var convertstartx = filteredimagearray[num].startx * canvas.width / imgrealwidth;
                var convertstarty = filteredimagearray[num].starty * canvas.height / imgrealheight;
                // alert(convertstartx);
                var svgdot = '<circle cx="' + convertstartx + '" cy="' + convertstarty + '" r="4" fill="' + filteredimagearray[num].imagecolor + '" />';
                document.getElementById("svgprevannotation").innerHTML += svgdot; //append method using +=

            } else if (filteredimagearray[num].imagetool == 'Rectangle Tool') {
                ++totalprevannotation;
                var convertstartx = filteredimagearray[num].startx * canvas.width / imgrealwidth;
                var convertstarty = filteredimagearray[num].starty * canvas.height / imgrealheight;
                var convertendx = filteredimagearray[num].endx * canvas.width / imgrealwidth;
                var convertendy = filteredimagearray[num].endy * canvas.height / imgrealheight;
                var width = convertendx - convertstartx;
                var height = convertendy - convertstarty;
                var labelY = convertstarty - 3;
                var svgrect = '<rect x="' + convertstartx + '" y="' + convertstarty + '" width="' + width + '" height="' + height + '" fill="none" stroke="' + filteredimagearray[num].imagecolor + '" stroke-width="4"/>'
                    + '<text x="' + convertstartx + '" y="' + labelY + '" fill="' + filteredimagearray[num].imagecolor + '">' + filteredimagearray[num].imagelabel + '</text>';

                document.getElementById("svgprevannotation").innerHTML += svgrect;
            }
        }
    }
}

function nextimage() {

    if (svg_rectdata.length > 0) {
        for (var i = 0; i < svg_rectdata.length; i++) {
            $.post("/profile", {
                save_imagename: svg_rectdata[i].image_name, save_label: svg_rectdata[i].label,
                save_startx: svg_rectdata[i].startx, save_starty: svg_rectdata[i].starty, save_endx: svg_rectdata[i].endx,
                save_endy: svg_rectdata[i].endy, save_tool: svg_rectdata[i].tool, save_color: svg_rectdata[i].color,
                save_annotator: svg_rectdata[i].annotator, save_annotateindex: svg_rectdata[i].annotationindex, save_annotationid: svg_rectdata[i].annotationid
            });
            alert("success post rectangle");
        }
    } else if (svg_data.length > 0) {
        for (var i = 0; i < svg_data.length; i++) {
            // var data = JSON.stringify(svg_data);
            // $.post("/profile", { dotsvgdata: data });
            $.post("/profile", {
                save_imagename: svg_data[i].image_name, save_label: svg_data[i].label,
                save_startx: svg_data[i].startx, save_starty: svg_data[i].starty, save_endx: svg_data[i].endx,
                save_endy: svg_data[i].endy, save_tool: svg_data[i].tool, save_color: svg_data[i].color,
                save_annotator: svg_data[i].annotator, save_annotateindex: svg_data[i].annotationindex, save_annotationid: svg_data[i].annotationid
            });
            alert("success post dot");
        }
    }
    reset();
    document.getElementById("svgprevannotation").innerHTML = "";
    filteredimagearray.length = 0;
    svgprevannotation.style.zIndex = -1;
    svg.style.display = "inline";
    annotatecheckbox.checked = false;
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
    var datacontent = "Image Name : " + pushimagename;
    infobtn.setAttributeNS(null, 'data-content', datacontent);
    document.getElementById("imagenumber").innerHTML = counterimage;

    var checkimage = imagenamearray.includes(pushimagename);
    if (checkimage == true) {
        document.getElementById("prevannotationdiv").style.display = "inline";

        for (var i = 0; i < imagenamearray.length; i++) {
            if (pushimagename == imagenamearray[i]) {
                filteredimagearray.push({
                    imagename: imagenamearray[i], imagelabel: imagelabelarray[i],
                    startx: startxarray[i], starty: startyarray[i], endx: endxarray[i], endy: endyarray[i],
                    imagetool: toolarray[i], imagecolor: imagecolorarray[i], imageannotator: annotatorarray[i],
                    imageannotationindex: annotateindexarray[i]
                });
                // alert(filteredimagearray[i].imagename + filteredimagearray[i].annotationindex);
                // alert(imagecolorarray[i]);
            }
        }
        var getlength = filteredimagearray.length;
        getlastindex = filteredimagearray[getlength - 1].imageannotationindex;
        var penampunglastindex = filteredimagearray[getlength - 1].imageannotationindex;
        //var incrementclastindex = ++penampunglastindex;
        //annotationindex = pushimagename + incrementlastindex;
        annotationindex = ++penampunglastindex;
        annotationid = pushimagename + "-" + annotationindex;
        //alert("Annotation Index on " +  pushimagename   + " : "  + annotationindex);
        loadprevannotation();

    } else {
        document.getElementById("prevannotationdiv").style.display = "none";
        annotationindex = 1;
        annotationid = pushimagename + "-" + annotationindex;
        //alert("prev annot not exist! annotindex : "+ annotationindex);
    }


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
                svg.onmousedown = function (e) {
                    ++circlecount;
                    dottoolactive = true;

                    curX = e.offsetX;
                    curY = e.offsetY;
                    delbtnposX = curX + 3;
                    delbtnposY = curY - 10;
                    // svgdot = '<circle id=circle'+circlecount+' cx="'+ curX  +'" cy="'+  curY  +'" r="'+ defaultlinewidth  +'" fill="'+ ctx.fillStyle +'" onclick="removecircle('+ circlecount +')" />';
                    var svgdot = '<circle id=circle' + circlecount + ' cx="' + curX + '" cy="' + curY + '" r="' + defaultlinewidth + '" fill="' + ctx.fillStyle + '" onmouseover="showelements(' + circlecount + ')" onmouseout="hidelements(' + circlecount + ')" />';
                    var dotborder = '<circle style="display:none;z-index:2" id=circleborder' + circlecount + ' cx="' + curX + '" cy="' + curY + '" r="' + defaultlinewidth + '" fill="none" stroke=#b30000 stroke-width="4" />';
                    //var dotdel = '<circle style="display:none" id=circledel' + circlecount + ' cx="' + delbtnposX + '" cy="' + delbtnposY + '" r="10" fill="black" onclick="removecircle(' + circlecount + ')" onmouseover="showelements(' + circlecount + ')" onmouseout="hidelements(' + circlecount + ')" />';
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
                            pushstartx = finalxcalculation;
                            pushstarty = finalycalculation;
                            pushendx = 0;
                            pushendy = 0;
                            pushtool = "Dot Tool";
                            pushcolor = labelcolorarray[num];
                            svg_data.push({
                                image_name: pushimagename, label: pushlabel, startx: pushstartx,
                                starty: pushstarty, endx: pushendx, endy: pushendy, tool: pushtool,
                                color: pushcolor, index: circlecount, annotator: username, annotationindex: annotationindex, annotationid: annotationid
                            });
                        }
                    }
                    //PRINT THE WHOLE ARRAY FOR SEEING RESULT
                    // for(var i=0;i<svg_data.length;i++){
                    //     alert(svg_data[i].image_name+" "+svg_data[i].label+" "+svg_data[i].startx+" "+svg_data[i].starty+" "+svg_data[i].endx+" "+svg_data[i].endy+" "+svg_data[i].tool+" "+svg_data[i].color+"||");
                    // }
                    var arraylength = svg_data.length;
                    var data = '<h6 style="font-size:13px">Image Name : <font color="red">' + pushimagename + '</font></h6>'
                        + '<h6 style="font-size:13px"> X :  <font color="red">' + finalxcalculation + '</font></h6>'
                        + '<h6 style="font-size:13px"> Y :  <font color="red">' + finalycalculation + '</font></h6>';
                    document.getElementById("annotationdata").innerHTML = data;
                    ++recordannotation;
                    document.getElementById("recordannotation").innerHTML = recordannotation;
                }

            }
        }
    }
}

// function rectelement() {
//     if (labelarray.length == 0) {
//         modalbody = "Please create a label first!";
//         warningmodal();
//         callmodal();
//     } else {
//         if (ctx.fillStyle == "#000000") {
//             modalbody = "Please choose a color based on the label!";
//             warningmodal();
//             callmodal();
//         } else {
//             if (dottoolactive == true) {
//                 modalbody = "Pencil tool is active. Please refresh the page to change tools!";
//                 warningmodal();
//                 callmodal();

//             } else {
//                 svg.onmousedown = function (e) {

//                     prevX = e.offsetX;
//                     prevY = e.offsetY;
//                     hold = true;
//                 }

//                 svg.onmousemove = function (e) {
//                     x.style.display = "inline";
//                     rectoolactive = true;
//                     if (hold) {
//                         //ctx.putImageData(img, 0, 0);
//                         curX = e.offsetX - prevX;
//                         curY = e.offsetY - prevY;
//                         //ctx.strokeRect(prevX, prevY, curX, curY);

//                         rect.setAttributeNS(null, 'x', prevX);
//                         rect.setAttributeNS(null, 'y', prevY);
//                         rect.setAttributeNS(null, 'width', curX);
//                         rect.setAttributeNS(null, 'height', curY);
//                         rect.setAttributeNS(null, 'fill', "none");
//                         rect.setAttributeNS(null, 'stroke', ctx.strokeStyle);
//                         rect.setAttributeNS(null, 'stroke-width', 5);

//                         svg.appendChild(rect);
//                         //document.getElementById("svgovercanvas").innerHTML = svgrect;
//                         // svgrectfinal = svgrect;
//                     }

//                 }

//                 svg.onmouseup = function (e) {
//                     hold = false;
//                     ++rectcount;
//                     var realendx = curX + prevX;
//                     var realendy = curY + prevY;
//                     var compensatedx = realendx - 15;
//                     var compensatedy = realendy - 15;
//                     var labelY = prevY - 3;
//                     //FINDING ACTIVE LABEL
//                     for (var i = 0; i < labelcolorarray.length; i++) {
//                         if (ctx.fillStyle.toUpperCase() == labelcolorarray[i].toUpperCase()) {
//                             activelabel = labelarray[i];
//                         }
//                     }
//                     svg.removeChild(rect);
//                     var svgrect = '<rect id=rectangle' + rectcount + ' x="' + prevX + '" y="' + prevY + '" width="' + curX + '" height="' + curY + '" onmouseover="showrectelements(' + rectcount + ')" onmouseout="hiderectelements(' + rectcount + ')" fill="none" stroke="' + ctx.fillStyle + '" stroke-width="' + defaultlinewidth + '"/>';
//                     var svgrectborder = '<rect id=rectborder' + rectcount + ' x="' + prevX + '" y="' + prevY + '" width="' + curX + '" height="' + curY + '" onmouseover="showrectelements(' + rectcount + ')" onmouseout="hiderectelements(' + rectcount + ')" style="fill:none;stroke-width:' + defaultlinewidth + ';stroke:#b30000;display:none" />';
//                     //var svgrectdel = '<circle style="display:none" id=rectdel' + rectcount +' cx="' + realendx + '" cy="' + realendy + '" r="10" fill="black" onclick="removerect(' + rectcount + ')" onmouseover="showrectelements(' + rectcount + ')" onmouseout="hiderectelements(' + rectcount + ')" />';
//                     var svgrectdel = '<image id=rectdel' + rectcount + ' href="static/pngguru.png" x="' + compensatedx + '" y="' + compensatedy + '" height="25px" width="25px" style="display:none;cursor:pointer" onclick="removerect(' + rectcount + ')" onmouseover="showrectelements(' + rectcount + ')" onmouseout="hiderectelements(' + rectcount + ')" />'
//                         + '<text id=recttext' + rectcount + ' x="' + prevX + '" y="' + labelY + '" fill="' + ctx.fillStyle + '">' + activelabel + '</text>';

//                     //alert(svgrect);
//                     //alert(svgrectborder);
//                     document.getElementById("svgovercanvas").innerHTML += svgrect;
//                     document.getElementById("svgovercanvas").innerHTML += svgrectborder;
//                     document.getElementById("svgovercanvas").innerHTML += svgrectdel;

//                     var startxcalc = imgrealwidth * prevX;
//                     var startycalc = imgrealheight * prevY;
//                     var endxcalc = imgrealwidth * realendx;
//                     var endycalc = imgrealheight * realendy;

//                     var finalstartxcalc = startxcalc / width;
//                     var finalstartycalc = startycalc / height;
//                     var finalendxcalc = endxcalc / width;
//                     var finalendycalc = endycalc / height;

//                     for (var i = 0; i < labelarray.length; i++) {
//                         if (ctx.fillStyle.toUpperCase() == labelcolorarray[i].toUpperCase()) {
//                             pushlabel = labelarray[i];
//                             pushstartx = finalstartxcalc;
//                             pushstarty = finalstartycalc;
//                             pushendx = finalendxcalc;
//                             pushendy = finalendycalc;
//                             pushtool = "Rectangle Tool";
//                             pushcolor = labelcolorarray[i];
//                             svg_rectdata.push({
//                                 image_name: pushimagename, label: pushlabel, startx: pushstartx,
//                                 starty: pushstarty, endx: pushendx, endy: pushendy, tool: pushtool, color: pushcolor,
//                                 index: rectcount, annotator: username, annotationindex: annotationindex, annotationid: annotationid
//                             });
//                         }
//                     }
//                     // for(var i=0;i<svg_rectdata.length;i++){
//                     //     alert(svg_rectdata[i].image_name+" "+svg_rectdata[i].label+" "+svg_rectdata[i].startx+" "+svg_rectdata[i].starty+" "+svg_rectdata[i].endx+" "+svg_rectdata[i].endy+" "+svg_rectdata[i].tool+" "+svg_rectdata[i].color+"||");
//                     // }
//                     var arraylength = svg_data.length;
//                     var data = '<h6 style="font-size:13px">Image Name : <font color="red">' + pushimagename + '</font></h6>'
//                         + '<h6 style="font-size:13px"> X :  <font color="red">' + finalstartxcalc + '</font></h6>'
//                         + '<h6 style="font-size:13px"> Y :  <font color="red">' + finalstartycalc + '</font></h6>'
//                         + '<h6 style="font-size:13px"> Width :  <font color="red">' + curX + '</font></h6>'
//                         + '<h6 style="font-size:13px"> Height :  <font color="red">' + curY + '</font></h6>';
//                     document.getElementById("annotationdata").innerHTML = data;
//                     ++recordannotation;
//                     document.getElementById("recordannotation").innerHTML = recordannotation;
//                 }

//                 // canvas.onmouseout = function (e) {
//                 //     hold = false;
//                 //     x.style.display = "none";
//                 // };
//             }
//         }
//     }
// }




// function pencil() {
//     if (labelarray.length == 0) {
//         modalbody = "Please create a label first!";
//         warningmodal();
//         callmodal();
//     } else {
//         if (ctx.fillStyle == "#000000" || ctx.fillstyle == "transparent") {
//             modalbody = "Please choose a color based on the label!";
//             warningmodal();
//             callmodal();
//         } else {
//             if (rectoolactive == true) {
//                 modalbody = "Rectangle tool is currently active. Please refresh the page to change tools!";
//                 warningmodal();
//                 callmodal();
//                 // if (confirm("We detected annotations of Rectangle tool. do you want to reset and switch to Dot tool?")) {
//                 //     reset();
//                 //     canvas.onmousemove = function (e) {
//                 //         x.style.display = "inline";
//                 //     };
//                 //     canvas.onmousedown = function (e) {
//                 //         // getPosition(e); 
//                 //         dottoolactive = true;
//                 //         curX = e.offsetX;
//                 //         curY = e.offsetY;
//                 //         //curX = e.clientX - canvas.offsetLeft;
//                 //         //curY = e.clientY - canvas.offsetTop;
//                 //         drawCoordinates(curX, curY);

//                 //         prevX = curX;
//                 //         prevY = curY;
//                 //         // // ctx.beginPath();
//                 //         // // ctx.moveTo(prevX, prevY);
//                 //     };
//                 //     canvas.onmouseout = function (e) {
//                 //         x.style.display = "none";
//                 //     };
//                 // }
//             } else {
//                 canvas.onmousemove = function (e) {
//                     x.style.display = "inline";
//                 };
//                 canvas.onmousedown = function (e) {
//                     // getPosition(e); 
//                     dottoolactive = true;
//                     curX = e.offsetX;
//                     curY = e.offsetY;
//                     //curX = e.clientX - canvas.offsetLeft;
//                     //curY = e.clientY - canvas.offsetTop;
//                     drawCoordinates(curX, curY);
//                     ++recordannotation;
//                     document.getElementById("recordannotation").innerHTML = recordannotation;
//                     prevX = curX;
//                     prevY = curY;
//                     // // ctx.beginPath();
//                     // // ctx.moveTo(prevX, prevY);
//                 };
//                 canvas.onmouseout = function (e) {
//                     x.style.display = "none";
//                 };
//             }
//         }
//     }
//     function drawCoordinates(x, y) {
//         ctx.beginPath();
//         ctx.arc(x, y, ctx.lineWidth, 0, Math.PI * 2, true);
//         ctx.fill();

//         var xcalculation = imgrealwidth * curX;
//         var ycalculation = imgrealheight * curY;
//         var finalxcalculation = xcalculation / width;
//         var finalycalculation = ycalculation / height;

//         for (var i = 0; i < labelarray.length; i++) {
//             if (ctx.fillStyle.toUpperCase() == labelarray[i].value.toUpperCase()) {
//                 pushlabel = labelarray[i].label;
//                 pushstartx = finalxcalculation;
//                 pushstarty = finalycalculation;
//                 pushendx = 0;
//                 pushendy = 0;
//                 pushtool = "Dot Tool";
//                 pushcolor = labelarray[i].value;
//                 savepost();
//                 // alert(pushtool);
//                 //canvas_data.pencil.push({ "label": labelarray[i].label, "startx": finalxcalculation, "starty": finalycalculation, "thick": ctx.lineWidth, "color": ctx.strokeStyle });
//             }
//         }
//     }
// }
//========================================
//function rectangle() {
//     if (labelarray.length == 0) {
//         modalbody = "Please create a label first!";
//         warningmodal();
//         callmodal();
//     } else {
//         if (ctx.fillStyle == "#000000") {
//             modalbody = "Please choose a color based on the label!";
//             warningmodal();
//             callmodal();
//         } else {
//             if (dottoolactive == true) {
//                 modalbody = "Pencil tool is active. Please refresh the page to change tools!";
//                 warningmodal();
//                 callmodal();
//                 // if (confirm("We detected annotations of Dot tool. Do you want to reset and switch to Rectangle tool?")) {
//                 //     reset();
//                 //     canvas.onmousedown = function (e) {
//                 //         rectoolactive = true;
//                 //         img = ctx.getImageData(0, 0, width, height);
//                 //         prevX = e.offsetX;
//                 //         prevY = e.offsetY;
//                 //         //prevX = e.clientX - canvas.offsetLeft;
//                 //         //prevY = e.clientY - canvas.offsetTop;
//                 //         hold = true;
//                 //     };

//                 //     canvas.onmousemove = function (e) {
//                 //         x.style.display = "inline";
//                 //         if (hold) {
//                 //             ctx.putImageData(img, 0, 0);
//                 //             curX = e.offsetX - prevX;
//                 //             curY = e.offsetY - prevY;

//                 //             ctx.strokeRect(prevX, prevY, curX, curY);
//                 //         }
//                 //     };

//                 //     canvas.onmouseup = function (e) {
//                 //         hold = false;
//                 //         var realendx = curX + prevX;
//                 //         var realendy = curY + prevY;

//                 //         var startxcalc = imgrealwidth * prevX;
//                 //         var startycalc = imgrealheight * prevY;
//                 //         var endxcalc = imgrealwidth * realendx;
//                 //         var endycalc = imgrealheight * realendy;

//                 //         var finalstartxcalc = startxcalc / width;
//                 //         var finalstartycalc = startycalc / height;
//                 //         var finalendxcalc = endxcalc / width;
//                 //         var finalendycalc = endycalc / height;
//                 //         for (var i = 0; i < labelarray.length; i++) {
//                 //             if (ctx.fillStyle.toUpperCase() == labelarray[i].value) {
//                 //                 pushlabel = labelarray[i].label;
//                 //                 pushstartx = finalstartxcalc;
//                 //                 pushstarty = finalstartycalc;
//                 //                 pushendx = finalendxcalc;
//                 //                 pushendy = finalendycalc;
//                 //                 pushtool = "Rectangle Tool";
//                 //                 pushcolor = labelarray[i].value;
//                 //                 savepost();
//                 //                 //canvas_data.rectangle.push({ "label": labelarray[i].label, "starx": finalstartxcalc, "stary": finalstartycalc, "endx": finalendxcalc, "endy": finalendycalc, "recwidth": curX, "recheight": curY, "thick": ctx.lineWidth, "stroke": stroke_value, "stroke_color": ctx.strokeStyle });
//                 //             }
//                 //         }
//                 //     };

//                 //     canvas.onmouseout = function (e) {
//                 //         hold = false;
//                 //         x.style.display = "none";
//                 //     };

//                 //}
//             } else {
//                 canvas.onmousedown = function (e) {
//                     img = ctx.getImageData(0, 0, width, height);
//                     prevX = e.offsetX;
//                     prevY = e.offsetY;
//                     //prevX = e.clientX - canvas.offsetLeft;
//                     //prevY = e.clientY - canvas.offsetTop;
//                     hold = true;
//                 };

//                 canvas.onmousemove = function (e) {
//                     x.style.display = "inline";
//                     rectoolactive = true;
//                     if (hold) {
//                         ctx.putImageData(img, 0, 0);
//                         curX = e.offsetX - prevX;
//                         curY = e.offsetY - prevY;

//                         ctx.strokeRect(prevX, prevY, curX, curY);
//                     }
//                 };

//                 canvas.onmouseup = function (e) {
//                     hold = false;
//                     var realendx = curX + prevX;
//                     var realendy = curY + prevY;

//                     var startxcalc = imgrealwidth * prevX;
//                     var startycalc = imgrealheight * prevY;
//                     var endxcalc = imgrealwidth * realendx;
//                     var endycalc = imgrealheight * realendy;

//                     var finalstartxcalc = startxcalc / width;
//                     var finalstartycalc = startycalc / height;
//                     var finalendxcalc = endxcalc / width;
//                     var finalendycalc = endycalc / height;

//                     for (var i = 0; i < labelarray.length; i++) {
//                         if (ctx.fillStyle.toUpperCase() == labelarray[i].value.toUpperCase()) {
//                             pushlabel = labelarray[i].label;
//                             pushstartx = finalstartxcalc;
//                             pushstarty = finalstartycalc;
//                             pushendx = finalendxcalc;
//                             pushendy = finalendycalc;
//                             pushtool = "Rectangle Tool";
//                             pushcolor = labelarray[i].value;
//                             savepost();
//                             //canvas_data.rectangle.push({ "label": labelarray[i].label, "starx": finalstartxcalc, "stary": finalstartycalc, "endx": finalendxcalc, "endy": finalendycalc, "recwidth": curX, "recheight": curY, "thick": ctx.lineWidth, "stroke": stroke_value, "stroke_color": ctx.strokeStyle });
//                         }
//                     }
//                     ++recordannotation;
//                     document.getElementById("recordannotation").innerHTML = recordannotation;
//                 };

//                 canvas.onmouseout = function (e) {
//                     hold = false;
//                     x.style.display = "none";
//                 };
//             }
//         }
//     }

// }
//=========================
// function deletelabel(y) {
//     modaltitle = "Please Confirm Action";
//     modalbody = "Are you sure you want to delete  " + labelarray[y].label + "  ?";
//     modalfooter = '<button type="button" class="btn btn-danger" data-dismiss="modal" onclick="deletelabelconfirmed(' + y + ')">Delete</button>'
//         + '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>';
//     callmodal();

//     // if (confirm("Are you sure you want to delete  " + labelarray[y].label + "  ?")) {
//     //     if (labelarray[y].value == ctx.fillStyle) {
//     //         color('transparent');
//     //         ctx.fillStyle = "transparent";
//     //         colorList.push(labelarray[y].value);

//     //         labelarray.splice(y, 1);
//     //         printlabelarray();
//     //         alert("Same");
//     //     } else {
//     //         colorList.push(labelarray[y].value);

//     //         labelarray.splice(y, 1);
//     //         printlabelarray();
//     //         alert("Different");
//     //     }
//     // }
// }
//======================
// function deletelabelconfirmed(y) {
//     if (labelarray[y].value.toUpperCase() == ctx.fillStyle.toUpperCase()) {
//         color('transparent');
//         ctx.fillStyle = "transparent";
//         colorList.push(labelarray[y].value);
//         labelarray.splice(y, 1);
//         printlabelarray();
//     } else {
//         colorList.push(labelarray[y].value);
//         labelarray.splice(y, 1);
//         printlabelarray();
//     }
// }
//========================
//// function deldummyjs() {
//     var element = document.getElementById("testcircle");
//     element.parentNode.removeChild(element);
// }

// function dummyjs() {
//     //var dummyvar='<circle id="circleborder1" cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="none" onclick="alerttest()" onmouseout="hidedummyjs()"/>';
//     document.getElementById("testcircle1").style.display = "inline";
//     document.getElementById("deltestcircle1").style.display = "inline";
//     // document.getElementById("testcircle1").innerHTML += dummyvar;
// }

// function hidedummyjs() {
//     document.getElementById("testcircle1").style.display = "none";
//     document.getElementById("deltestcircle1").style.display = "none";
// }
//=================================
    //     if (labelarray[y].value.toUpperCase() == ctx.fillStyle.toUpperCase()) {
    //         color('transparent');
    //         ctx.fillStyle = "transparent";
    //         colorList.push(labelarray[y].value);
    //         labelarray.splice(y, 1);
    //         printlabelarray();
    //     } else {
    //         colorList.push(labelarray[y].value);
    //         labelarray.splice(y, 1);
    //         printlabelarray();
    //     }

    // for(var num=0;num< labelcolorarray.length;num++){

    //     if(labelcolorarray[num] != colorList[num]){

    //         colorListNew.push(colorList[num]);
    //         colorList.splice(num, 1);

    //     }
    // }
//old draw html element feature
//canvas.onmousedown = function (e) {
                //     // getPosition(e); 
                //     dottoolactive = true;
                //     curX = e.offsetX;//* scaleX; //- canvas.offsetLeft;
                //     curY = e.offsetY;//* scaleY;// -canvas.offsetTop;
                //     newX = (e.clientX - rectt.left) * scaleX;
                //     newY = (e.clientY - rectt.top) * scaleY;

                //     //new2X = (e.clientX - rectt.left) / (rectt.right - rectt.left) * canvas.width;
                //     //new2y= (e.clientY - rectt.top) / (rectt.bottom - rectt.top) * canvas.height;
                //     // newX = e.clientX - canvas.left;
                //     // newY = e.clientY - canvas.top;
                //     dotovercanvas += '<div style="cursor:crosshair;position:absolute;width:7px;height:7px;top:' + curY + 'px;left:' + curX + 'px;border-radius:50%;background-color:' + ctx.fillStyle + '">   </div>';
                //     dotovercanvas += '<button style="position:absolute;top:50px;right:350px">test</button>';
                //     document.getElementById("overcanvas").innerHTML = dotovercanvas;


                //     //curX = e.clientX - canvas.offsetLeft;
                //     //curY = e.clientY - canvas.offsetTop;
                //     // drawCoordinates(curX, curY);
                //     ++recordannotation;
                //     document.getElementById("recordannotation").innerHTML = recordannotation;
                //     // prevX = curX;
                //     // prevY = curY;
                //     // // ctx.beginPath();
                //     // // ctx.moveTo(prevX, prevY);
                // };
//==================================================
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
//DARI SCRIPT-RESULT
function test(){
     for (var i = 0; i < yourantnimgidunique.length; i++) {
        alert(yourantnimgidunique[i].annotationid);
        var images = '<canvas class="mr-3 mb-3 hvr-grow" id="'+yourantnimgidunique[i].annotationid +'" width="300" height="300"></canvas>';
        document.getElementById("yourresultlist").innerHTML += images;
        var canvas = document.getElementById(yourantnimgidunique[i].annotationid);
        var ctx = canvas.getContext("2d");
        var image = document.getElementById(yourantnimgidunique[i].imagename);
        imgrealwidth = image.width;
        imgrealheight = image.height;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        for (var y = 0; y < yourresultarray.length; y++) {
            if (yourantnimgidunique[i].annotationid == yourresultarray[y].annotationid) {
                if (yourresultarray[y].tool == 'Dot Tool') {
                    var convertstartx = yourresultarray[y].startx * 300 / imgrealwidth;
                    var convertstarty = yourresultarray[y].starty * 300 / imgrealheight;
                    ctx.beginPath();
                    ctx.arc(convertstartx, convertstarty, 4, 0, Math.PI * 2, true);
                    ctx.fill();
                } else {
                    // var convertstartx = yourresultarray[y].startx * 300 / imgrealwidth;
                    // var convertstarty = yourresultarray[y].starty * 300 / imgrealheight;
                    // var convertendx = yourresultarray[y].endx * 300 / imgrealwidth;
                    // var convertendy = yourresultarray[y].endy * 300 / imgrealheight;
                    // var width = convertendx - convertstartx;
                    // var height = convertendy - convertstarty;
                    // images += '<rect x="'+convertstartx+'" y="'+convertstarty+'" width="'+width+'" height="'+height+'" fill="none" stroke="red" stroke-width="4"/>';
                }
            }
        }
        // alert("success");
    }
}

function test2() {
    for (var i = 0; i < yourantnimgidunique.length; i++) {
        var images = '<div style="position:relative"><img src="static/images/'+yourantnimgidunique[i].imagename+'" class="mb-3 mr-3 hvr-grow" width=300 height=300>'
				+'<svg class="hvr-fade" id="svgovercanvas" style="position:absolute;left: 0px; top:0px;z-index: 2;cursor:pointer"width=300 height=300> ';
        var getimage = document.getElementById(yourannotationimgid[i].imagename);
        imgrealwidth = getimage.width;
        imgrealheight = getimage.height;
        for (var y = 0; y < yourresultarray.length; y++) {
            if (yourantnimgidunique[i].annotationid == yourresultarray[y].annotationid) {
                if (yourresultarray[y].tool == 'Dot Tool') {
                    var convertstartx = yourresultarray[y].startx * 300 / imgrealwidth;
                    var convertstarty = yourresultarray[y].starty * 300 / imgrealheight;
                    images += '<circle cx="'+convertstartx+'" cy="'+convertstarty+'" r="4" fill="red" />';
                } else {
                    var convertstartx = yourresultarray[y].startx * 300 / imgrealwidth;
                    var convertstarty = yourresultarray[y].starty * 300 / imgrealheight;
                    var convertendx = yourresultarray[y].endx * 300 / imgrealwidth;
                    var convertendy = yourresultarray[y].endy * 300 / imgrealheight;
                    var width = convertendx - convertstartx;
                    var height = convertendy - convertstarty;
                    images += '<rect x="'+convertstartx+'" y="'+convertstarty+'" width="'+width+'" height="'+height+'" fill="none" stroke="red" stroke-width="4"/>';
                }
            }
        }
        images += '</svg></div>';
        document.getElementById("yourresultlist").innerHTML += images;
        // alert("success");
    }
}

function loadyourresult(){
    for (var i = 0; i < yourantnimgidunique.length; i++) {
        var images = '<svg width="300" height="300" style="cursor:pointer" class="mr-3 mb-3 hvr-grow">';
        images += '<image xlink:href="static/images/'+ yourantnimgidunique[i].imagename +'" width="300" height="300" x="0" y="0" />';
        // alert("1"); //passed
        for(var z=0;z<imagearray.length;z++){
            if(yourantnimgidunique[i].imagename == imagearray[z]){
                var image = document.getElementById(imagearray[z]);
                imgrealwidth = image.width;
                imgrealheight = image.height;
                // alert(imgrealheight + " " + imgrealwidth);
            }
        }
        for (var y = 0; y < yourresultarray.length; y++) {
            if (yourantnimgidunique[i].annotationid == yourresultarray[y].annotationid) {
                if (yourresultarray[y].tool == 'Dot Tool') {
                    var convertstartx = yourresultarray[y].startx * 300 / imgrealwidth;
                    var convertstarty = yourresultarray[y].starty * 300 / imgrealheight;
                    images += '<circle cx="'+convertstartx+'" cy="'+convertstarty+'" r="4" fill="red" />';
                } else {
                    var convertstartx = yourresultarray[y].startx * 300 / imgrealwidth;
                    var convertstarty = yourresultarray[y].starty * 300 / imgrealheight;
                    var convertendx = yourresultarray[y].endx * 300 / imgrealwidth;
                    var convertendy = yourresultarray[y].endy * 300 / imgrealheight;
                    var width = convertendx - convertstartx;
                    var height = convertendy - convertstarty;
                    images += '<rect x="'+convertstartx+'" y="'+convertstarty+'" width="'+width+'" height="'+height+'" fill="none" stroke="red" stroke-width="4"/>';
                }
            }
        }
        images += '</svg>';
        document.getElementById("yourresultlist").innerHTML += images;
        // alert("success");
    }

}

/ function loadresult() {
//     // var images = '<svg width="300" height="300" style="cursor:pointer" class="mr-3 mb-3 hvr-grow">' 
//     // 			+'<image xlink:href="static/images/images (2).jpeg" width="300" height="300" x="0" y="0" />'
//     // 		+'</svg>';
//     //bikin list baru dari yourresultarray untuk khusus annotationid aja, nanti dibikin unique
//     //bikin list baru dari yourresultarray jg untuk annotationid dan image, utk di compare
//     for (var i = 0; i < annotationidarray.length; i++) {
//         var images = '<svg width="300" height="300" style="cursor:pointer" class="mr-3 mb-3 hvr-grow">';
//         for(var z=0;z< imageannotationid.length; z++){
//             if(annotationidarray[i] == imageannotationid[z].annotationid){
//                 images+='<image xlink:href="static/images/images (2).jpeg" width="300" height="300" x="0" y="0" />';
//             }
//         }

//         for (var y = 0; y < yourresultarray.length; i++) {
//             if (annotationidarray[i] == yourresultarray[y].annotationid) {
//                 if (yourresultarray[y].tool == 'Dot Tool') {
//                     images += '<circle id="testcircle" cx="50" cy="50" r="40" fill="yellow" />';

//                 } else {
//                     images += '<rect>'
//                 }
//             }
//         }
//         images += '</svg>';
//         document.getElementById("yourresultlist").innerHTML += images;
//     }
// }

// function removeDuplicates(myArr, prop) {
//     return myArr.filter((obj, pos, arr) => {
//         return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
//     });
// }
// for(var i = 0;i<yourannotationidunique.length;i++){
//     for(var y =0;y<yourresultarray.length;y++){
//         if(yourresultarray[y].annotationid == yourannotationidunique[i]){
//             for( var z=0;z<yourannotationimgid.length;z++){
//                 var check = yourannotationimgid[z].annotationid.includes(yourannotationidunique[i]);
//                 if(check == false){
//                     yourannotationimgid.push({ imagename: yourresultarray[i].imagename, annotationid: yourresultarray[i].annotationid });
//                     alert("success");
//                 }
//             }
//         }
//     }
// }