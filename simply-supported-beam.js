var globctr = 0,
        intT;
    var k, m, dR;
    var ymod, ami, L; //Young's modulus and Area moment of inertia, length
    var Wn, zeta, ampFactor;
    var ctx = document.getElementById('simscreen').getContext('2d');
    var graph_ctx = document.getElementById('graphs').getContext('2d');
    var t = 0,
        t_g = 0;
    var E = [200, 70.33, 111.006];
    var I = [3333.3, 12083.3, 5900.3, 13333.3, 7854];
    var string_I = ['i-section', 'c-section', 'l-section', 'sq-section', 'circ-section'];
    //initialize controls
    window.onload = function() {
        $('#simplots').hide();
        $('#lengthslider').slider({
            max: 2000,
            min: 200,
            step: 1
        }); // slider initialisation : jQuery widget
        $('#lengthspinner').spinner({
            max: 2000,
            min: 200,
            step: 1
        }); // number initialisation : jQuery widget        
        // monitoring change in value and connecting slider and number
        // setting trace point coordinate arrays to empty on change of link length
        $("#lengthslider").on("slide", function(e, ui) {
            $('#lengthspinner').spinner("value", ui.value);
            varupdate(2);
        });
        $("#lengthspinner").on("spin", function(e, ui) {
            $('#lengthslider').slider("value", ui.value);
            varupdate(2);
        });

        //Variable theta slider and number input types
        $('#massslider').slider({
            max: 200,
            min: 2,
            step: 1
        }); // slider initialisation : jQuery widget
        $('#massspinner').spinner({
            max: 200,
            min: 2,
            step: 1
        }); // number initialisation : jQuery widget        
        // monitoring change in value and connecting slider and number
        // setting trace point coordinate arrays to empty on change of link length
        $("#massslider").on("slide", function(e, ui) {
            $('#massspinner').spinner("value", ui.value);
            varupdate(3);
        });
        $("#massspinner").on("spin", function(e, ui) {
            $('#massslider').slider("value", ui.value);
            varupdate(3);
        });


        //Variable damping slider and number input types
        $('#dampingslider').slider({
            max: 1,
            min: 0.01,
            step: 0.01
        }); // slider initialisation : jQuery widget
        $('#dampingspinner').spinner({
            max: 1,
            min: 0.01,
            step: 0.01
        }); // number initialisation : jQuery widget        
        // monitoring change in value and connecting slider and number
        // setting trace point coordinate arrays to empty on change of link length
        $("#dampingslider").on("slide", function(e, ui) {
            $('#dampingspinner').spinner("value", ui.value);
            varupdate(4);
        });
        $("#dampingspinner").on("spin", function(e, ui) {
            $('#dampingslider').slider("value", ui.value);
            varupdate(4);
        });

        ymod = E[0];
        ami = I[0];
        $('#csa-display').children().hide();
        $('#' + string_I[0]).show();
        $('#lengthslider').slider('value', 1000);
        $('#massslider').slider('value', 50);
        $('#dampingslider').slider('value', 0.3);
        $('#lengthspinner').spinner('value', 1000);
        $('#massspinner').spinner('value', 50);
        $('#dampingspinner').spinner('value', 0.3);
        varupdate('all');
    }

    function varupdate(param) {
        if (param == 0) {
            var _in = document.getElementById('material').value;
            ymod = E[_in];
        } else if (param == 1) {
            var _in = document.getElementById('csa').value;
            ami = I[_in];
            $('#csa-display').children().hide();
            $('#' + string_I[_in]).show();
        } else if (param == 2) {
            L = $('#lengthslider').slider('value');
        } else if (param == 3) {
            m = $('#massslider').slider('value');
        } else if (param == 4) {
            dR = $('#dampingslider').slider('value');
        } else {
            L = $('#lengthslider').slider('value');
            m = $('#massslider').slider('value');
            dR = $('#dampingslider').slider('value');
        }
        k = 48 * ymod * ami / (L * L * L) * 1000000;
        Wn = Math.sqrt(k / m);
        globctr = 0;
        $('#commentboxleft').html('<b>k</b>=' + (k / 1000).toFixed(2) + ' N/mm<br/><b>m</b>=' + m.toFixed(2) + ' kg<br/><b>L</b>=' + L + ' mm');
        $('#commentboxright').html('<b>ω<sub>n</sub></b>=' + Wn.toFixed(2) + ' rad/s<br/><b>ω<sub>d</sub></b>=' + (Wn * Math.sqrt(1 - dR * dR)).toFixed(2) + ' rad/s<br/><b>ζ</b>=' + dR);
        clearInterval(intT);
        intT = setInterval(code, 16);
        plot_displacement();
        //plot_ampfreq();
        //console.log("Natural frequency="+Wn);
    }

    function plot_displacement() {
        var _L = (L * 0.1389 + 17.2222);
        var _m = (m * 0.3030 + 39.3939);
        graph_ctx.clearRect(30, 0, 500, 500);
        graph_ctx.beginPath();
        graph_ctx.moveTo(30, 80);
        graph_ctx.lineTo(30, 320);
        graph_ctx.moveTo(30, 200);
        graph_ctx.lineTo(320, 200);
        graph_ctx.closePath();
        graph_ctx.strokeStyle = 'black';
        graph_ctx.stroke();
        graph_ctx.moveTo(30, 200);
        graph_ctx.beginPath();
        for (var ctr = 0; ctr < 250; ctr++) {
            graph_ctx.lineTo(30 + ctr, 200 + _m * Math.exp(-5 * dR * Wn * 0.1 * ctr / 1000) * Math.sin(0.1 * ctr));
        }
        for (var ctr = 250; ctr > 0; ctr--) {
            graph_ctx.lineTo(30 + ctr, 200 + _m * Math.exp(-5 * dR * Wn * 0.1 * ctr / 1000) * Math.sin(0.1 * ctr));
        }
        graph_ctx.closePath();
        graph_ctx.strokeStyle = 'brown';
        graph_ctx.stroke();
        graph_ctx.fillText("t", 280, 220);
        graph_ctx.fillText("X", 10, 100);
        graph_ctx.fillText("Displacement(x) v/s Time(t)", 80, 80);
    }

    function plot_ampfreq() {
        var ctr = 0;
        var _L = (L * 0.1389 + 17.2222);
        var _m = (m * 0.3030 + 39.3939);
        graph_ctx.clearRect(330, 0, 550, 400);
        graph_ctx.moveTo(330, 20);
        graph_ctx.lineTo(330, 380);
        graph_ctx.moveTo(330, 400);
        graph_ctx.lineTo(530, 400);
        graph_ctx.strokeStyle = 'black';
        graph_ctx.stroke();
        graph_ctx.beginPath();
        graph_ctx.moveTo(330, 400)
        for (; ctr < 200; ctr++) {
            graph_ctx.lineTo(330 + ctr, 400 - _m * Math.exp(-5 * dR * 0.01 * ctr / 1000));
        }
        graph_ctx.strokeStyle = 'brown';
        graph_ctx.stroke();
    }

    function code() {
        ctx.clearRect(0, 0, 550, 400);
        var _L = (L * 0.1389 + 17.2222);
        var _m = (m * 0.3030 + 29.3939);
        var temp = Math.exp(-5 * dR * Wn * globctr / 1000);
        var mpx = 120 + _L / 2; //80,185-->120+_L/2,185+_m*Math.sin(globctr)-->160+_L,185
        var mpy = 235 + 0.5 * (_m * temp * Math.sin(globctr));
        add_support(ctx, 80, 245);
        add_support(ctx, 160 + _L, 245, true);
        ctx.beginPath();
        ctx.moveTo(80, 225);
        ctx.quadraticCurveTo(120 + _L / 2, 225 + _m * temp * Math.sin(globctr), 160 + _L, 225);
        ctx.lineTo(160 + _L, 245);
        ctx.quadraticCurveTo(120 + _L / 2, 245 + _m * temp * Math.sin(globctr), 80, 245);
        ctx.lineTo(80, 225);
        ctx.fillStyle = 'black';
        ctx.fill();
        circle_fill(ctx, _m / 2, 'blue', mpx, mpy);
        globctr += 0.1;
        if (temp < 0.05) {
            clearInterval(intT);
        }
    }

    function add_support(canvas, x, y,roller) {
        canvas.fillStyle = 'brown';
        canvas.moveTo(x, y);
        canvas.beginPath();
        canvas.lineTo(x - 15, y + 30);
        canvas.lineTo(x + 15, y + 30);
        canvas.lineTo(x, y);
        canvas.fill();
        if(roller===true){
            circle_fill(canvas,3, 'black', x-10, y+33);
            circle_fill(canvas,3, 'black', x, y+33);
            circle_fill(canvas,3, 'black', x+10, y+33);
            canvas.moveTo(x-15,y+36);
            canvas.lineTo(x+15,y+36);
            canvas.stroke();
        }
    }

    function circle_fill(canvas, rad, color, x, y) {
        canvas.fillStyle = color;
        canvas.beginPath();
        canvas.arc(x, y, rad, 0, 360);
        canvas.closePath();
        canvas.fill();
    }

    function line(canvas, x1, y1, x2, y2, color) {
        canvas.strokeStyle = color;
        canvas.lineWidth = 5;
        canvas.beginPath();
        canvas.moveTo(x1, y1);
        canvas.lineTo(x2, y2);
        canvas.stroke();
        canvas.closePath();
    }
    curr_flag = 0;

    function prev() {
        --curr_flag;
        if (curr_flag == 0) {
            $('#sim').show();
            $('#simplots').hide();
        }
        $('#next').show();
        $('#prev').hide();
    }

    function next() {
        ++curr_flag;
        if (curr_flag == 1) {
            $('#sim').hide();
            $('#simplots').show();
        }
        $('#prev').show();
        $('#next').hide();

    }
