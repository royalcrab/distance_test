
let hider_canvas = (function()
{

    let mainview;
    let ctx;
    let drawFlag = false;
    
    let offset = 0;
    let pre;

    let points = null;
    let figures = []

    function init()
    {
        mainview = document.getElementById('canvas');
        ctx = mainview.getContext('2d');

        mainview.addEventListener("mousedown",mouseStart);
        mainview.addEventListener("mousemove",mouseMove);
        mainview.addEventListener("mouseup",mouseEnd);
        mainview.addEventListener("mouseleave",mouseEnd);

        retry(1);
    }

    function retry(num)
    {
        if ( num == 0 ){
            ctx.fillStyle = "lightgray";
            ctx.fillRect(0,0,800,800);
            let th = 0;

            ctx.strokeStyle = "white";
            for ( let x = 0; x < 800; x += 100 ){
                for ( let y = 0; y < 800; y += 100 ){
                    let cx = x+50;
                    let cy = y+50;

                    let sx = Math.sin(th*Math.PI/360.0);
                    let sy = Math.cos(th*Math.PI/180.0);
                    
                    ctx.beginPath();
                    ctx.moveTo(cx-sx*45,cy-sy*45);
                    ctx.lineTo(cx+sx*45,cy+sy*45);
                    
                    ctx.stroke();

                    th += 5.0;
                }
            }
        } else if ( num == 1 ){
            ctx.fillStyle = "lightgray";
            ctx.fillRect(0,0,800,800);
            ctx.strokeStyle = "white";

            let phi = 0;
            let lines = []

            for ( let x = 0; x < 800; x += 100 ){
                for ( let y = 0; y < 800; y += 100 ){
                    let cx = x+50;
                    let cy = y+50;

                    ctx.beginPath();

                    for ( let th = 0; th < 361; th += 1){
                        let sx = Math.sin(th*Math.PI/180.0);
                        let sy = Math.cos(th*Math.PI/180.0);

                        let xx = sx*40;
                        let yy = sy*30;

                        let tx = xx * Math.cos(phi*Math.PI/180.0) - yy * Math.sin(phi*Math.PI/180.0) + cx;
                        let ty = xx * Math.sin(phi*Math.PI/180.0) + yy * Math.cos(phi*Math.PI/180.0) + cy;

                        if ( th == 0 ){
                            ctx.moveTo( tx, ty );
                            lines.push({x: tx, y: ty});
                            continue;
                        }

                        ctx.lineTo( tx, ty );
                        lines.push({x: tx, y: ty});
                    }
                    
                    ctx.stroke();
                    phi += 360.0/64.0;
                }
            }
        }
    }

    function getMousePosition(canvas, evt) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function mouseStart(ev){
        drawFlag = true;
        let pos = getMousePosition(mainview, ev);
        pre = {x: pos.x-offset, y: pos.y-offset};
        points = [pre];
    }

    function drawLine(ev)
    {
        let pos = getMousePosition(mainview, ev);

        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(pre.x, pre.y);
        ctx.lineTo(pos.x-offset, pos.y-offset);
        ctx.stroke();

        pre = {x: pos.x-offset, y: pos.y-offset};
        points.push( pre );
    }

    function mouseEnd(ev){
        if ( drawFlag == true ){
            drawLine(ev);
            checkCurve();
            console.log(points);
        }
        drawFlag = false;
    }

    function mouseMove(ev){
        if ( drawFlag == false ) return;
        drawLine(ev);
        //console.log(pos);
    }

    function checkCurve()
    {
        if ( points.length < 5 ) return;
        let arr = [];
        let g = 5;

        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.beginPath();

        for ( let i = 0; i < points.length - 5*g; i++ ){
            let tmp = [
                {x: points[i].x, y: points[i].y },
                {x: points[i+1*g].x, y: points[i+1*g].y },
                {x: points[i+2*g].x, y: points[i+2*g].y },
                {x: points[i+3*g].x, y: points[i+3*g].y },
                {x: points[i+4*g].x, y: points[i+4*g].y }
            ];
            let seg = [
                {x: tmp[2].x - tmp[0].x, y: tmp[2].y - tmp[0].y },
                {x: tmp[3].x - tmp[1].x, y: tmp[3].y - tmp[1].y },
                {x: tmp[4].x - tmp[2].x, y: tmp[4].y - tmp[2].y }
            ];
            let dif = {x: (seg[0].x + seg[2].x)/2.0 - seg[1].x, y: (seg[0].y + seg[2].y)/2.0 - seg[1].y} 
            let thre = dif.x*dif.x + dif.y*dif.y;
            dif.thre = thre;
            arr.push( dif );
            if ( i == 0 ){
                ctx.moveTo( points[i].x, points[i].y );
            }else{
                if ( thre == 0 ){
                    ctx.strokeStyle = "white";
                } else if ( thre < 0.25 ){
                    ctx.strokeStyle = "blue";
                } else if ( thre < 0.5 ){
                    ctx.strokeStyle = "green";
                } else if ( thre < 0.75 ){
                    ctx.strokeStyle = "yellow";
                } else{
                    ctx.strokeStyle = "red";
                }
                ctx.lineTo( points[i].x, points[i].y );
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo( points[i].x, points[i].y );
            }
        }
        ctx.stroke();

        console.log( arr );
    }

    return {
        init: init
    };
})();

hider_canvas.init();