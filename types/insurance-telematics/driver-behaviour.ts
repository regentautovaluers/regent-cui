export type RiskLevel = 'Low Risk' | 'Medium Risk' | 'High Risk';

export interface DriverRiskScore {
	deviceId: number;
	totalDistanceTraveled: number;
	harshAccelerationScore: PerformanceMetric | null;
	brakingScore: PerformanceMetric | null;
	harshCornering: PerformanceMetric | null;
	averageScore: number;
	averageRiskLevel: RiskLevel | null;
}

export interface PerformanceMetric {
	rawScore: number; // how many times each metric appeared
	riskLevel: RiskLevel;
	percentageScore: number;
}
