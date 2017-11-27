
	var myGamePiece;
	var container = document.getElementById("game_div");
	
	
	var canvas_width = 160*6;
	var canvas_height = 90*6;
	var fish_school_width = canvas_width/10;
	var prediction_width = fish_school_width;
	var fisher_width = 150;
	var row_height = canvas_height/6;
	var day_0 = canvas_height*2/5;
	var day_minus_1 = canvas_height*3/5;
	var day_minus_2 = canvas_height*4/5;
	
	var mouse_x;
	
	var fish_school_data = Array.from({length: 100}, () => Math.floor(Math.random() * (canvas_width*9/10)));
	
	var day = 0;
	
	var animation_step = 1;
	
	var click = 0;
	var x_pos_at_click;
	

	var sea_y = 0;
	
	var fisher_speed;
	var fisher_school_speed;
	var sea_speed = (canvas_height/5)/50;
	
	var fisher_x = 100;
	var fish_school_x = 100;
	
	//Setting up graphics
	
	var fisher_frames_srcs = ["f/f0001.png", "f/f0002.png", "f/f0003.png", "f/f0004.png", "f/f0005.png", "f/f0006.png", "f/f0007.png", "f/f0008.png", "f/f0009.png", "f/f0010.png", "f/f0011.png", "f/f0012.png", "f/f0013.png", "f/f0014.png", "f/f0015.png", "f/f0016.png", "f/f0017.png", "f/f0018.png", "f/f0019.png", "f/f0020.png", "f/f0021.png", "f/f0022.png", "f/f0023.png", "f/f0024.png", "f/f0025.png", "f/f0026.png", "f/f0027.png", "f/f0028.png"]
	
	var sea_frames_srcs = ["s/s0001.png", "s/s0002.png", "s/s0003.png", "s/s0004.png", "s/s0005.png", "s/s0006.png", "s/s0007.png", "s/s0008.png", "s/s0009.png", "s/s0010.png", "s/s0011.png", "s/s0012.png", "s/s0013.png", "s/s0014.png", "s/s0015.png", "s/s0016.png", "s/s0017.png", "s/s0018.png", "s/s0019.png", "s/s0020.png", "s/s0021.png", "s/s0022.png", "s/s0023.png", "s/s0024.png", "s/s0025.png", "s/s0026.png", "s/s0027.png", "s/s0028.png"]

	var fish_school_frames = ["fs/fs0001.png", "fs/fs0002.png", "fs/fs0003.png", "fs/fs0004.png", "fs/fs0005.png", "fs/fs0006.png", "fs/fs0007.png", "fs/fs0008.png", "fs/fs0009.png", "fs/fs0010.png", "fs/fs0011.png", "fs/fs0012.png", "fs/fs0013.png", "fs/fs0014.png", "fs/fs0015.png", "fs/fs0016.png", "fs/fs0017.png", "fs/fs0018.png", "fs/fs0019.png", "fs/fs0020.png", "fs/fs0021.png", "fs/fs0022.png", "fs/fs0023.png", "fs/fs0024.png", "fs/fs0025.png", "fs/fs0026.png", "fs/fs0027.png", "fs/fs0028.png"]

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
		}
	}

	var myGameArea = {
		canvas : document.createElement("canvas"),
		start : function() {
			this.canvas.width = canvas_width;
			this.canvas.height = canvas_height;
			this.context = this.canvas.getContext("2d");
			this.canvas.style.cursor = "none";
			this.interval = setInterval(updateGameArea, 60);
			container.appendChild(this.canvas);
			container.style.height = "auto"
			container.style.width = "auto"
			window.addEventListener('mousemove', function (e) {
            	mouse_x = e.pageX;
//				update_prediction();
        	})
		},
		clear : function() {
        	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    	}
	}
	
	function update_prediction() {
		myGameArea.clear();
		prediction.x = mouse_x;
		prediction.update();
//		fisher.update();
		fish_school.update();
	}
	
	function next_day() {

		click = 1;
		x_pos_at_click = mouse_x;
		fisher_speed = (fisher_x - x_pos_at_click)/50;
		fish_school_speed = (fish_school_x - fish_school_data[day])/50;
	}
	
	var iteration = 1;
	var frame = 0;
	
	
	function updateGameArea() {
		if (click == 1) {
			
			frame += 1;
			if (frame == 28) {
				frame = 0;
			}
			
			myGameArea.clear();
			
			sea_y += sea_speed;
			if (sea_y > canvas_height) {
				sea_y = 0;
			}
			
//			sea.src = sea_frames_srcs[frame];
			myGameArea.context.drawImage(seas[frame], 0, sea_y, canvas_width, canvas_height);
			myGameArea.context.drawImage(seas[frame], 0, sea_y-canvas_height, canvas_width, canvas_height);
			
			fisher_x -= fisher_speed;
			fish_school_x -= fish_school_speed;
			iteration += 1;
			
//			fisher.update();
//			fish_school.update();
			
//			f.src = fisher_frames_srcs[frame];
			myGameArea.context.drawImage(fishers[frame], fisher_x - 80, day_minus_1, fisher_width, row_height);
			myGameArea.context.drawImage(fish_schools[frame], fish_school_x, day_minus_1+70, fish_school_width, row_height);
			
			
			if (iteration > 50) {
				click = 0;
				day += 1;
			}
			

		} else {
			frame += 1;
			if (frame == 28) {
				frame = 0;
			}

			
			
			myGameArea.clear();
//			prediction.x = mouse_x;
//			sea.src = sea_frames_srcs[frame];

			myGameArea.context.drawImage(seas[frame], 0, sea_y, canvas_width, canvas_height);
			myGameArea.context.drawImage(seas[frame], 0, sea_y-canvas_height, canvas_width, canvas_height);
//			prediction.update();
//			fisher.update();
//			fish_school.update();
			iteration = 1;
			
			myGameArea.context.drawImage(prediction, mouse_x, day_0, prediction_width, row_height);
			myGameArea.context.drawImage(fish_schools[frame], fish_school_x, day_minus_1+70, fish_school_width, row_height);
//			f.src = fisher_frames_srcs[frame];
			myGameArea.context.drawImage(fishers[frame], fisher_x - 80, day_minus_1, fisher_width, row_height);
		}
	}