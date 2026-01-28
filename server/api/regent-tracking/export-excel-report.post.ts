import {
	ForReport,
	type Online,
	type TrackerStatusWrapperName,
} from '~/types/regent-tracking/tracked-vehicles';
import ExcelJS from 'exceljs';

type ReportDataBody = {
	offlineVehicles: number;
	onlineVehicles: number;
	expiredVehicles: number;
	totalVehicles: number;
	corporateName: string;
	entries: ForReport[];
};

const RED_COLOR = 'FFFF0000';
const GREEN_COLOR = 'FF00CC00';
const BLUE_COLOR = 'FF0066FF';
const YELLOW_COLOR = 'FFFFFF00';

export default defineEventHandler(async (event) => {
	const body: ReportDataBody = await readBody(event);
	const query: { return_full: boolean } = getQuery(event);

	const map = new Map();
	map.set(0, 'A');
	map.set(1, 'B');
	map.set(2, 'C');
	map.set(3, 'D');
	map.set(4, 'E');
	map.set(5, 'F');
	map.set(6, 'G');
	map.set(7, 'H');

	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('My Tracked Devices');

	// offline vehicles
	editSpecificCell(worksheet, 'A1', 'Offline Vehicles', RED_COLOR);
	editSpecificCell(worksheet, 'B1', body.offlineVehicles.toString(), RED_COLOR);

	// online vehicles
	editSpecificCell(worksheet, 'A2', 'Online Vehicles', GREEN_COLOR);
	editSpecificCell(worksheet, 'B2', body.onlineVehicles.toString(), GREEN_COLOR);

	// expired vehicles
	editSpecificCell(worksheet, 'A3', 'Expired', YELLOW_COLOR);
	editSpecificCell(worksheet, 'B3', body.expiredVehicles.toString(), YELLOW_COLOR);

	// total vehicles
	editSpecificCell(worksheet, 'A4', 'Total Vehicles', BLUE_COLOR);
	editSpecificCell(worksheet, 'B4', body.totalVehicles.toString(), BLUE_COLOR);

	// corporate client name
	editSpecificCell(worksheet, 'A5', 'Corporate Client', GREEN_COLOR);
	editSpecificCell(worksheet, 'B5', body.corporateName, GREEN_COLOR);

	// title row
	[
		{ content: 'Client Name', cellLetter: 'A' },
		{ content: 'Vehicle Registration', cellLetter: 'B' },
		{ content: 'Client Number', cellLetter: 'C' },
		{ content: 'Destination', cellLetter: 'D' },
		{ content: 'Installation Date', cellLetter: 'E' },
		{ content: 'Expiry Date', cellLetter: 'F' },
		{ content: 'Tracker Status', cellLetter: 'G' },
		{ content: 'Comment', cellLetter: 'H' },
		// from here, everything should not appear on the client-facing document
		{ content: 'Recent Trail', cellLetter: 'I' },
		{ content: 'Current Co-Ordinates', cellLetter: 'J' },
		{ content: 'Stop Duration (Sec)', cellLetter: 'K' },
		{ content: 'Moved Timestamp', cellLetter: 'L' },
		{ content: 'Total Distance', cellLetter: 'M' },
		{ content: 'Protocol', cellLetter: 'N' },
		{ content: 'Traccar Moved At', cellLetter: 'O' },
		{ content: 'Traccar Stopped At', cellLetter: 'P' },
		{ content: 'Traccar Move Begin At', cellLetter: 'Q' },
		{ content: 'Traccar Stop Begin At', cellLetter: 'R' },
		{ content: 'Traccar Parked End At', cellLetter: 'S' },
		{ content: 'Traccar Engine On At', cellLetter: 'T' },
		{ content: 'Traccar Engine Off At', cellLetter: 'U' },
		{ content: 'Traccar Engine Changed At', cellLetter: 'V' },
		{ content: 'Traccar Updated At', cellLetter: 'W' },
		{ content: 'Traccar Course', cellLetter: 'X' },
		{ content: 'Traccar Speed', cellLetter: 'Y' },
	].forEach((e, idx) => {
		if (idx <= 7) {
			editSpecificCell(worksheet, `${e.cellLetter}6`, e.content);
		}

		if (idx >= 8 && query.return_full && query.return_full) {
			editSpecificCell(worksheet, `${e.cellLetter}6`, e.content);
		}
	});

	// actual data
	let intialRow = 7;
	for (const entry of body.entries) {
		// client name
		editSpecificCell(worksheet, `A${intialRow}`, entry.driver.name as unknown as string);

		// vehicle registration
		editSpecificCell(worksheet, `B${intialRow}`, (entry.name as string)?.toUpperCase());

		// client number
		editSpecificCell(worksheet, `C${intialRow}`, entry.driver.phone as unknown as string);

		// destination
		editSpecificCell(worksheet, `D${intialRow}`, body.corporateName.toUpperCase());

		// installation date
		editSpecificCell(worksheet, `E${intialRow}`, entry.device_data.created_at?.toString());

		// expiry date
		editSpecificCell(
			worksheet,
			`F${intialRow}`,
			entry.device_data.expiration_date?.toString() ?? '-',
		);

		// tracker status
		let { color, text } = deduceTrackerStatus(entry.wrapped_status);
		editSpecificCell(worksheet, `G${intialRow}`, text, color);

		// comments
		editSpecificCell(
			worksheet,
			`H${intialRow}`,
			entry.comment && entry.comment.length > 0 ? entry.comment[0].comment : '-',
		);
		if (query.return_full && query.return_full) {
			// from here, everything should not appear on the client-facing document
			// tail
			editSpecificCell(
				worksheet,
				`I${intialRow}`,
				entry.tail && entry.tail.length > 0
					? entry.tail.map((e) => `${e.lat},${e.lng}`).join(',')
					: '-',
			);

			// current coordinates
			editSpecificCell(worksheet, `J${intialRow}`, `${entry.lat},${entry.lng}`);

			// stop duration
			editSpecificCell(worksheet, `K${intialRow}`, entry.stop_duration_sec?.toString());

			// moved timestamp
			editSpecificCell(worksheet, `L${intialRow}`, entry.moved_timestamp?.toString() ?? '-');

			// total distance
			editSpecificCell(worksheet, `M${intialRow}`, entry.total_distance?.toString() ?? '0');

			// protocol
			editSpecificCell(worksheet, `N${intialRow}`, entry.protocol ?? '-');

			// traccar nested data
			editSpecificCell(worksheet, `O${intialRow}`, entry.traccar.moved_at?.toString() ?? '-');
			editSpecificCell(
				worksheet,
				`P${intialRow}`,
				entry.traccar.stoped_at?.toString() ?? '-',
			);
			editSpecificCell(
				worksheet,
				`Q${intialRow}`,
				entry.traccar.move_begin_at?.toString() ?? '-',
			);
			editSpecificCell(
				worksheet,
				`R${intialRow}`,
				entry.traccar.stop_begin_at?.toString() ?? '-',
			);
			editSpecificCell(
				worksheet,
				`S${intialRow}`,
				entry.traccar.parked_end_at?.toString() ?? '-',
			);
			editSpecificCell(
				worksheet,
				`T${intialRow}`,
				entry.traccar.engine_on_at?.toString() ?? '-',
			);
			editSpecificCell(
				worksheet,
				`U${intialRow}`,
				entry.traccar.engine_off_at?.toString() ?? '-',
			);
			editSpecificCell(
				worksheet,
				`V${intialRow}`,
				entry.traccar.engine_changed_at?.toString() ?? '-',
			);
			editSpecificCell(
				worksheet,
				`W${intialRow}`,
				entry.traccar.updated_at?.toString() ?? '-',
			);
			editSpecificCell(worksheet, `X${intialRow}`, entry.traccar.course?.toString() ?? '0');
			editSpecificCell(worksheet, `Y${intialRow}`, entry.traccar.speed?.toString() ?? '0');
		}

		intialRow += 1;
	}

	// adjust the column widths
	map.forEach((_val, k) => (worksheet.getColumn(k + 1).width = 20));

	// Create a buffer from the workbook
	const buffer = await workbook.xlsx.writeBuffer();

	// Set response headers for a download
	event.node.res.setHeader(
		'Content-Type',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	);
	event.node.res.setHeader('Content-Disposition', 'attachment; filename="export.xlsx"');

	// Send the buffer as the response
	return buffer;
});

function editSpecificCell(
	workSheet: ExcelJS.Worksheet,
	cellName: string,
	content: string,
	fgColor?: string,
	mergeXToCell?: string,
	mergeYToCell?: string,
) {
	const targetCell: ExcelJS.Cell = workSheet.getCell(cellName);
	targetCell.value = content;

	if (fgColor) {
		targetCell.fill = {
			type: 'pattern',
			pattern: 'solid',
			fgColor: { argb: fgColor },
		};
	}

	if (mergeXToCell) {
		workSheet.mergeCells(`${cellName}:${mergeXToCell}`);
	}

	if (mergeYToCell) {
		workSheet.mergeCells(`${cellName}:${mergeYToCell}`);
	}
}

function deduceTrackerStatus(online: TrackerStatusWrapperName): { color: string; text: string } {
	if (online == 'Online') {
		return {
			color: GREEN_COLOR,
			text: online,
		};
	}

	if (online == 'Expired') {
		return {
			color: YELLOW_COLOR,
			text: online,
		};
	}

	if (online == 'Offline') {
		return {
			color: RED_COLOR,
			text: online,
		};
	}

	// this should never happen as all vehicles have a tracker status
	return {
		color: BLUE_COLOR,
		text: '-',
	};
}
