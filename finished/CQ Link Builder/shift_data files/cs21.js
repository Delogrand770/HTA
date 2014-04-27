App.organization = "CS 21";
App.multipliers = [
	["Monday", 1],
	["Tuesday", 1],
	["Wednesday", 1],
	["Thursday", 1],
	["Friday", 1],
	["Saturday", 1],
	["Sunday", 1]
	];
App.data = [
	["Reveille", 1, "0645-0745"],
	["1st", 1, "0745-0845"],
	["2nd", 1, "0845-0945"],
	["3rd", 1, "0945-1045"],
	["4th", 1, "1045-1145"],
	["Lunch", 1.5, "1145-1320"],
	["5th", 1, "1320-1425"],
	["6th", 1, "1425-1525"],
	["7th", 1, "1525-1625"],
	["", 1, "1625-1730"],
	["", 1, "1730-1830"],
	["", 2, "1830-2030"],
	["", 1.5, "2030-2200"],
	["Weekday Taps", 1, "2200-2300"],
	["Weekend Taps", 2.5, "2300-0130"]
	];

//To add more shift possibilities just add another row to the App.data = [ entry and be sure to follow the format.
//Every row has a comma after it except for the last row.