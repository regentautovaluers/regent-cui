export const regentServices = [
	{
		id: 1,
		name: 'Roadside Assistance',
		description:
			'Our 24/7 road rescue service swiftly gets you back on track, whether it’s a flat tire or a breakdown. Trust our services to ensure a smooth ride, so you can continue your journey with peace of mind! We’re committed to minimizing disruptions and maximizing safety on the road.',
		shortDescription:
			'Our 24/7 road rescue service swiftly gets you back on track, whether it’s a flat tire or a breakdown.',
	},
	{
		id: 2,
		name: 'Emergency Evacuation',
		description:
			'Our emergency response service is your lifeline during critical moments. Whether it’s a remote wilderness rescue or a medical evacuation, our team combines the speed of air travel with the stability of ground support, ensuring your safety when every second counts.',
		shortDescription:
			'Our emergency response service is your lifeline during critical moments where every second counts.',
	},
	{
		id: 3,
		name: 'Vehicle Valuation',
		description:
			'With over 20 years of experience, we offer fair and data-driven vehicle assessments you can trust. Access all your reports as well as request for valuations from our new AVA app available on the Google Playstore and coming soon to the Apple App Store.',
		shortDescription:
			'With over 20 years of experience, we offer fair and data-driven vehicle assessments you can trust.',
	},
];

export const googleMapStyle = [
	{
		featureType: 'road',
		stylers: [
			{
				hue: '#5e00ff',
			},
			{
				saturation: -79,
			},
		],
	},
	{
		featureType: 'poi',
		stylers: [
			{
				saturation: -78,
			},
			{
				hue: '#6600ff',
			},
			{
				lightness: -47,
			},
			{
				visibility: 'off',
			},
		],
	},
	{
		featureType: 'road.local',
		stylers: [
			{
				lightness: 22,
			},
		],
	},
	{
		featureType: 'landscape',
		stylers: [
			{
				hue: '#6600ff',
			},
			{
				saturation: -11,
			},
		],
	},
	{},
	{},
	{
		featureType: 'water',
		stylers: [
			{
				saturation: -65,
			},
			{
				hue: '#1900ff',
			},
			{
				lightness: 8,
			},
		],
	},
	{
		featureType: 'road.local',
		stylers: [
			{
				weight: 1.3,
			},
			{
				lightness: 30,
			},
		],
	},
	{
		featureType: 'transit',
		stylers: [
			{
				visibility: 'simplified',
			},
			{
				hue: '#5e00ff',
			},
			{
				saturation: -16,
			},
		],
	},
	{
		featureType: 'transit.line',
		stylers: [
			{
				saturation: -72,
			},
		],
	},
	{},
];
