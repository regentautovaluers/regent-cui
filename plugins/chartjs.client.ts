import {
	Chart,
	Title,
	Tooltip,
	Legend,
	BarElement,
	CategoryScale,
	LinearScale,
	ArcElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';

export default defineNuxtPlugin(() => {
	Chart.register(
		CategoryScale,
		LinearScale,
		BarElement,
		Title,
		Tooltip,
		Legend,
		ArcElement,
		ChartDataLabels,
		annotationPlugin,
	);
});
