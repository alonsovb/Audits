// -----------------------
// System engine
// -----------------------

// Global variables
var audits = [];
var buildings = ['Administrative (Agro, Admin, Production)', 'Computer Eng., Sciences', 'Computer Lab', 'LAIMI', 'Dinning Hall'];

// Audit class. Contains a building, floor and room properties.
function Audit(building, floor, room) {
	this.building = building;
	this.floor = floor;
	this.room = room;
	this.assets = [];
	this.completed = false;
}
Audit.prototype.addAsset = function (asset) {
	this.assets.push(asset);
}

// Asset class. Each asset has an identifier, a qualitative (state) and quantified score.
function Asset(id, state, score) {
	this.id = id;
	this.state = state;
	this.score = score;
}


// -----------------------
// Interface
// -----------------------
$(function() {
	$('#p-main').on('pageinit', function() {
		for (var building in buildings) {
			var newOption = $('<option>');
			newOption.text(buildings[building]);
			$('#n-building').append(newOption);
		}
	});

	$('#n-create').on('click', function() {
		var $building = $('#n-building'),
			$floor    = $('#n-floor'),
			$room     = $('#n-room');
		audits.push(new Audit($building.val(), $floor.val(), $room.val()));
		$building.val('');
		$floor.val(1);
		$room.val('');
	});
});