$(document).ready(function(){

  // Array for maintaining Signal Positions - For quick access
  var arrSignalPositions = [];

  // Constant for Signal Status - Can be used to add more in future - like double yellow etc.
  const SignalStatus = {
      STOP: 'red',
      WAIT: 'yellow',
      PROCEED: 'green'
  };

  //The data for our line
  var lineData = [ { "x": 50,   "y": 200},  { "x": 1275,  "y": 200}];

  // SVG Container
  var svg = d3.select("#pathAnimation").append("svg")
                                    .attr("width", 1300)
                                    .attr("height", 250);

  // Linear Accessor Function
  var lineFunction = d3.svg.line()
                         .x(function(d) { return d.x; })
                         .y(function(d) { return d.y; })
                         .interpolate("linear");

  // Line SVG Path
  svg.append("path")
      .attr("d", lineFunction(lineData))
      .attr("stroke", "gray")
      .attr("stroke-width", 2)
      .attr("fill", "none");

  // Generates 12 Signals
  var mySignals = generateSignals(12, 100);

  /* This function creats a Train and returns its instance */
  function generateTrain() {
    return svg.append("image")
      .attr("xlink:href", "images/train_" + _.random(1,4) + ".png")
      .attr("x", 50)
      .attr("width", 48)
      .attr("y", 175)
      .attr("height", 24);    
  }

  /* Function 'generateSignals' takes No. of Signals and Starting Position as inputs 
     and creates Signals on SVG */
  function generateSignals(count, startingPosition) {
    var stations = [];
    arrSignalPositions = [];
    var signalPosition = startingPosition;

    for( var i = 0; i< count; i++ ) {
      stations.push(
        svg.append("image")
          .attr("xlink:href", "images/green.png")
          .attr("x", signalPosition)
          .attr("y", "150")
          .attr("width", 48)
          .attr("height", 24)
      );
      arrSignalPositions.push(signalPosition);
      signalPosition = signalPosition + 100;
    }
    return stations;  
  }

  /* Entry Point - Button Click triggers the Process of creating trains */
  document.getElementById('btnStart').onclick = function() {
    startTrain();
    this.className += 'disabled';
    this.disabled = true;
    this.innerText= 'Started...';
  }

  /* startTrain will kick off the process by adding animation to Train */
  function startTrain() {
    var train = generateTrain();
    var lastUpdatedPosition;

    train.attr('x', train.attr('x'))
        .transition()
        .tween("attr.fill", function() {
            var node = this;
            return function(t) {
              var trainPosition = parseInt(node.getAttribute("x"));

              if(lastUpdatedPosition === trainPosition) {
                  return;
              }

              var signalNo = _.indexOf(arrSignalPositions, trainPosition)
              
              if( signalNo >= 0)  {
                updateSignals(signalNo);
                lastUpdatedPosition = trainPosition;
              }
              
            }
          })
        .duration(60000) // 12 Stations * 5000 Milli Seconds
        .ease("linear") // For Constant Speed
        .attr('x', 1250) // Width of the Path
        .delay(4000) // Wait for 4 Seconds
        .each("end", refreshSignal()) // Refreshing Last Signal
        .remove();   // Removing Train
  }

  /* updateSignal will update the status of current and previous Signals with appropriate Status */
  function updateSignals(signalNo) {
      updateSignalStatus(signalNo, SignalStatus.STOP);
      

      if(signalNo >= 1) {
        updateSignalStatus(signalNo -1, SignalStatus.WAIT);
      }

      if(signalNo >= 2) {
        updateSignalStatus(signalNo - 2, SignalStatus.PROCEED); 
      }

      if(signalNo === 2) {
        startTrain();
      }
  }

  function refreshSignal() {
    updateSignalStatus(mySignals.length - 1, SignalStatus.PROCEED); 

    if(mySignals.length > 1) {
      updateSignalStatus(mySignals.length - 2, SignalStatus.PROCEED);
    }

    if(mySignals.length > 2) {
      updateSignalStatus(mySignals.length - 3, SignalStatus.PROCEED);
    }
  }

  function updateSignalStatus(signalNo, status) {
    mySignals[signalNo].attr("xlink:href", 'images/' + status  + ".png");
  }

});