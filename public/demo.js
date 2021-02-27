var capture;
var tracker;
var w = 640,
    h = 480;
var count = [];
var cnt = 0;
var values = [];
var f = 0;
function setup() {
    capture = createCapture({
        audio: false,
        video: {
            width: w,
            height: h
        }
    }, function() {
        console.log('capture ready.')
    });
    capture.elt.setAttribute('playsinline', '');
    createCanvas(w, h);
    capture.size(w, h);
    capture.hide();

    colorMode(HSB);

    tracker = new clm.tracker();
    tracker.init();
    tracker.start(capture.elt);
}

function draw() {
    translate(w, 0);
    scale(-1.0, 1.0);
    image(capture, 0, 0, w, h);

    var positions = tracker.getCurrentPosition();

    noFill();
    stroke(255);


    noStroke();
          var r=null;
          var s=null;

    for (var i = 0; i < positions.length; i++) {
      if(i==27){
        fill(map(i, 0, positions.length, 0, 360), 50, 100);
        ellipse(positions[i][0], positions[i][1], 4, 4);
        var j = Math.round(Math.round((positions[i][0])/15)*15);
        var k = Math.round(Math.round((positions[i][1])/12)*12);
        //console.log(j,k);
        values.push([j,k]);
        if(f>0){
          if((values[f][0]==values[f-1][0]) && (values[f][1]==values[f-1][1]))
          {
            cnt++;
            f++;
          }
          else{
            if(cnt>=130 && cnt<=265)
            {count.push([Math.round(cnt/31)]);}
            cnt = 0;
            f++;
          }}
          else{
          f++;}


    }
    if(i==32){
      fill(map(i, 0, positions.length, 0, 360), 50, 100);
      ellipse(positions[i][0], positions[i][1], 4, 4);
  }

}

}
