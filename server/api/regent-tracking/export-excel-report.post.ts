import { ForReport } from '~/types/regent-tracking/tracked-vehicles';
import ExcelJS from 'exceljs';

type ReportDataBody = {
	offlineVehicles: number;
	onlineVehicles: number;
	expiredVehicles: number;
	totalVehicles: number;
	corporateName: string;
	entries: ForReport[];
};

export default defineEventHandler(async (event) => {
	const body: ReportDataBody = await readBody(event);
	const RED_COLOR = 'FFFF0000';
	const GREEN_COLOR = 'FF00CC00';
	const BLUE_COLOR = 'FF0066FF';
	const YELLOW_COLOR = 'FFFFFF00';
	const dateToday = new Date();
	const map = new Map();
	map.set(0, 'A');
	map.set(1, 'B');
	map.set(2, 'C');
	map.set(3, 'D');
	map.set(4, 'E');
	map.set(5, 'F');
	map.set(6, 'G');
	map.set(7, 'H');
	map.set(8, 'I');
	map.set(9, 'J');

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
	// editSpecificCell(worksheet, 'C1', body.corporateName, undefined, 'J10');

	// title row
	[
		'Client Name',
		'Vehicle Registration',
		'Client Number',
		'Device Sim',
		'Destination',
		'Installation Date',
		'Expiry Date',
		'Expiry Status',
		'Tracker Status',
		'Comment',
	].forEach((e, idx) => editSpecificCell(worksheet, `${map.get(idx)}4`, e));

	// actual data
	let intialRow = 7;
	for (const entry of body.entries) {
		// client name
		editSpecificCell(worksheet, `A${intialRow}`, entry.driver.name as unknown as string);

		// vehicle registration
		editSpecificCell(worksheet, `B${intialRow}`, (entry.name as string)?.toUpperCase());

		// client number
		editSpecificCell(worksheet, `C${intialRow}`, entry.driver.phone as unknown as string);

		// device sim
		editSpecificCell(worksheet, `D${intialRow}`, '-');

		// destination
		editSpecificCell(worksheet, `E${intialRow}`, body.corporateName.toUpperCase());

		// installation date
		editSpecificCell(
			worksheet,
			`F${intialRow}`,
			entry.device_data.created_at.toString().split(' ')[0],
		);

		// expiry date
		editSpecificCell(
			worksheet,
			`G${intialRow}`,
			entry.device_data.expiration_date?.toString().split(' ')[0] as string,
		);

		// expiry status
		editSpecificCell(worksheet, `H${intialRow}`, '-');

		// tracker status
		editSpecificCell(worksheet, `I${intialRow}`, entry.online);

		// comments
		editSpecificCell(
			worksheet,
			`J${intialRow}`,
			entry.comment.length > 0 ? entry.comment[0].comment : '',
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
