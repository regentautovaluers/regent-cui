<template>
	<div class="relative h-screen flex-1 pt-[75px]">
		<GoogleMap
			ref="mapRef"
			:api-key="googleMapsApiKey"
			:styles="googleMapStyle"
			style="width: 100%; height: 100vh; position: absolute"
			:center="mapCenter"
			:map-type-control="false"
			:zoom="12"
			:zoom-control="true"
			:fullscreen-control="false"
			:street-view-control="true">
			<Polyline
				v-if="getTrackedVehicle"
				:options="{
					path: getTrackedVehicle.tail.map((e) => {
						return { lat: parseFloat(e.lat), lng: parseFloat(e.lng) };
					}),
					geodesic: true,
					strokeColor: '#ec4899',
					strokeOpacity: 1.0,
					strokeWeight: 5,
				}" />

			<MarkerCluster>
				<CustomMarker
					v-if="computedVehicles"
					v-for="(v, idx) in computedVehicles"
					:key="idx"
					:options="{
						position: { lat: v.lat, lng: v.lng },
						anchorPoint: 'BOTTOM_CENTER',
					}">
					<div>
						<p
							class="size-fit h-fit rounded-lg border-[1px] border-gray-100 bg-white p-1 text-center font-bold">
							{{ v.name.trim() }}
						</p>
						<img
							src="/images/assets/maps-car.png"
							width="50"
							height="50" />
					</div>
				</CustomMarker>
			</MarkerCluster>
		</GoogleMap>

		<div
			class="absolute left-5 flex h-[90%] w-[30rem] translate-y-5 flex-col border-[1px] bg-white shadow-md shadow-gray-300">
			<div class="p-5">
				<h1 class="font-semibold text-gray-600">{{ getPrincipal.corpName }} Fleet</h1>
				<h2
					class="mb-4 inline-flex h-10 w-full items-center justify-between text-sm text-gray-500">
					<span>{{ totalVehicles }} Total Vehicles</span>
					<span class="inline-flex items-center space-x-1">
						<span class="size-3 rounded-full bg-green-500"> </span>
						<span> Online </span>
					</span>
					<span class="inline-flex items-center space-x-1">
						<span class="size-3 rounded-full bg-yellow-500"> </span>
						<span> Offline </span>
					</span>
					<span class="inline-flex items-center space-x-1">
						<span class="size-3 rounded-full bg-red-500"> </span>
						<span> Expired </span>
					</span>
				</h2>
				<!-- filters -->
				<div>
					<form @submit.prevent="">
						<input
							type="text"
							name="search-devices"
							id="search-devices"
							class="mb-4 h-12 w-full rounded-lg bg-gray-100 text-sm text-gray-500 outline-none"
							placeholder="Start typing to search vehicles or drivers"
							v-model="searchString" />

						<div
							class="grid h-10 grid-cols-4 divide-x-[1.5px] overflow-clip rounded-lg border-[1px] text-xs text-gray-600">
							<button
								:class="[
									'font-semibold',
									deviceOnlineStatus == null && 'bg-blue-100',
								]"
								type="button"
								@click="setDeviceOnlineStatus(null)">
								All Vehicles
							</button>
							<button
								:class="[
									'font-semibold',
									deviceOnlineStatus == 'ack' && 'bg-blue-100',
								]"
								type="button"
								@click="setDeviceOnlineStatus('ack')">
								Online
							</button>
							<button
								:class="[
									'font-semibold',
									deviceOnlineStatus == 'offline' && 'bg-blue-100',
								]"
								type="button"
								@click="setDeviceOnlineStatus('offline')">
								Offline
							</button>
							<button
								:class="[
									'font-semibold',
									deviceOnlineStatus == 'expired' && 'bg-blue-100',
								]"
								type="button"
								@click="setDeviceOnlineStatus('expired')">
								Expired
							</button>
						</div>
					</form>
				</div>
			</div>
			<!-- when loading vehicles -->
			<div
				class="flex flex-grow items-center justify-center"
				v-if="fetchingClientVehicles">
				<h1>Loading...</h1>
			</div>

			<!-- The vehicle entries -->
			<div
				class="thin-scrollbar flex-grow overflow-y-auto p-5"
				v-else>
				<div
					v-for="(device, index) in computedVehicles"
					:key="index"
					class="mb-4 h-[12rem] rounded-lg border border-gray-200 p-5 shadow-sm outline-none">
					<div class="flex h-3/6 items-center justify-between">
						<div class="flex w-[100%] space-x-4">
							<button
								:class="[
									'inline-flex h-14 w-[17%] items-center justify-center rounded-lg shadow-md',
									`bg-${deriveColor(device.online)}-500`,
								]">
								<span
									class="icon-[material-symbols-light--delivery-truck-speed-outline-rounded] text-4xl text-slate-100"></span>
							</button>
							<div class="flex-grow">
								<h1 class="font-semibold text-gray-700 uppercase">
									{{ device.name }}
								</h1>
								<h2 class="text-sm text-gray-500">Mombasa Road, Nairobi</h2>
							</div>
						</div>
						<button
							class="inline-flex w-fit cursor-pointer justify-end rounded-lg border border-gray-200 bg-gray-100 p-1"
							type="button"
							@click="
								() => {
									setActiveDevice(device);
								}
							">
							<span
								class="icon-[material-symbols-light--double-arrow-rounded] text-2xl text-gray-600"></span>
						</button>
					</div>
					<div class="flex h-1/6 items-center space-x-3 text-sm text-gray-600">
						<span class="inline-flex items-center space-x-1">
							<span
								class="icon-[material-symbols-light--person-2-outline-rounded] text-2xl"></span
							><span>{{ device.driver_data.name ?? 'Name N/A' }}</span></span
						>
						<span>&vert;</span>
						<span class="inline-flex items-center space-x-3">
							<span
								class="icon-[material-symbols-light--nest-clock-farsight-analog-rounded] text-xl"></span
							><span>{{ device.time.toString().replace(' ', '-') }}</span>
						</span>
					</div>
					<div class="flex h-2/6 items-end justify-between">
						<div
							:class="[
								'flex h-10 w-24 items-center justify-center space-x-2 rounded-lg border text-sm outline-none',
								`bg-${deriveColor(device.online)}-100`,
								`border-${deriveColor(device.online)}-200`,
							]">
							<!-- tracker online -->
							<span
								v-if="['ack', 'engine', 'online'].includes(device.online)"
								:class="[
									'icon-[material-symbols-light--signal-wifi-4-bar] text-xl',
									`text-${deriveColor(device.online)}-600`,
								]"></span>
							<!-- tracker offline -->
							<span
								:class="[
									'icon-[material-symbols-light--signal-wifi-statusbar-not-connected] text-xl',
									`text-${deriveColor(device.online)}-600`,
								]"
								v-else-if="device.online == 'offline'"></span>

							<!-- expired subscription -->
							<span
								:class="[
									'icon-[material-symbols-light--signal-disconnected] text-xl',
									`text-${deriveColor(device.online)}-600`,
								]"
								v-else-if="device.online == 'expired'"></span>
							<span :class="['text-sm', `text-${deriveColor(device.online)}-600`]">{{
								device.online
							}}</span>
						</div>
						<span :class="['text-sm', `text-${deriveColor(device.online)}-600`]"
							>{{ device.speed }} {{ device.distance_unit_hour }}</span
						>
					</div>
				</div>
			</div>
		</div>

		<!-- the sidekick panel -->
		<Transition>
			<!-- TODO: Add in animations later  -->
			<div
				class="absolute left-0 flex h-[90%] max-h-[90%] w-[30rem] translate-x-[31.2rem] translate-y-5 flex-col border-[1px] bg-white shadow-md shadow-gray-300"
				v-if="getTrackedVehicle">
				<div class="p-5">
					<div class="flex items-center justify-between">
						<div>
							<h1 class="font-semibold text-gray-600">
								{{ getTrackedVehicle?.name }}
							</h1>
							<h2 class="text-sm text-gray-500">Updated 1 minute ago</h2>
						</div>
						<button
							class="inline-flex size-11 items-center justify-center rounded-lg border-[1px]"
							@click="cleanTrackedVehicle()">
							<span
								class="icon-[material-symbols-light--close-small] text-3xl text-gray-600"></span>
						</button>
					</div>

					<!-- tracker status -->
					<div class="my-4 flex h-[68px] items-end justify-between">
						<div
							:class="[
								'flex h-10 w-24 items-center justify-center space-x-2 rounded-lg border text-sm outline-none',
								`bg-${deriveColor(getTrackedVehicle?.online)}-100`,
								`border-${deriveColor(getTrackedVehicle?.online)}-200`,
							]">
							<!-- tracker online -->
							<span
								v-if="
									['ack', 'engine', 'online'].includes(getTrackedVehicle?.online)
								"
								:class="[
									'icon-[material-symbols-light--signal-wifi-4-bar] text-xl',
									`text-${deriveColor(getTrackedVehicle?.online)}-600`,
								]"></span>
							<!-- tracker offline -->
							<span
								:class="[
									'icon-[material-symbols-light--signal-wifi-statusbar-not-connected] text-xl',
									`text-${deriveColor(getTrackedVehicle?.online)}-600`,
								]"
								v-else-if="getTrackedVehicle?.online == 'offline'"></span>

							<!-- expired subscription -->
							<span
								:class="[
									'icon-[material-symbols-light--signal-disconnected] text-xl',
									`text-${deriveColor(getTrackedVehicle?.online)}-600`,
								]"
								v-else-if="getTrackedVehicle?.online == 'expired'"></span>
							<span
								:class="[
									'text-sm',
									`text-${deriveColor(getTrackedVehicle?.online)}-600`,
								]"
								>{{ getTrackedVehicle?.online }}</span
							>
						</div>
						<span
							:class="[
								'text-sm',
								`text-${deriveColor(getTrackedVehicle?.online)}-600`,
							]"
							>{{ getTrackedVehicle?.speed }}
							{{ getTrackedVehicle?.distance_unit_hour }}</span
						>
					</div>
					<!-- tab switcher -->
					<div
						class="grid h-10 grid-cols-3 divide-x-[1.5px] overflow-clip rounded-lg border-[1px] text-xs text-gray-600">
						<button
							:class="[
								'font-semibold',
								activeDeviceTab == 'details' && 'bg-blue-100',
							]"
							type="button"
							@click="setActiveDeviceTab('details')">
							Details
						</button>
						<button
							:class="[
								'inline-flex items-center justify-center space-x-2 font-semibold',
								activeDeviceTab == 'alerts' && 'bg-blue-100',
							]"
							type="button"
							@click="
								() => {
									executeFetchDeviceAlerts();
									setActiveDeviceTab('alerts');
								}
							">
							<span
								class="icon-[svg-spinners--ring-resize] text-lg text-gray-600"
								v-if="fetchingDeviceAlerts"></span>
							<span>Alerts</span>
						</button>
						<button
							:class="[
								'inline-flex items-center justify-center space-x-2 font-semibold disabled:bg-gray-100',
								activeDeviceTab == 'history' && 'bg-blue-100',
							]"
							type="button"
							:disabled="
								getTrackedVehicle?.online == 'offline' &&
								getTrackedVehicle?.timestamp == 0
							"
							@click="
								() => {
									executeFetchDeviceHistory();
									setActiveDeviceTab('history');
								}
							">
							<span
								class="icon-[svg-spinners--ring-resize] text-lg text-gray-600"
								v-if="fetchingDeviceHistory"></span>
							<span>History</span>
						</button>
					</div>
				</div>

				<!-- switch view based on what tab is currently active  -->
				<div
					class="flex-grow space-y-5 p-5"
					v-if="activeDeviceTab == 'details'">
					<div
						class="flex h-fit flex-col rounded-lg border border-gray-200 p-4 shadow-sm outline-none">
						<h1 class="w-full font-bold text-gray-600">Vehicle Information</h1>
						<div class="my-5 h-20 rounded-lg border border-green-200 bg-green-50 p-3">
							<h1 class="text-sm font-semibold text-gray-500">Last Location</h1>
							<span class="text-sm text-gray-400"
								>Gataka Road, Nkaimurunya ward, Kajiado County</span
							>
						</div>
						<div class="space-y-5 text-sm">
							<!-- diver name -->
							<div class="grid grid-cols-[40%_60%] divide-x-1 divide-gray-400">
								<h1 class="inline-flex items-center space-x-3">
									<span
										class="icon-[material-symbols-light--person-2-outline-rounded] text-xl text-gray-500"></span>
									<span class="text-gray-500">Driver</span>
								</h1>
								<span class="text-end font-semibold text-gray-600">{{
									getTrackedVehicle?.driver_data?.name ?? 'Name N/A'
								}}</span>
							</div>

							<!-- diver name -->
							<div class="grid grid-cols-[40%_60%] divide-x-1 divide-gray-400">
								<h1 class="inline-flex items-center space-x-3">
									<span
										class="icon-[material-symbols-light--indeterminate-question-box] text-xl text-gray-500"></span>
									<span class="text-gray-500">Current Status</span>
								</h1>
								<span class="text-end font-semibold text-gray-600"
									>{{ getTrackedVehicle?.online }}
								</span>
							</div>

							<!-- recent ping -->
							<div class="grid grid-cols-[40%_60%] divide-x-1 divide-gray-400">
								<h1 class="inline-flex items-center space-x-3">
									<span
										class="icon-[material-symbols-light--nest-clock-farsight-analog-rounded] text-lg text-gray-500"></span>
									<span class="text-gray-500">Recent Ping</span>
								</h1>
								<span class="text-end font-semibold text-gray-600">{{
									getTrackedVehicle?.time?.toString().replace(' ', ' | ')
								}}</span>
							</div>
						</div>
					</div>

					<div
						class="flex h-fit flex-col rounded-lg border border-gray-200 p-4 shadow-sm outline-none">
						<h1 class="mb-4 w-full text-sm font-bold text-gray-600">
							Vehicle Commands
						</h1>
						<div class="grid grid-cols-2 gap-4">
							<button
								class="inline-flex items-center justify-center space-x-3 rounded-lg bg-red-500 p-3 text-slate-100"
								type="button"
								@click="
									triggerDeviceCommand(
										'stop',
										getTrackedVehicle?.id as number,
										'Engine Stop',
										'engineStop',
									)
								">
								<span
									class="icon-[svg-spinners--ring-resize]text-2xl text-slate-100"
									v-if="stopDeviceCommandLoading"></span>
								<span
									v-else
									class="icon-[material-symbols-light--stop-circle-rounded] text-2xl text-slate-100"></span>
								<span class="text-sm font-semibold">Stop Engine</span>
							</button>
							<button
								class="inline-flex items-center justify-center space-x-3 rounded-lg bg-green-500 p-3 text-sm font-semibold text-slate-100"
								type="button"
								@click="
									triggerDeviceCommand(
										'start',
										getTrackedVehicle?.id as number,
										'Engine Resume',
										'engineResume',
									)
								">
								<span
									class="icon-[svg-spinners--ring-resize]text-2xl text-slate-100"
									v-if="startDeviceCommandLoading"></span>
								<span
									class="icon-[material-symbols-light--play-circle] text-2xl text-slate-100"
									v-else></span>
								<span class="text-sm font-semibold">Start Engine</span>
							</button>
						</div>
					</div>
				</div>
				<div
					class="thin-scrollbar relative flex-grow overflow-y-auto pt-24"
					v-else-if="activeDeviceTab == 'alerts'">
					<div class="absolute top-0 my-3 h-20 w-full bg-red-500 p-2"></div>
					<div
						v-for="(a, index) in alerts"
						:key="index"
						class="mx-5 mb-4 h-28 rounded-lg border border-gray-300 p-5 shadow-sm">
						<h1 class="font-bold text-gray-600">{{ a.type }}</h1>
						<p class="text-sm font-medium text-gray-500">
							{{ a.name }}
						</p>
						<p class="inline-flex items-center space-x-3 text-sm text-gray-400">
							<span>&iacute;</span>
							<span
								>{{ a.created_at.split(' ')[0] }} |
								{{ a.created_at.split(' ')[1] }}</span
							>
						</p>
					</div>
				</div>
				<div
					class="thin-scrollbar flex-grow space-y-5 overflow-y-auto p-5"
					v-else-if="activeDeviceTab == 'history'">
					<!-- the stats -->
					<div class="grid grid-cols-2 gap-4">
						<div
							class="flex h-28 items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
							<div class="flex-grow text-sm">
								<h2 class="text-gray-500">Total Distance</h2>
								<h1 class="font-semibold text-gray-700">
									{{ deviceHistory?.distance_sum ?? 'Unknown' }}
								</h1>
							</div>
							<button
								class="inline-flex size-[3rem] items-center justify-center rounded-md border border-blue-300 bg-blue-100">
								<span
									class="icon-[material-symbols-light--route-outline] text-2xl text-blue-600"></span>
							</button>
						</div>
						<div
							class="flex h-28 items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
							<div class="flex-grow text-sm">
								<h2 class="text-gray-500">Total Trips</h2>
								<h1 class="font-semibold text-gray-700">
									{{
										deviceMovement.length == 0
											? 'Unknown'
											: deviceMovement.reduce(
													(acc, curr) => acc + curr.movement.length,
													0,
												)
									}}
								</h1>
							</div>
							<button
								class="inline-flex size-[3rem] items-center justify-center rounded-md border border-green-300 bg-green-100">
								<span
									class="icon-[material-symbols-light--pin-drop] text-2xl text-green-600"></span>
							</button>
						</div>
						<div
							class="col-span-2 flex h-28 items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
							<div class="flex-grow text-sm">
								<h2 class="text-gray-500">Stop Duration</h2>
								<h1 class="font-semibold text-gray-700">
									{{ deviceHistory?.stop_duration ?? 'Unknown' }}
								</h1>
							</div>
							<button
								class="inline-flex size-[3rem] items-center justify-center rounded-md border border-yellow-300 bg-yellow-100">
								<span
									class="icon-[material-symbols-light--clock-loader-20] text-2xl text-yellow-600"></span>
							</button>
						</div>
					</div>
					<!-- nesting area, history replay e.t.c -->
					<div
						class="flex h-fit flex-col divide-y-2 rounded-lg border bg-white shadow-xs outline-none">
						<div class="h-20 p-5">
							<h1 class="font-bold text-gray-700">Nesting Area Prediction</h1>
							<h2 class="text-sm text-gray-500">
								Where were you most likely to find the vehicle?
							</h2>
						</div>
						<div class="space-y-5 p-5">
							<div
								class="h-[10.5rem] rounded-lg border border-green-100 bg-gray-100 p-5 outline-none"
								v-for="(e, idx) in nestingAreas"
								:key="idx">
								<div class="flex items-center justify-between">
									<div>
										<h1
											class="font-semibold text-gray-700"
											v-if="idx == 0">
											Most Likely
										</h1>
										<h1
											class="font-semibold text-gray-700"
											v-else-if="idx == 1">
											Medium Likely
										</h1>
										<h1
											class="font-semibold text-gray-700"
											v-else-if="idx == 2">
											Least Likely
										</h1>
										<h1
											class="font-semibold text-gray-700"
											v-else>
											Other Places
										</h1>
										<p class="text-sm text-gray-500">
											Kericho Road, Kahawa Sukari, 4th Avenue
										</p>
									</div>
									<div
										v-if="[0, 1, 2].includes(idx)"
										:class="[
											'flex w-[25%] justify-center rounded-full border p-1 text-xs outline-none',
											idx == 0 &&
												'border-green-400 bg-green-100 text-green-500',
											idx == 1 &&
												'border-yellow-400 bg-yellow-100 text-yellow-500',
											idx == 2 && 'border-red-400 bg-red-100 text-red-500',
										]">
										<span v-if="idx == 0">Very High</span>
										<span v-else-if="idx == 1">Medium</span>
										<span v-else-if="idx == 2">Low</span>
									</div>
								</div>
								<div class="mt-2 flex items-center justify-between">
									<div>
										<h1 class="inline-flex items-center space-x-1">
											<span
												class="icon-[material-symbols-light--nest-clock-farsight-analog-rounded] text-gray-700"></span>
											<span class="font-bold text-gray-700"
												>{{ Math.ceil(e.location_time_hours) }}hrs</span
											>
										</h1>
										<h2 class="text-sm text-gray-500">Time Spent</h2>
									</div>
									<div>
										<h1 class="inline-flex items-center space-x-1">
											<span
												class="icon-[material-symbols-light--pie-chart-outline] text-xl text-gray-700"></span>
											<span class="font-bold text-gray-700"
												>~{{
													e.location_time_hours_fraction.toFixed(1)
												}}%</span
											>
										</h1>
										<h2 class="text-sm text-gray-500">Of Time</h2>
									</div>
									<div>
										<h1 class="inline-flex items-center space-x-1">
											<span
												class="icon-[material-symbols-light--pin-drop-outline] text-xl text-gray-700"></span>
											<span class="font-bold text-gray-700">{{
												e.appearances
											}}</span>
										</h1>
										<h2 class="text-sm text-gray-500">Visits</h2>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="h-fit divide-y-2 rounded-lg border bg-white shadow-xs outline-none">
						<div class="p-5">
							<h1 class="font-bold text-gray-700">Trip History</h1>
							<h2 class="text-sm text-gray-500">
								Movement trail of the vehicle in this period
							</h2>
						</div>
						<div class="space-y-5 p-5">
							<div
								class="h-fit divide-y-2 rounded-lg border outline-none"
								v-for="(e, idx) in deviceMovement"
								:key="idx">
								<div class="flex h-14 items-center p-5">
									<h1 class="text-sm font-bold">{{ e.date }}</h1>
								</div>
								<div class="p-5">
									<!-- start of timeline -->
									<template
										v-if="e.movement.length > 0"
										v-for="(m, idx) in e.movement"
										:key="idx">
										<ol class="relative border-s border-green-500">
											<li class="ms-4">
												<div
													class="absolute -start-2.5 size-5 rounded-full border border-white bg-green-500"></div>
												<h1
													class="inline-flex space-x-3 text-sm leading-none text-gray-700">
													<span class="font-semibold">Start</span>
													<span>&VerticalBar;</span>
													<time class="font-semibold">{{
														m.startedAt.split(' ')[1].substring(0, 5)
													}}</time>
												</h1>
												<p class="text-sm font-normal text-gray-500">
													Kericho Road, Kahawa Sukari
												</p>
												<p
													class="mb-4 inline-flex items-center space-x-2 text-sm">
													<span class="text-gray-700"
														>Driving Duration</span
													>
													<span class="text-2xl">&middot;</span>
													<span class="text-gray-500">{{
														m.drivingDuration
													}}</span>
												</p>
											</li>
										</ol>
										<ol
											class="relative border-s border-yellow-500"
											v-if="m.idlePeriods.length > 0"
											v-for="(i, idx) in m.idlePeriods"
											:key="idx">
											<li class="ms-4">
												<div
													class="absolute -start-2.5 size-5 rounded-full border border-white bg-yellow-500"></div>
												<h1
													class="inline-flex space-x-3 text-sm leading-none text-gray-700">
													<span class="font-semibold">Idle</span>
													<span>&VerticalBar;</span>
													<span
														class="inline-flex items-center space-x-1">
														<time class="font-semibold"
															>{{
																i.startedAt
																	.split(' ')[1]
																	.substring(0, 5)
															}}
														</time>
														<span> - </span>
														<time class="font-semibold"
															>{{
																i.stoppedAt
																	.split(' ')[1]
																	.substring(0, 5)
															}}
														</time>
														<span class="text-gray-500"
															>({{
																i.durationInMinutes.toFixed(2)
															}}
															min)</span
														>
													</span>
												</h1>

												<p
													class="mb-4 inline-flex items-center space-x-2 text-sm">
													<span class="text-gray-700">Idle Duration</span>
													<span class="text-2xl">&middot;</span>
													<span class="text-gray-500">{{
														m.totalIdleDuration
													}}</span>
												</p>
											</li>
										</ol>
										<ol class="relative border-s border-red-500">
											<li class="ms-4">
												<div
													class="absolute -start-2.5 size-5 rounded-full border border-white bg-red-500"></div>
												<h1
													class="inline-flex space-x-3 text-sm leading-none text-gray-700">
													<span class="font-semibold">Stop</span>
													<span>&VerticalBar;</span>
													<time class="font-semibold">{{
														m.stoppedAt.split(' ')[1].substring(0, 5)
													}}</time>
												</h1>
												<p class="text-sm font-normal text-gray-500">
													Kericho Road, Kahawa Sukari
												</p>
												<p
													class="mb-4 inline-flex items-center space-x-2 text-sm">
													<span class="text-gray-700">Stop Duration</span>
													<span class="text-2xl">&middot;</span>
													<span class="text-gray-500">1hrs 10 min</span>
												</p>
											</li>
										</ol>
										<!-- end of timeline -->
									</template>
									<template v-else>
										<div
											class="rounded-lg border border-yellow-300 bg-yellow-100 p-2">
											<p class="text-sm text-yellow-500">
												No movement history available for this day.
											</p>
										</div>
									</template>
								</div>
							</div>
						</div>
					</div>
					<NuxtLink
						:to="{
							name: 'regent-tracking-vehicle-history',
							query: {
								device_id: getTrackedVehicle?.id,
								vehicle_reg: getTrackedVehicle?.name,
							},
						}"
						class="inline-flex h-14 min-h-14 w-full items-center justify-center space-x-1 rounded-lg bg-blue-600 transition-colors duration-150 outline-none hover:bg-blue-700">
						<span
							class="icon-[material-symbols-light--info-outline-rounded] text-xl text-slate-100"></span>
						<span class="text-sm font-semibold text-slate-100"
							>View Detailed History</span
						>
					</NuxtLink>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
	import { type LocationCoords } from '~/types';
	import { GoogleMap, InfoWindow, Polyline, CustomMarker, MarkerCluster } from 'vue3-google-map';
	import { googleMapStyle } from '~/config/ava-google-map-config';
	import { useGoogleMapsConfig } from '~/composables/useGoogleMapsConfig';
	definePageMeta({
		name: 'regent-tracking-home',
		layout: 'console-layout',
	});
	const { getPrincipal } = useAuth();
	const { googleMapsApiKey } = useGoogleMapsConfig();

	const {
		totalVehicles,
		computedVehicles,
		searchString,
		deviceOnlineStatus,
		fetchingClientVehicles,
		errorFetchingClientVehicles,
		getTrackedVehicle,
		activeDeviceTab,
		mapCenter,
		deriveColor,
		setDeviceOnlineStatus,
		setActiveDevice,
		setActiveDeviceTab,
		cleanTrackedVehicle,
	} = await useRegentDeviceTracking();
	const { startDeviceCommandLoading, stopDeviceCommandLoading, triggerDeviceCommand } =
		useRegentTrackingDeviceUtils();

	const {
		dateFrom,
		dateTo,
		alerts,
		fetchingDeviceAlerts,
		errorFetchingDeviceAlerts,
		executeFetchDeviceAlerts,
	} = await useRegentTrackingDeviceAlerts();

	const {
		filterPeriod,
		deviceHistory,
		fetchingDeviceHistory,
		errorFetchingDeviceHistory,
		nestingAreas,
		deviceMovement,
		setFilterPeriod,
		setPositionOnMap,
		setPolylineCoords,
		executeFetchDeviceHistory,
	} = await useRegentTrackingDeviceHistory();
</script>
