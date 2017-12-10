getGameDimensions(); 
	var chartCanvas;
	var chartContainer = document.getElementById("graph");
	var gameChart;
	
	function startGraph() {
		graph.init();
	}
	
	var graph = {
	 	graphCanvas : document.createElement("canvas"),
		init : function() {
			this.graphCanvas.setAttribute("id", "chart");
			chartContainer.style.height= gameUI_height + "px";
			chartContainer.style.width = chartCanvas_width + "px";
			chartContainer.appendChild(this.graphCanvas);
		},
		draw : function() {
			gameChart = new Chart(this.graphCanvas, {
				type: 'scatter',
				data: {
					datasets: [{
						label: 'Fish School Locations',
						data: [{
						}]
					}]
				},
				options: {
					maintainAspectRatio: false,
					showLines: true,
					legend: {
						display: false
					},
					elements: {
						line: {
							backgroundColor: 'rgba(0, 0, 0 ,1)',
							borderWidth: 1,
							borderColor: 'rgba(0, 0, 0, 1)',
							fill: false,
						}
					},
					scales: {
						xAxes: [{
							type: 'linear',
							position: 'bottom',
							ticks: {
								min: 0,
								max: Math.round(gameCanvas_width)
							}
						}],
						yAxes: [{
							scaleLabel: {
								display: true,
								labelString: "Day"
							},
							ticks: {
								min: 0,
								max: 100
							}
						}]
					}
				}
			});
		}
	}
	
	graph.draw();
	
	function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}
