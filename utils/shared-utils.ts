export function refreshPage() {
	location.reload();
}

export function downloadReport(blob: Blob, name: string) {
	const url = window.URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.setAttribute('download', name);
	document.body.appendChild(link);
	link.click();
	link.parentNode?.removeChild(link);
	window.URL.revokeObjectURL(url); // Clean up memory
}
