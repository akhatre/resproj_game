	getGameDimensions(); //requires defined in parent html file

	//Initialise
	var gameCanvas;
	var gameCanvasContext;
	var score_gain;
	var myGamePiece;
	var fisher_speed;
	var fisher_school_speed;
	var mouse_x;
	var x_pos_at_click;
	var fish_school_data_raw = [];
	var container = document.getElementById("game_div");
	var score_gain_field = document.getElementById("score_gain");
	var score_all_field = document.getElementById("score_all");
	var current_day_field = document.getElementById("current_day");
	var gameSpeedSlider = document.getElementById("gameSpeedSlider");
	var fish_school_data = [];
	var day = 0;
	var animation_step = 1;
	var click = 0;
	var showingGain = 0;
	var sea_y = 0;
	var sea_speed = (gameUI_height/5)/50; //requires getGameDimensions()
	var fisher_x = gameCanvas_width/2;
	var fish_school_x = 100;
	var score = 0;
	var gameSpeed = 51;
	var allow_next_day = 1;
	var decision_stop_times = [];
	var decision_start_times = [];
	var iteration = 1;
	var frame = 0;
	var time;
	var start_time = new Date();
	start_time = start_time.getTime();

	
	// Dimensions
	var fish_school_width = gameCanvas_width/10;
	var prediction_width = fish_school_width;
	var fisher_width = 0.15*gameCanvas_width;
	var row_height = gameUI_height/6; //requires getGameDimensions()
	var day_0 = gameUI_height*2/5; //requires getGameDimensions()
	var day_minus_1 = gameUI_height*3/5; //requires getGameDimensions()
	var day_minus_2 = gameUI_height*4/5; //requires getGameDimensions()
	var fisher_x_adj = fisher_width;
	var prediction_x_adj = prediction_width*0.5;
	
	
	//Setting up graphics
	var fisher_frames_srcs = ["f/f0001.png", "f/f0002.png", "f/f0003.png", "f/f0004.png", "f/f0005.png", "f/f0006.png", "f/f0007.png", "f/f0008.png", "f/f0009.png", "f/f0010.png", "f/f0011.png", "f/f0012.png", "f/f0013.png", "f/f0014.png", "f/f0015.png", "f/f0016.png", "f/f0017.png", "f/f0018.png", "f/f0019.png", "f/f0020.png", "f/f0021.png", "f/f0022.png", "f/f0023.png", "f/f0024.png", "f/f0025.png", "f/f0026.png", "f/f0027.png", "f/f0028.png"];
	
	var sea_frames_srcs = ["s/s0001.png", "s/s0002.png", "s/s0003.png", "s/s0004.png", "s/s0005.png", "s/s0006.png", "s/s0007.png", "s/s0008.png", "s/s0009.png", "s/s0010.png", "s/s0011.png", "s/s0012.png", "s/s0013.png", "s/s0014.png", "s/s0015.png", "s/s0016.png", "s/s0017.png", "s/s0018.png", "s/s0019.png", "s/s0020.png", "s/s0021.png", "s/s0022.png", "s/s0023.png", "s/s0024.png", "s/s0025.png", "s/s0026.png", "s/s0027.png", "s/s0028.png"];

	var fish_school_frames = ["fs/fs0001.png", "fs/fs0002.png", "fs/fs0003.png", "fs/fs0004.png", "fs/fs0005.png", "fs/fs0006.png", "fs/fs0007.png", "fs/fs0008.png", "fs/fs0009.png", "fs/fs0010.png", "fs/fs0011.png", "fs/fs0012.png", "fs/fs0013.png", "fs/fs0014.png", "fs/fs0015.png", "fs/fs0016.png", "fs/fs0017.png", "fs/fs0018.png", "fs/fs0019.png", "fs/fs0020.png", "fs/fs0021.png", "fs/fs0022.png", "fs/fs0023.png", "fs/fs0024.png", "fs/fs0025.png", "fs/fs0026.png", "fs/fs0027.png", "fs/fs0028.png"];

	var fish_schools = [];
	var seas = [];
	var fishers = [];
	var prediction = new Image();
	prediction.src = "prediction.png";
	
	for (i = 0; i<=27; i++) {
		seas[i] = new Image();
		seas[i].src = sea_frames_srcs[i];
		fishers[i] = new Image();
		fishers[i].src = fisher_frames_srcs[i];
		fish_schools[i] = new Image();
		fish_schools[i].src = fish_school_frames[i];
	}

	
	//Game code
	function startGame() {
		myGameArea.start();
	}

	function component(width, height, color, x, y) {
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.update = function() {
			ctx = myGameArea.context;
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		};
	}

	var myGameArea = {
		canvas : document.createElement("canvas"),
		start : function() {
			this.canvas.width = gameCanvas_width;
			this.canvas.height = gameUI_height;
			this.context = this.canvas.getContext("2d");
//			this.canvas.style.cursor = "none";
			this.canvas.setAttribute("id", "gameCanvas");
			this.interval = setInterval(updateGameArea, gameSpeed);
			container.appendChild(this.canvas);
			container.style.height = gameUI_height + "px";
			container.style.width = gameCanvas_width + "px";
			document.getElementById("gameUI").style.width = gameUI_width+"px";
			document.getElementById("gameUI").style.margin = "0 auto";
			gameCanvas = document.getElementById("gameCanvas");
			gameCanvasContext = gameCanvas.getContext("2d");
			window.addEventListener('mousemove', function (e) {
            	mouse_x = e.pageX;
        	});
		},
		clear : function() {
        	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    	}
	};
	
	function update_prediction() {
		myGameArea.clear();
		prediction.x = mouse_x;
		prediction.update();
		fish_school.update();
	}
	
	function get_nextday_location() {
		firebase.database().ref('/locations/' + locations_set + "/" + day).once('value').then(function(snapshot) {
			fish_school_data.push(snapshot.val()*gameCanvas_width);
		});
	}
	
	function next_day() {
		if (allow_next_day == 1) {
			allow_next_day = 0;
			time = new Date();
			decision_stop_times.push(time.getTime());
			x_pos_at_click = mouse_x;
			
			var user_prediction = String((x_pos_at_click)/gameCanvas_width);
			db.ref('predictions/' + uid + "/" + day).set({
				value: user_prediction
			});
			
			var rt;
			
			if (day != 0) {
				rt = decision_stop_times[day] - decision_start_times[day-1];
				db.ref('rts/' + uid + "/" + day).set({
					value: rt
				});
			} else {
				rt = decision_stop_times[day] - start_time;
				db.ref('rts/' + uid + "/" + day).set({
					value: rt
				});
			}

			db.ref('/locations/' + locations_set + "/" + day).once('value').then(function(snapshot) {
				click = 1;
				fish_school_data_raw.push(snapshot.val());
				fish_school_data.push(snapshot.val()*gameCanvas_width);
				fisher_speed = (fisher_x - x_pos_at_click)/50;
				fish_school_speed = (fish_school_x - fish_school_data[day])/50;

				score_gain = Math.round(0.1/Math.abs(user_prediction - fish_school_data_raw[day]));
				if (score_gain > 300) {
					score_gain=300;
				}
				score += score_gain;

				gameChart.data.datasets[0].data.push({x:fish_school_data[day], y:day});
				gameChart.update();
			});
		}
	}
	
	
	
	
	function updateGameArea() {
		if (click == 1) {
			
			frame += 1;
			if (frame == 28) {
				frame = 0;
			}
			
			showingGain = 0;
			myGameArea.clear();
			
			sea_y += sea_speed;
			if (sea_y > gameUI_height) {
				sea_y = 0;
			}
			
			myGameArea.context.drawImage(seas[frame], 0, sea_y, gameCanvas_width, gameUI_height);
			myGameArea.context.drawImage(seas[frame], 0, sea_y-gameUI_height, gameCanvas_width, gameUI_height);
			
			fisher_x -= fisher_speed;
			fish_school_x -= fish_school_speed;
			iteration += 1;

			myGameArea.context.drawImage(fishers[frame], fisher_x - fisher_x_adj, day_minus_1, fisher_width, row_height);
			myGameArea.context.drawImage(fish_schools[frame], fish_school_x - fish_school_width/2, day_minus_1+70, fish_school_width, row_height);
			
			
			if (iteration > 50) {
				current_day_field.innerHTML = "Today is day " + day;
				score_gain_field.innerHTML = "Fish caught last day: " + score_gain;
				score_all_field.innerHTML = "Fish caught overall: " + score;
				
				click = 0;
				allow_next_day = 1;
				day += 1;
				showingGain = 1;
				
				time = new Date();
				decision_start_times.push(time.getTime());
			}
			
		} else {
			frame += 1;
			if (frame == 28) {
				frame = 0;
			}
			
			
			myGameArea.clear();

			myGameArea.context.drawImage(seas[frame], 0, sea_y, gameCanvas_width, gameUI_height);
			myGameArea.context.drawImage(seas[frame], 0, sea_y-gameUI_height, gameCanvas_width, gameUI_height);
			iteration = 1;
			
			myGameArea.context.drawImage(prediction, mouse_x - prediction_x_adj, day_0, prediction_width, row_height*2.1);
			myGameArea.context.drawImage(fish_schools[frame], fish_school_x - fish_school_width/2, day_minus_1+70, fish_school_width, row_height);
			myGameArea.context.drawImage(fishers[frame], fisher_x - fisher_x_adj, day_minus_1, fisher_width, row_height);
			
			if (showingGain == 1 && day != 100) {
				gameCanvasContext.font = "30px Comic Sans MS";
				gameCanvasContext.textAlign = "center";
				if (score_gain < 3) {
					gameCanvasContext.fillStyle = "red";
					gameCanvasContext.fillText("You caught just " + score_gain + " fish today...", gameCanvas_width/2, day_0);
				} else if (score_gain < 30) {
					gameCanvasContext.fillStyle = "yellow";
					gameCanvasContext.fillText("You caught " + score_gain + " fish today.", gameCanvas_width/2, day_0);
				} else if (score_gain < 100) {
					gameCanvasContext.fillStyle = "lightgreen";
					gameCanvasContext.fillText("Well done! You caught " + score_gain + " fish today!", gameCanvas_width/2, day_0);
				} else {
					var gradient=gameCanvasContext.createLinearGradient(0,0,gameCanvas.width,0);
					gradient.addColorStop("0","magenta");
					gradient.addColorStop("0.5","blue");
					gradient.addColorStop("1.0","red");
					gameCanvasContext.fillStyle = gradient;
					gameCanvasContext.fillText("OMG! You caught " + score_gain + " fish today!!!", gameCanvas_width/2, day_0);
				}
			}
			
			if (day == 100) {
				gameCanvasContext.font = "40px Comic Sans MS";
				gameCanvasContext.textAlign = "center";
				var gradient=gameCanvasContext.createLinearGradient(0,0,gameCanvas.width,0);
				gradient.addColorStop("0","orange");
				gradient.addColorStop("0.5","yellow");
				gradient.addColorStop("1.0","orange");
				gameCanvasContext.fillStyle = gradient;
				gameCanvasContext.fillText("Thank you for playing! You caught " + score + " fish!!!", gameCanvas_width/2, day_0);
				setTimeout(function(){window.location.href = 'post_game.html';}, 5000);
				allow_next_day = 0;
				day += 1;
			}
		}
	}
	
	window.onresize = function() {
			getGameDimensions();		
			document.getElementById("gameUI").style.width = gameUI_width+"px";
			document.getElementById("gameUI").style.margin = "0 auto";
			chartContainer.style.height= gameUI_height + "px";
			chartContainer.style.width = chartCanvas_width + "px";
			gameCanvas.width = gameCanvas_width;
			gameCanvas.height = gameUI_height;
			container.style.height = gameUI_height + "px";
			container.style.width = gameCanvas_width + "px";
			sea_speed = (gameUI_height/5)/50;
			fisher_x = gameCanvas_width/2;
			fish_school_width = gameCanvas_width/10;
			prediction_width = fish_school_width;
			fisher_width = 0.15*gameCanvas_width;
			row_height = gameUI_height/6;
			day_0 = gameUI_height*2/5;
			day_minus_1 = gameUI_height*3/5;
			day_minus_2 = gameUI_height*4/5;
			fisher_x_adj = fisher_width;
			prediction_x_adj = prediction_width*0.5;
			
			
			gameChart.data.datasets[0].data = [];
			fish_school_data = [];
			var d = 0;
			while (d < fish_school_data_raw.length) {
				fish_school_data.push(fish_school_data_raw[d] * gameCanvas_width);
				gameChart.data.datasets[0].data.push({x:fish_school_data_raw[d] * gameCanvas_width, y:d});
				d += 1;
			}
			gameChart.options.scales.xAxes[0].ticks.max = Math.round(gameCanvas_width);
			gameChart.update();
		};
		
	gameSpeedSlider.oninput = function () {
		gameSpeed = 51 - Number(this.value);
		clearInterval(gameCanvas.interval);
		gameCanvas.interval = setInterval(updateGameArea, gameSpeed);
	};