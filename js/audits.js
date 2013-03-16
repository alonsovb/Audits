// -----------------------
// System engine
// -----------------------

// Global variables
var audits = [],
	currentAudit;
	// headquarters = ['Central (Cartago)', 'San Carlos', 'San José'],
	// buildings = ['Administrative (Agro, Admin, Production)', 'Computer Eng., Sciences', 'Computer Lab', 'LAIMI', 'Dinning Hall'];

var hqs = [{
	name: 'Sede San Carlos',
	buildings: [{
		name: 'Administrativo',
		rooms: []
	}, {
		name: 'Comedor',
		rooms: []
	}, {
		name: 'Escuela Computación',
		rooms: []
	}]
}, {
	name: 'Sede Central',
	buildings: [{
		name: 'Comedor',
		rooms: []
	},
	{
		name: 'Administrativo',
		rooms: [{
			name: 'Reception',
			floor: 3
		}, {
			name: 'Gerencia',
			floor: 3
		}]
	}]
}, {
	name: 'Sede San José',
	buildings: []
}];

// Give some audit samples
// audits = sampleAudits(10, 3, 10);

// Audit class. Contains a building, floor and room properties.
function Audit(building, floor, room, hqs) {
	this.hqs       = hqs;
	this.building  = building;
	this.floor     = floor;
	this.room      = room;
	this.assets    = [];
	this.date      = new Date();
	this.completed = false;
}

// Asset class. Each asset has an identifier, a qualitative (state) and quantified score.
function Asset(id, state, score) {
	this.id      = id;
	this.state   = state;
	this.score   = score;
	this.comment = '';
}

// Returns some sample assets
function sampleAssets(min, max) {
	var assetCount = Math.floor((Math.random()*(max - min))+min),
		assets = [];
	for (var i = 0; i < assetCount; i++)
		assets.push(new Asset(Math.floor((Math.random()*9000)+1000), 1, 10));
	return assets;
}
// Returns some sample audits (each one with some sample assets)
function sampleAudits(count, min, max) {
	var audits = [];
	for (var i = 0; i < count; i++) {
		var newAudit = new Audit(buildings[Math.floor(Math.random()*buildings.length)],
						headquarters[Math.floor(Math.random()*headquarters.length)],
						Math.floor((Math.random()*2)+1),
						Math.floor((Math.random()*2)+1));
		newAudit.assets = sampleAssets(min, max);
		if (Math.random() > 0.2)
			newAudit.completed = true;
		audits.push(newAudit);
	}
	return audits;
}


// -----------------------
// Interface
// -----------------------
$(function() {

	var $headquarter = $('#n-headquarter'),
		$building    = $('#n-building'),
		$room        = $('#n-room'),
		selHQ, selBuild, selRoom;

	// Events on main page
	$('#main').on('pageinit', function() {

		// Load headquarter list
		for (var i in hqs) {
			var newHQ = $('<option>', {
				text: hqs[i].name
			});
			$headquarter.append(newHQ);
		}

		$headquarter.on('change', function () {
			selHQ = hqs[this.selectedIndex];
			var buildings = selHQ.buildings;

			if (buildings.length > 0) {
				$building.html('');
				// Load building list
				for (var index in buildings) {
					var newOption = $('<option>', {
						text: buildings[index].name
					});
					$building.append(newOption);
				}
				$('select').selectmenu('refresh');
				$building.selectmenu('enable');
			} else {
				$building.selectmenu('disable');
			}
		});

		$building.on('change', function() {
			selBuild = selHQ.buildings[this.selectedIndex];
			var rooms = selBuild.rooms;

			if (rooms.length > 0) {
				$room.html('');

				// Load room list
				var floors = [$('<optgroup>', {
					label: 'Floor ' + 1
				})];
				for (var index in rooms) {
					var room = rooms[index],
						newOption = $('<option>', {
							text: room.name
						});
					if (room.floor >= floors.length) {
						for (var i = floors.length; i < room.floor; i++) {
							floors.push($('<optgroup>', {
								label: 'Floor ' + (i + 1)
							}));
						}
					}
					floors[parseInt(room.floor) - 1].append(newOption);
				}
				for (var i in floors) {
					$room.append(floors[i]);
				}
				$room.selectmenu('enable');
			} else {
				$room.selectmenu('disable');
			}
		});

		$room.on('change', function () {
			selRoom = selBuild.rooms[this.selectedIndex];
		});

		// Create new audit
		$('#n-create').on('click', function() {
			var $hqs      = $headquarter,
				$building = $building,
				$room     = $room,
				newAudit = new Audit($hqs.val(), $building.val(), $floor.val(), $room.val());

			// Create some sample assets
			newAudit.assets = sampleAssets(5, 12);
			// Add audit to main list
			audits.push(newAudit);
			// Make it the current audit
			currentAudit = newAudit;

			// Clean adding inputs
			$floor.val(1);
			$room.val('');
			$('#n-panel').trigger('collapse');
		});
	});

	// Events on audit page
	$('#audit').on('pageshow', function() {

		// Check if there's a current audit. If not, go to main screen.
		if (currentAudit === undefined) {
			window.location.href = '#main';
			return;
		}

		var template = $.trim($('#asset-item-template').html()),
			content  = '',
			$assetList = $('#asset-list');

		// Clean asset list
		$assetList.html('');

		// Fill asset list by templating
		$.each(currentAudit.assets, function (index, obj) {
			content += template.replace( /{{id}}/ig, obj.id );
		});
		$assetList.append(content);
		$('#audit').trigger('create');

		$()
	})

	// Events on history page
	$('#history').on('pageshow', function() {
		var $list = $('#h-list'),
			$divider = $.trim($('#history-list-divider').html());

		// Clean history list
		$list.html('');

		// Get divider template
		$list.append($divider.replace(/{{text}}/ig, 'Current').replace(/{{id}}/ig, 'h-current'));
		$list.append($divider.replace(/{{text}}/ig, 'Done').replace(/{{id}}/ig, 'h-done'));
		var $current = $('#h-current'),
			$done    = $('#h-done');

		// Show list of audits
		for (var index in audits) {
			var item = $('<li>'),
				link = $('<a>', {
						href: "#audit",
						class: 'audit',
						text: audits[index].building + '. Floor: ' +
							audits[index].floor + '. Room: ' + audits[index].room,
						'data-index': index
					}),
				span = $('<span>', {
							class: 'ui-li-count',
							text: audits[index].assets.length
						});
			link.append(span);
			item.append(link);
			// Add to corresponding divider
			if (audits[index].completed)
				$done.after(item);
			else
				$current.after(item);
		}
		$list.listview('refresh');

		// Load selected audit on click
		$('a.audit').on('click', function () {
			var index = $(this).data('index');
			currentAudit = audits[index];
		});
	});
});