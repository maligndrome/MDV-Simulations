var f0, m, _dR, k;
    var Wn, zeta, ampFactor;
    var ctx = document.getElementById('simscreen').getContext('2d');
    var t = 0,
        t_g = 0;
    var y_context = document.getElementById('YofT');
    var YofT = document.getElementById('YofT').getContext('2d');
    var ampPlot = document.getElementById('ampPlot').getContext('2d');
    var phasePlot = document.getElementById('phasePlot').getContext('2d');
    var opPoint = document.getElementById('PlotOverlay').getContext('2d');
    var force = document.getElementById('force');
    window.onload = function() {
        $('#stiffnessslider').slider({
            max: 100,
            min: 10,
            step: 1
        }); // slider initialisation : jQuery widget
        $('#stiffnessspinner').spinner({
            max: 100,
            min: 10,
            step: 1
        }); // number initialisation : jQuery widget        
        // monitoring change in value and connecting slider and number
        // setting trace point coordinate arrays to empty on change of link length
        $("#stiffnessslider").on("slide", function(e, ui) {
            $('#stiffnessspinner').spinner("value", ui.value);
            varupdate(true);
        });
        $("#stiffnessspinner").on("spin", function(e, ui) {
            $('#stiffnessslider').slider("value", ui.value);
            varupdate(true);
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
            varupdate(true);
        });
        $("#massspinner").on("spin", function(e, ui) {
            $('#massslider').slider("value", ui.value);
            varupdate(true);
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
            varupdate(true);
        });
        $("#dampingspinner").on("spin", function(e, ui) {
            $('#dampingslider').slider("value", ui.value);
            varupdate(true);
        });


        //Variable damping slider and number input types
        $('#fAmpslider').slider({
            max: 10,
            min: 1,
            step: 1
        }); // slider initialisation : jQuery widget
        $('#fAmpspinner').spinner({
            max: 10,
            min: 1,
            step: 1
        }); // number initialisation : jQuery widget        
        // monitoring change in value and connecting slider and number
        // setting trace point coordinate arrays to empty on change of link length
        $("#fAmpslider").on("slide", function(e, ui) {
            $('#fAmpspinner').spinner("value", ui.value);
            varupdate();
        });
        $("#fAmpspinner").on("spin", function(e, ui) {
            $('#fAmpslider').slider("value", ui.value);
            varupdate();
        });

        //Variable damping slider and number input types
        $('#fFreqslider').slider({
            max: 50,
            min: 5,
            step: 1
        }); // slider initialisation : jQuery widget
        $('#fFreqspinner').spinner({
            max: 50,
            min: 5,
            step: 1
        }); // number initialisation : jQuery widget        
        // monitoring change in value and connecting slider and number
        // setting trace point coordinate arrays to empty on change of link length
        $("#fFreqslider").on("slide", function(e, ui) {
            $('#fFreqspinner').spinner("value", ui.value);
            varupdate();
        });
        $("#fFreqspinner").on("spin", function(e, ui) {
            $('#fFreqslider').slider("value", ui.value);
            varupdate();
        });


        $('#stiffnessslider').slider('value', 10);
        $('#massslider').slider('value', 10);
        $('#dampingslider').slider('value', 0.3);
        $('#fAmpslider').slider('value', 10);
        $('#fFreqslider').slider('value', 10);
        $('#stiffnessspinner').spinner('value', 10);
        $('#massspinner').spinner('value', 10);
        $('#dampingspinner').spinner('value', 0.3);
        $('#fAmpspinner').spinner('value', 10);
        $('#fFreqspinner').spinner('value', 10);
        varupdate(true);
        $('#simplots').hide();
        ctx.moveTo(0, 100);
        ctx.lineTo(250, 100);
        ctx.lineTo(250 - 10 * Math.sin(70 * Math.PI / 180), 100 - 10 * Math.cos(70 * Math.PI / 180));
        ctx.moveTo(250, 100);
        ctx.lineTo(250 - 10 * Math.sin(70 * Math.PI / 180), 100 + 10 * Math.cos(70 * Math.PI / 180));
        ctx.font = "normal normal normal 12px arial";
        ctx.strokeText('Force(F)', 200, 150);
        ctx.moveTo(0, 300);
        ctx.lineTo(250, 300);

        ctx.lineTo(250 - 10 * Math.sin(70 * Math.PI / 180), 300 - 10 * Math.cos(70 * Math.PI / 180));
        ctx.moveTo(250, 300);
        ctx.lineTo(250 - 10 * Math.sin(70 * Math.PI / 180), 300 + 10 * Math.cos(70 * Math.PI / 180));
        ctx.strokeText('Displacement(x)', 150, 350);
        ctx.stroke();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 400);
        ctx.stroke();
        circle_fill(opPoint, 3, 'black', 20 + W * 4 / 3, 180 - 90 * (1 / Math.sqrt(Math.pow(1 - (W * W / (Wn * Wn)), 2) + Math.pow(2 * zeta * (W / Wn), 2))));
        circle_fill(opPoint, 3, 'black', 20 + W * 4 / 3, 200 - 180 * Math.atan2((-2 * zeta * W / Wn), (1 - (W * W / (Wn * Wn)))) / Math.PI);
        graphPlot();
        setInterval(code, 10);

    }

    function amp_Plot() {
        ampPlot.lineWidth = 1;
        ampPlot.strokeStyle = "black";
        ampPlot.beginPath();
        ampPlot.moveTo(20, 180);
        ampPlot.lineTo(20, 0);
        ampPlot.lineTo(20 - 10 * Math.sin(30 * Math.PI / 180), 10 * Math.cos(30 * Math.PI / 180));
        ampPlot.moveTo(20, 0);
        ampPlot.lineTo(20 + 10 * Math.sin(30 * Math.PI / 180), 10 * Math.cos(30 * Math.PI / 180));
        ampPlot.moveTo(20, 180);

        ampPlot.lineTo(400, 180);
        ampPlot.lineTo(400 - 10 * Math.sin(70 * Math.PI / 180), 180 - 10 * Math.cos(70 * Math.PI / 180));
        ampPlot.moveTo(400, 180);
        ampPlot.lineTo(400 - 10 * Math.sin(70 * Math.PI / 180), 180 + 10 * Math.cos(70 * Math.PI / 180));
        ampPlot.closePath();
        ampPlot.stroke();
        ampPlot.font = "normal normal normal 14px arial";
        ampPlot.strokeText('x/F', 0, 100);
        ampPlot.strokeText('Frequency(ω)', 100, 195);
        ampPlot.moveTo(20, 180);
        ampPlot.beginPath();
        for (i = 0; i <= 300; i += 0.75) {
            if (i != Wn && i + 1 != Wn)
                ampPlot.lineTo(20 + i * 4 / 3, 180 - 90 * (1 / Math.sqrt(Math.pow(1 - (i * i / (Wn * Wn)), 2) + Math.pow(2 * zeta * (i / Wn), 2))));
        }
        ampPlot.strokeStyle = "red";
        ampPlot.stroke();
    }

    function phase_Plot() {
        phasePlot.lineWidth = 1;
        phasePlot.strokeStyle = "black";
        phasePlot.beginPath();
        phasePlot.moveTo(20, 180);
        phasePlot.lineTo(20, 0);
        phasePlot.lineTo(20 - 10 * Math.sin(30 * Math.PI / 180), 10 * Math.cos(30 * Math.PI / 180));
        phasePlot.moveTo(20, 0);
        phasePlot.lineTo(20 + 10 * Math.sin(30 * Math.PI / 180), 10 * Math.cos(30 * Math.PI / 180));
        phasePlot.moveTo(20, 180);
        phasePlot.lineTo(400, 180);
        phasePlot.lineTo(400 - 10 * Math.sin(70 * Math.PI / 180), 180 - 10 * Math.cos(70 * Math.PI / 180));
        phasePlot.moveTo(400, 180);
        phasePlot.lineTo(400 - 10 * Math.sin(70 * Math.PI / 180), 180 + 10 * Math.cos(70 * Math.PI / 180));
        phasePlot.closePath();
        phasePlot.stroke();
        phasePlot.moveTo(20, 180);
        phasePlot.beginPath();
        phasePlot.font = "normal normal normal 14px arial";
        phasePlot.strokeText('φ', 0, 100);
        phasePlot.strokeText('Frequency(ω)', 100, 195);
        for (i = 0; i <= 300; i += 0.75) {
            if (i != Wn && i + 1 != Wn)
                phasePlot.lineTo(20 + i * 4 / 3, 0 - 180 * Math.atan2((-2 * zeta * i / Wn), (1 - (i * i / (Wn * Wn)))) / Math.PI);
        }
        phasePlot.strokeStyle = "green";
        phasePlot.stroke();
    }

    function varupdate(plot) {

        opPoint.clearRect(0, 0, 400, 500);
        YofT.clearRect(0, 0, 550, 400);
        m = $("#massslider").slider('value');
        zeta = $("#dampingslider").slider('value');
        k = $("#stiffnessslider").slider('value') * 1000;
        f0 = $("#fAmpslider").slider('value');
        W = $("#fFreqslider").slider('value');
        Wn = Math.sqrt(k / m);
        ampFactor = 1 / Math.sqrt(Math.pow(1 - (W * W / (Wn * Wn)), 2) + Math.pow(2 * zeta * (W / Wn), 2));
        phi = Math.atan2((-2 * zeta * W / Wn), (1 - (W * W / (Wn * Wn))));
        circle_fill(opPoint, 3, 'black', 20 + W * 4 / 3, 180 - 90 * (1 / Math.sqrt(Math.pow(1 - (W * W / (Wn * Wn)), 2) + Math.pow(2 * zeta * (W / Wn), 2))));
        circle_fill(opPoint, 3, 'black', 20 + W * 4 / 3, 200 - 180 * Math.atan2((-2 * zeta * W / Wn), (1 - (W * W / (Wn * Wn)))) / Math.PI);
        if (plot == true) {
            ampPlot.clearRect(0, 0, 400, 200);
            amp_Plot();
            phasePlot.clearRect(0, 0, 400, 200);
            phase_Plot();
        }
        $('#commentboxright').html("<b>ω<sub>n</sub></b>=" + Wn.toFixed(2) + "<br /><b>ω</b>=" + W);
        if (Math.abs(Wn - W) < 2)
            $('#commentboxleft').html("Warning! Frequency is close to natural frequency!");
        else
            $('#commentboxleft').html("");
        graphPlot();
    }

    function graphPlot() {
        YofT.clearRect(0, 0, 250, 400);
        YofT.strokeStyle = "red";
        YofT.beginPath();
        YofT.moveTo(0, 300 + (5 + 15 * f0 / 10) * ampFactor * Math.sin((W * (-0.01)) + phi));
        for (t_g = 0; t_g <= 2; t_g += 0.01) {
            YofT.lineTo((t_g * 100), 300 + (5 + 15 * f0 / 10) * 2 * ampFactor * Math.sin((W * (t_g)) + phi));
        }

        YofT.stroke();
        YofT.strokeStyle = "blue";
        YofT.beginPath();
        YofT.moveTo(0, 100 + (5 + 15 * f0 / 10) * Math.sin((W * (-0.01))));
        for (t_g = 0; t_g <= 2; t_g += 0.01) {
            YofT.lineTo((t_g * 100), 100 + (5 + 15 * f0 / 10) * 2 * Math.sin((W * (t_g))));
        }
        YofT.stroke();
    }

    function code() {
        ctx.clearRect(250, 0, 550, 400);
        draw_mass(ctx, 275, 150 + (5 + 15 * f0 / 10) * ampFactor * Math.sin((10 * t) + phi), 150, 20 + 50 * ((m - 2) / 198));
        draw_spring(ctx, 300, 150 + (5 + 15 * f0 / 10) * ampFactor * Math.sin((10 * t) + phi), 300, 300, 5, 20);
        draw_damper(ctx, 400, 150 + (5 + 15 * f0 / 10) * ampFactor * Math.sin((10 * t) + phi), 400, 300, 150, 50);
        draw_base(ctx, 275, 300, 150, 10);
        ctx.drawImage(force, 320, 150 + (5 + 15 * f0 / 10) * ampFactor * Math.sin((10 * t) + phi) - 20 - 50 * ((m - 2) / 198) - 61);
        t += 0.01;
        if (t == 3) {
            t = 0;
            t_g = 0;
        }
    }

    function draw_mass(c_var, bottom_x, bottom_y, _width, _height) {
        c_var.fillStyle = "#630";
        c_var.fillRect(bottom_x, bottom_y - _height, _width, _height);
    }

    function draw_base(c_var, bottom_x, bottom_y, _width, _height) {
        c_var.fillStyle = "#000";
        c_var.fillRect(bottom_x, bottom_y, _width, _height);
    }

    function draw_spring(c_var, top_x, top_y, bottom_x, bottom_y, n_coils, coil_rad) {
        if (coil_rad == null || coil_rad == '')
            coil_rad = len / 10;
        var rad = coil_rad / 5;
        if (top_x != bottom_x) //develop later!!
        {
            var _m = (top_y - bottom_y) / (top_x - bottom_x);
            var _c = (-_m * bottom_x) + bottom_y;
            var len = Math.sqrt(((top_y - bottom_y) * (top_y - bottom_y)) + ((top_x - bottom_x) * (top_x - bottom_x)));
            var _df = 1 / Math.sqrt(1 + (_m * _m)); //distance factor
            c_var.arc(top_x, top_y, rad, 0, 360);
            c_var.arc(top_x + (len * 0.1 * _df), top_y + (_m * len * 0.1 * _df), rad, 0, 360);
            c_var.stroke();
            c_var.moveTo(bottom_x, bottom_y);
            c_var.arc(bottom_x, bottom_y, rad, 0, 360);
            c_var.arc(bottom_x - (len * 0.1 * _df), bottom_y - (_m * len * 0.1 * _df), rad, 0, 360);
            c_var.stroke();
        } else {
            var len = Math.sqrt(((top_y - bottom_y) * (top_y - bottom_y)) + ((top_x - bottom_x) * (top_x - bottom_x)));
            var i;
            line(c_var, top_x, top_y, top_x, top_y + (len * 0.1), '#F40B4B');
            line(c_var, bottom_x, bottom_y, bottom_x, bottom_y - (len * 0.1), '#F40B4B');

            for (i = 1; i <= n_coils; i++) {
                line(c_var, i == 1 ? top_x : (top_x - coil_rad), (top_y + ((i - 1) * len * 0.8 / n_coils) + len * 0.4 / n_coils), (top_x + coil_rad), (top_y + (i * len * 0.8 / n_coils)), '#F40B4B');
                line(c_var, (top_x + coil_rad), (top_y + (i * len * 0.8 / n_coils)), (top_x - coil_rad), (top_y + (i * len * 0.8 / n_coils) + len * 0.4 / n_coils), '#F40B4B');
            }
            line(c_var, (top_x - coil_rad), (top_y + ((i - 1) * len * 0.8 / n_coils) + len * 0.4 / n_coils), bottom_x, bottom_y - len / 10, '#F40B4B');
            circle_fill(c_var, rad, '#0E5770', top_x, top_y);
            circle_fill(c_var, rad, '#0E5770', top_x, top_y + (len * 0.1));
            circle_fill(c_var, rad, '#0E5770', bottom_x, bottom_y);
            circle_fill(c_var, rad, '#0E5770', bottom_x, bottom_y - (len * 0.1));
            for (i = 1; i <= n_coils; i++)
                circle_fill(c_var, rad, '#0E5770', top_x + coil_rad, top_y + (i * len * 0.8 / n_coils));
            for (i = 1; i <= n_coils; i++)
                circle_fill(c_var, rad, '#0E5770', top_x - coil_rad, top_y + (i * len * 0.8 / n_coils) + len * 0.4 / n_coils);


        }
    }

    function draw_damper(c_var, top_x, top_y, bottom_x, bottom_y, len, max_disp) {
        var pLen = len - max_disp; //piston length
        c_var.fillStyle = "#0CF";
        c_var.fillRect(bottom_x - 15, bottom_y - max_disp - 30, 30, max_disp + 10);
        line(c_var, top_x, top_y, top_x, top_y + pLen, 'blue');
        line(c_var, top_x - 10, top_y + pLen, top_x + 10, top_y + pLen, 'blue');
        line(c_var, bottom_x - 17, bottom_y - 20, bottom_x + 17, bottom_y - 20, 'blue');
        line(c_var, bottom_x - 15, bottom_y - pLen, bottom_x - 15, bottom_y - 20, 'blue');
        line(c_var, bottom_x + 15, bottom_y - pLen, bottom_x + 15, bottom_y - 20, 'blue');
        line(c_var, bottom_x, bottom_y, bottom_x, bottom_y - 20, 'blue');

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
