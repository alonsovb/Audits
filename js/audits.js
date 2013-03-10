// -----------------------
// System engine
// -----------------------

// Global variables
var audits = [],
	currentAudit,
	buildings = ['Administrative (Agro, Admin, Production)', 'Computer Eng., Sciences', 'Computer Lab', 'LAIMI', 'Dinning Hall'];

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
	$('#main').on('pageinit', function() {
		for (var building in buildings) {
			var newOption = $('<option>');
			newOption.text(buildings[building]);
			$('#n-building').append(newOption);
		}

		$('#n-create').on('click', function() {
			var $building = $('#n-building'),
				$floor    = $('#n-floor'),
				$room     = $('#n-room'),
				newAudit = new Audit($building.val(), $floor.val(), $room.val()),
				assetCount = Math.floor((Math.random()*20)+5);

			// Create some assets for the audit
			for (var i = 0; i < assetCount; i++)
				newAudit.assets.push(new Asset(Math.floor((Math.random()*9000)+1000), 1, 10));

			// Add audit to main list
			audits.push(newAudit);
			// Make it the current audit
			currentAudit = newAudit;

			// Clean adding inputs
			$floor.val(1);
			$room.val('');
		});
	});

	$('#audit').on('pageshow', function() {
		var template = $.trim($('#asset-item-template').html()),
			content  = '',
			$assetList = $('#asset-list');

		$assetList.html('');

		$.each(currentAudit.assets, function (index, obj) {
			content += template.replace( /{{id}}/ig, obj.id );
		});
		$assetList.append(content);
		$('#audit').trigger('create');
	})

	$('#history').on('pageshow', function() {
		var $list = $('#h-list');

		$list.html('');

		for (var index in audits) {
			var item = $('<li>'),
				link = $('<a>', {
						href: "#audit",
						text: audits[index].building + ' ' +
							audits[index].floor + ' ' + audits[index].room
					}),
				span = $('<span>', {
							class: 'ui-li-count',
							text: audits[index].assets.length
						});
			link.append(span);
			item.append(link);
			$list.append(item);
		}
		$list.listview('refresh');
	});
});