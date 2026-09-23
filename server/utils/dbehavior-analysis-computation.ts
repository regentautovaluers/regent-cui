import {
	type RiskLevel,
	type DriverRiskScore,
} from '~/types/insurance-telematics/driver-behaviour';
import { type DeviceHistory } from '~/types/regent-tracking/device-history';

export async function deriveDriverBehaviour(h: DeviceHistory): Promise<DriverRiskScore> {
	const deviceId: number = h.device.id;
	const totalDistanceTraveled = Number(h.distance_sum.split(' ')[0]);
	let analysis: DriverRiskScore | null = {
		deviceId,
		totalDistanceTraveled,
		harshAccelerationScore: null,
		brakingScore: null,
		harshCornering: null,
		averageScore: 0,
		averageRiskLevel: null,
	};

	const appearanceMetrics: {
		harshAccelerationAppearances: number;
		harshBrakingAppearances: number;
		harshTurningAppearances: number;
	} = {
		harshAccelerationAppearances: 0,
		harshBrakingAppearances: 0,
		harshTurningAppearances: 0,
	};
	for (let v of h.items) {
		// 1. Access the inner Item2 object(s)
		if (v.items && v.items.length > 0) {
			for (let v2 of v.items) {
				// Check if the Item2 object and its other_arr exist
				if (v2.other_arr) {
					// 2. Find the string whose name part is "io253"
					const eventString = v2.other_arr.find((str) => str.includes('io253'));

					if (eventString) {
						// Extract the value part (after the colon)
						const value = eventString.split(':')[1]?.trim();

						// 3. Update appearances based on the value
						if (value === '1') {
							appearanceMetrics.harshAccelerationAppearances += 1;
						} else if (value === '2') {
							appearanceMetrics.harshBrakingAppearances += 1;
						} else if (value === '3') {
							appearanceMetrics.harshTurningAppearances += 1;
						}
					}
				}
			}
		}
	}

	// for the braking score
	const brakingPercentageScore = calculateBrakingScore(
		appearanceMetrics.harshBrakingAppearances,
		totalDistanceTraveled,
	);
	analysis.brakingScore = {
		rawScore: appearanceMetrics.harshBrakingAppearances,
		riskLevel: calculateRiskLevel(brakingPercentageScore),
		percentageScore: brakingPercentageScore,
	};

	// for the harsh acceleration
	const harshAcclerationPercentageScore = calculateHarshAccelerationScore(
		appearanceMetrics.harshAccelerationAppearances,
		totalDistanceTraveled,
	);
	analysis.harshAccelerationScore = {
		rawScore: appearanceMetrics.harshAccelerationAppearances,
		riskLevel: calculateRiskLevel(harshAcclerationPercentageScore),
		percentageScore: harshAcclerationPercentageScore,
	};

	// for the harsh turning
	const harshTruningPercentageScore = calculateHarshTurningScore(
		appearanceMetrics.harshTurningAppearances,
		totalDistanceTraveled,
	);
	analysis.harshCornering = {
		rawScore: appearanceMetrics.harshTurningAppearances,
		riskLevel: calculateRiskLevel(harshTruningPercentageScore),
		percentageScore: harshTruningPercentageScore,
	};

	// for the averages
	const averageRiskScore = calculateAverageRiskScore(
		harshAcclerationPercentageScore,
		brakingPercentageScore,
		harshTruningPercentageScore,
	);
	analysis.averageScore = averageRiskScore;
	analysis.averageRiskLevel = calculateRiskLevel(averageRiskScore);

	return analysis;
}

function calculateRiskLevel(percentageScore: number): RiskLevel {
	if (percentageScore >= 5) {
		return 'High Risk';
	} else if (percentageScore >= 2 && percentageScore <= 4) {
		return 'Medium Risk';
	} else {
		return 'Low Risk';
	}
}

function calculateAverageRiskScore(...entries: number[]): number {
	return Number((entries.reduce((acc, curr) => acc + curr, 0) / 3).toFixed(2));
}

function calculateHarshAccelerationScore(
	accelerationCount: number,
	distanceDriven: number,
): number {
	if (distanceDriven == 0) return 0;
	return Number(((accelerationCount / distanceDriven) * 100).toFixed(2));
}

function calculateBrakingScore(breakingCount: number, distanceDriven: number): number {
	if (distanceDriven == 0) return 0;
	return Number(((breakingCount / distanceDriven) * 100).toFixed(2));
}

function calculateHarshTurningScore(harshTurningCount: number, distanceDriven: number): number {
	if (distanceDriven == 0) return 0;
	return Number(((harshTurningCount / distanceDriven) * 100).toFixed(2));
}
