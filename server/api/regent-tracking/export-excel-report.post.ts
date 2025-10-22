import { ForReport } from '~/types/regent-tracking/tracked-vehicles';
import ExcelJS from 'exceljs';

type ReportDataBody = {
	offlineVehicles: number;
	onlineVehicles: number;
	expiredVehicles: number;
	totalVehicles: number;
	entries: ForReport;
};

export default defineEventHandler(async (event) => {
	const body: ReportDataBody = await readBody(event);

	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet('My Sheet');

	// Define columns with headers, keys, and widths
	worksheet.columns = [
		{ header: 'Id', key: 'id', width: 10 },
		{ header: 'Name', key: 'name', width: 32 },
		{ header: 'D.O.B.', key: 'dob', width: 15 },
	];

	// Add rows with data
	worksheet.addRow({ id: 1, name: 'John Doe', dob: new Date(1970, 1, 1) });
	worksheet.addRow({ id: 2, name: 'Jane Doe', dob: new Date(1965, 1, 7) });

	worksheet.getCell('A1').fill = {
		type: 'pattern',
		pattern: 'solid',
		fgColor: { argb: 'FF00FF00' },
	};

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
