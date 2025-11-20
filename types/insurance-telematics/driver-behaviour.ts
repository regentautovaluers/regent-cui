export type RiskLevel = 'low' | 'medium' | 'high';

export interface DriverRiskScore {
	deviceId: number;
	totalDistanceTraveled: number;
	harshAccelerationScore: PerformanceMetric | null;
	brakingScore: PerformanceMetric | null;
	overspeedScore: PerformanceMetric | null;
	averageScore: number;
}

export interface PerformanceMetric {
	rawScore: number; // how many times each metric appeared
	riskLevel: RiskLevel;
	percentageScore: number;
}
