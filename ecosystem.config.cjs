module.exports = {
	apps: [
		{
			name: "RegentCorporateUI",
			port: "8000",
			exec_mode: "cluster",
			instances: "max",
			script: "./.output/server/index.mjs",
		},
	],
};
