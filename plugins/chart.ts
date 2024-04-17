import {
	Chart,
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
	ArcElement,
} from "chart.js";
export default defineNuxtPlugin(() => {
	Chart.register(
		CategoryScale,
		LinearScale,
		BarElement,
		Title,
		Tooltip,
		Legend,
		ArcElement
	);

	// Override the default legend configuration for doughnut charts
	// Chart.overrides.doughnut.plugins.legend = {
	// 	position: "bottom", // Place the legend below the chart
	// 	labels: {
	// 		boxWidth: 20,
	// 		boxHeight: 20, // Width of the colored box
	// 		padding: 10, // Padding between the colored box and the label
	// 	},
	// 	display: true, // Ensure the legend is displayed
	// 	fullWidth: true, // Ensure the legend takes the full width of the container
	// 	align: "center", // Align the legend items horizontally
	// };
});
