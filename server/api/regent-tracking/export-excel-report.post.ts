import { ForReport, type Online } from '~/types/regent-tracking/tracked-vehicles';
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

	// corporate client namec
	// editSpecificCell(worksheet, 'C1', body.corporateName, undefined, 'J10');

	// title row
	[
		'Client Name',
		'Vehicle Registration',
		'Client Number',
		'Destination',
		'Installation Date',
		'Expiry Date',
		'Tracker Status',
		'Comment',
	].forEach((e, idx) => editSpecificCell(worksheet, `${map.get(idx)}4`, e));

	// actual data
	let intialRow = 5;
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
		let { color, text } = deduceTrackerStatus(entry.online);
		editSpecificCell(worksheet, `G${intialRow}`, text, color);

		// comments
		editSpecificCell(
			worksheet,
			`H${intialRow}`,
			entry.comment && entry.comment.length > 0 ? entry.comment[0].comment : '-',
		);

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

function deduceTrackerStatus(online: Online): { color: string; text: string } {
	if (['ack', 'engine', 'online'].includes(online)) {
		return {
			color: GREEN_COLOR,
			text: 'Online',
		};
	}

	if (online == 'expired') {
		return {
			color: RED_COLOR,
			text: 'Expired',
		};
	}

	if (online == 'offline') {
		return {
			color: YELLOW_COLOR,
			text: 'Offline',
		};
	}

	// this should never happen as all vehicles have a tracker status
	return {
		color: BLUE_COLOR,
		text: '-',
	};
}
