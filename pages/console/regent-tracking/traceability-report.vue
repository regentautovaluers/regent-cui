<template>
	<div class="console-layout-spacing flex flex-col space-y-10">
		<!-- top part -->
		<div
			class="inline-flex h-28 items-center justify-between rounded-lg border border-gray-200 bg-white p-5 shadow-sm outline-none">
			<div class="flex h-full items-center space-x-3">
				<button
					class="inline-flex h-[70%] w-[50px] items-center justify-center rounded-lg bg-red-500 outline-none">
					<span
						class="icon-[material-symbols-light--shield-outline] text-4xl text-slate-100"></span>
				</button>
				<div>
					<h1 class="text-xl font-semibold text-gray-700">Traceability Report</h1>
					<h2 class="text-sm text-gray-500">Real-time Vehicle Status and Monitoring</h2>
				</div>
			</div>
			<div class="flex items-center space-x-4">
				<button
					class="inline-flex h-12 w-40 items-center justify-center space-x-1 rounded-md bg-green-500 text-sm text-slate-100 transition-colors duration-200 ease-in-out outline-none hover:bg-green-600">
					<span class="icon-[material-symbols-light--download-rounded] text-2xl"></span>
					<span>Export Excel</span></button
				><button
					class="inline-flex h-12 w-40 items-center justify-center space-x-1 rounded-md bg-red-500 text-sm text-slate-100 transition-colors duration-200 ease-in-out outline-none hover:bg-red-600"
					data-modal-target="export-report-pdf-modal"
					data-modal-toggle="export-report-pdf-modal">
					<span
						class="icon-[material-symbols-light--table-convert-outline] text-2xl"></span>
					<span>Export PDF</span>
				</button>
			</div>
		</div>

		<!-- the stats -->
		<div class="grid h-28 grid-cols-5 gap-5">
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Total Vehicles</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{ computedStatistics.total_devices }}
					</h1>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-blue-300 bg-blue-100">
					<span
						class="icon-[material-symbols-light--supervisor-account] text-3xl text-blue-600"></span>
				</button>
			</div>
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Online Vehicles</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{ computedStatistics.total_online }}
					</h1>
					<h3 class="inline-flex items-center space-x-1 text-sm">
						<span class="font-bold text-green-500"
							>{{ computedStatistics.dist.online_dist }}%</span
						><span class="text-gray-500">of total</span>
					</h3>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-green-300 bg-green-100">
					<span
						class="icon-[material-symbols-light--android-wifi-4-bar] text-3xl text-green-600"></span>
				</button>
			</div>
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Offline Vehicles</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{ computedStatistics.total_offline }}
					</h1>
					<h3 class="inline-flex items-center space-x-1 text-sm">
						<span class="font-bold text-red-500"
							>{{ computedStatistics.dist.offline_dist }}%</span
						><span class="text-gray-500">of total</span>
					</h3>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-red-300 bg-red-100">
					<span
						class="icon-[material-symbols-light--android-wifi-4-bar-off] text-3xl text-red-600"></span>
				</button>
			</div>
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Installations</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{ computedStatistics.new_installations }}
					</h1>
					<h3 class="inline-flex items-center space-x-1 text-sm text-gray-500">
						Last 1 Month
					</h3>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-blue-300 bg-blue-100">
					<span
						class="icon-[material-symbols-light--chart-data-outline] text-3xl text-blue-600"></span>
				</button>
			</div>
			<div
				class="flex h-full items-center justify-center rounded-lg border bg-white p-5 shadow-xs outline-none">
				<div class="flex-grow">
					<h2 class="text-sm text-gray-500">Expiring Soon</h2>
					<h1 class="text-lg font-semibold text-gray-700">
						{{ computedStatistics.expires_soon }}
					</h1>
					<h3 class="inline-flex items-center space-x-1 text-sm text-gray-500">
						Within 30 days
					</h3>
				</div>
				<button
					class="inline-flex size-[3.2rem] items-center justify-center rounded-md border border-purple-300 bg-purple-100">
					<span
						class="icon-[material-symbols-light--date-range] text-3xl text-purple-600"></span>
				</button>
			</div>
		</div>

		<!-- general vehicle data -->
		<div
			class="divide-y-[2px] rounded-lg border border-gray-200 bg-white shadow-sm outline-none">
			<div class="flex h-24 items-center justify-between p-5 text-sm">
				<div>
					<h1 class="text-lg font-bold text-gray-700">All Vehicles</h1>
					<h2 class="text-sm text-gray-500">
						{{ computedStatistics.total_devices }} Vehicles Found
					</h2>
				</div>
			</div>
			<div class>
				<form class="flex w-full items-center justify-between p-5">
					<input
						type="text"
						name="search-tracked-device"
						id="search-tracked-device"
						placeholder="Search by registration, client name or client number."
						class="h-14 w-1/3 rounded-md ps-10 text-sm text-gray-700 outline-none placeholder:text-gray-500" />
				</form>

				<!-- table -->
				<div class="flex-grow">
					<div class="relative overflow-x-auto">
						<table class="w-full text-left text-gray-500">
							<thead class="bg-gray-100 text-sm text-gray-700 uppercase">
								<tr>
									<!-- Details will show client name and their contact -->

									<th
										scope="col"
										class="table-headers tablet:table-cell hidden ps-3">
										Device
									</th>
									<th
										scope="col"
										class="table-headers">
										<span class="font-bold">Installation &</span><br /><span
											class="font-bold"
											>Subscription</span
										>
									</th>
									<th
										scope="col"
										class="table-headers desktop-4k:table-cell hidden">
										Last Seen
									</th>
									<th
										scope="col"
										class="table-headers laptop:table-cell hidden">
										Status
									</th>
									<th
										scope="col"
										class="table-headers laptop:table-cell hidden">
										Latest Updates
									</th>
									<th
										scope="col"
										class="table-headers laptop:table-cell hidden">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								<!-- loading state -->
								<tr
									class="border-b bg-white hover:bg-gray-100"
									v-for="a in 10"
									:key="a"
									v-if="fetchingClientVehicles">
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>regenthq</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>domain role</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>agency</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>authorizedby</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>bookingstage</span
										>
									</td>
									<td class="p-6 text-gray-300">
										<span class="animate-pulse rounded-lg bg-gray-300"
											>bookingstage</span
										>
									</td>
									<td></td>
								</tr>

								<!-- the actual data -->
								<tr
									class="border-b bg-white text-sm hover:bg-gray-100"
									v-else-if="
										!fetchingClientVehicles &&
										computedVehicles &&
										computedVehicles.length > 0
									"
									v-for="(v, idx) in computedVehicles"
									:key="idx">
									<td class="tablet:table-cell py-5 ps-3">
										<span class="font-bold text-gray-700">{{ v.name }}</span>
										<br />
										<p class="inline-flex w-fit items-center space-x-1">
											<span
												class="icon-[material-symbols-light--person-2-rounded] text-xl"></span>
											<span class="text-gray-700">{{
												v.driver_data?.name ?? 'Name N/A'
											}}</span>
										</p>
										<br />
										<p class="inline-flex w-fit items-center space-x-1">
											<span
												class="icon-[material-symbols-light--settings-phone-sharp] text-xl"></span>
											<span>{{ v.driver_data?.phone ?? 'Phone N/A' }}</span>
										</p>
									</td>
									<td class="tablet:table-cell py-5">
										<p class="inline-flex w-fit space-x-2">
											<span class="font-semibold text-gray-700"
												>Installed:</span
											>
											<span>{{
												v.device_data.created_at
													?.toString()
													.split(' ')[0] ?? 'Date N/A'
											}}</span>
										</p>
										<br />
										<p class="inline-flex w-fit space-x-2">
											<span class="font-semibold text-gray-700"
												>Expires:
											</span>
											<span>{{
												v.device_data.expiration_date
													?.toString()
													.split(' ')[0] ?? 'Date N/A'
											}}</span>
										</p>
									</td>
									<td class="tablet:table-cell hidden py-5">
										<p class="inline-flex items-center space-x-2">
											<span
												class="icon-[material-symbols-light--nest-clock-farsight-analog-outline] text-xl"></span>
											<span>{{
												v.device_data.traccar.ack_time
													?.toString()
													.split(' ')[0] ?? 'Date N/A'
											}}</span>
										</p>
									</td>
									<td class="tablet:table-cell hidden py-5">
										<p class="inline-flex items-center space-x-2">
											<span
												:class="[
													'icon-[material-symbols-light--android-wifi-4-bar-off] text-xl',
													'offline' == v.online && 'text-red-500',
													'expired' == v.online && 'text-yellow-500',
													['ack', 'engine', 'online'].includes(
														v.online,
													) && 'text-green-500',
												]"></span>
											<span
												:class="[
													'rounded-full border-[1px] px-2 py-1 text-sm',
													'offline' == v.online &&
														'border-red-500 bg-red-200 text-red-500',
													'expired' == v.online &&
														'border-yellow-500 bg-yellow-200 text-yellow-500',
													['ack', 'engine', 'online'].includes(
														v.online,
													) &&
														'border-green-500 bg-green-200 text-green-500',
												]"
												>{{ v.online }}</span
											>
										</p>
									</td>
									<td
										class="tablet:table-cell hidden w-[30rem] max-w-[30rem] py-5">
										<p
											class="inline-flex flex-col space-y-1 space-x-2 rounded-md bg-blue-100 p-2">
											<span class="font-semibold text-gray-700"
												>Account Manager</span
											><span class="text-xs text-wrap text-gray-500"
												>Lorem ipsum dolor sit amet consectetur adipisicing
												elit. Repellendus nihil odit laborum corrupti?
											</span>
										</p>
									</td>
									<td class="tablet:table-cell hidden py-5 ps-3">
										<button
											class="rounded-md border-[1px] border-green-500 bg-green-100 px-2 py-1 text-green-500"
											:data-modal-target="`add-comment-tbl-${idx}`"
											:data-modal-toggle="`add-comment-tbl-${idx}`">
											Add Comment
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<!-- page controls -->
				<div
					class="tablet:flex-row tablet:min-h-12 tablet:h-12 my-5 flex h-16 min-h-16 flex-col items-center justify-between px-5">
					<h1 class="text-sm font-semibold text-gray-500">
						Showing {{ page + 1 }} of {{ totalPages }} pages.
					</h1>
					<div
						class="tablet:w-fit tablet:block flex h-full w-full justify-center space-x-2 md:space-x-4">
						<button
							class="table-page-buttons"
							@click="page -= 1"
							:disabled="page === 0 || totalPages == 1">
							Previous
						</button>
						<button
							class="table-page-buttons"
							@click="page += 1"
							:disabled="page === totalPages - 1 || totalPages == 1">
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
		<!-- end of general vehicle data -->

		<!-- ending analysis -->
		<div class="grid h-[14rem] grid-cols-2 gap-10">
			<div class="h-full rounded-lg border bg-white p-5 shadow-sm outline-none">
				<h1 class="font-semibold text-gray-700">Vehicle Status Distribution</h1>
				<!-- online vehicles -->
				<div class="mt-5 space-y-2">
					<div class="flex items-center justify-between">
						<h1 class="inline-flex items-center space-x-2">
							<div class="size-3 rounded-full bg-green-500"></div>
							<span class="text-sm font-semibold text-gray-700">Online</span>
						</h1>
						<h2 class="inline-flex items-center space-x-2">
							<span class="text-sm font-semibold text-green-500">{{
								computedStatistics.total_online
							}}</span>
							<span class="text-sm text-gray-500"
								>({{ computedStatistics.dist.online_dist }}%)</span
							>
						</h2>
					</div>
					<div class="h-2.5 w-full rounded-full bg-gray-200">
						<div
							class="h-2.5 rounded-full bg-green-500"
							v-bind:style="{
								width: `${computedStatistics.dist.online_dist}%`,
							}"></div>
					</div>
				</div>
				<!-- offline vehicles  -->
				<div class="mt-8 space-y-2">
					<div class="flex items-center justify-between">
						<h1 class="inline-flex items-center space-x-2">
							<div class="size-3 rounded-full bg-red-500"></div>
							<span class="text-sm font-semibold text-gray-700">Offline</span>
						</h1>
						<h2 class="inline-flex items-center space-x-2">
							<span class="text-sm font-semibold text-red-500">{{
								computedStatistics.total_offline
							}}</span>
							<span class="text-sm text-gray-500"
								>({{ computedStatistics.dist.offline_dist }}%)</span
							>
						</h2>
					</div>
					<div class="h-2.5 w-full rounded-full bg-gray-200">
						<div
							class="h-2.5 rounded-full bg-red-500"
							v-bind:style="{
								width: `${computedStatistics.dist.offline_dist}%`,
							}"></div>
					</div>
				</div>
			</div>
			<div
				class="flex h-full flex-col items-center justify-center space-y-5 rounded-lg border bg-white p-5 shadow-sm outline-none">
				<img
					src="/images/app-logo.png"
					class="tablet:h-16 h-14"
					alt="Flowbite Logo" />
				<h1 class="font-bold text-gray-700">
					Powered by
					<a
						href="https://regenttrack.co.ke/"
						target="_blank"
						rel="noopener noreferrer"
						class="text-blue-700 underline"
						>Regent Tracking</a
					>
				</h1>
			</div>
		</div>

		<!-- modal to add comment for first table -->
		<ParentModal
			v-for="(_a, idx) in 10"
			:key="idx"
			modal-title="Add Your Comment "
			:modal-id="`add-comment-tbl-${idx}`"
			modal-size="large"
			modal-subtitle="Vehicle KCA 123A -  Justus Kamau Kamau">
			<AddTraceabilityReportComment />
		</ParentModal>

		<!-- modal for exporting to pdf -->
		<ParentModal
			modal-title="Report Preview"
			modal-id="export-report-pdf-modal"
			modal-size="full-screen">
			<h1>Hello world</h1>
			<p>
				<span
					>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum quasi consectetur
					eius omnis eos vel, esse, et illo nihil eligendi quaerat quam temporibus totam.
					Adipisci consequuntur eum aut itaque qui.</span
				><span
					>Similique, maxime illum sint accusamus itaque repellendus debitis nihil dolorem
					vel error id, voluptatum laudantium, quisquam explicabo totam dolor nostrum
					repudiandae facilis esse vitae hic necessitatibus quidem tempore. Culpa,
					cumque.</span
				><span
					>Eius, officiis sequi, quod ea natus quae earum, delectus voluptatum tempora
					minus temporibus. Explicabo ullam esse, illum ipsum sit quis ut dolore odit
					doloremque, sapiente quia quod. Aliquam, magnam a.</span
				><span
					>Tempore maiores enim error molestiae adipisci? Ratione enim ducimus maiores
					ipsum iure explicabo expedita labore modi iusto velit, aut numquam? Omnis
					sapiente expedita molestiae fuga magnam ad illo fugit excepturi.</span
				><span
					>Quasi nihil sunt repellendus, architecto incidunt quas commodi aliquam maiores
					delectus reprehenderit! Necessitatibus neque officia dignissimos sapiente totam
					natus maiores recusandae esse, reprehenderit aut doloremque ea magni quas qui
					error!</span
				><span
					>Officiis, eum. Nostrum aspernatur iste porro sequi nisi temporibus
					reprehenderit, consequuntur quidem, ipsum assumenda ipsam debitis quo omnis
					accusantium! Quasi omnis soluta excepturi dolore aperiam sequi facilis id.
					Magni, itaque.</span
				><span
					>Animi natus autem et dolor necessitatibus, doloremque unde, dolorum, odio
					officiis sint magni corporis voluptatem cumque. Eligendi neque officia qui dolor
					explicabo placeat sit? Ipsum odio nemo ipsam? Minima, nulla.</span
				><span
					>Veniam illum aut, eveniet dolore tempora molestiae sapiente mollitia esse.
					Libero enim nemo eaque consectetur modi, nam saepe ipsum quo dolor harum. Ex
					alias nam quos maiores. Accusamus, reiciendis eius!</span
				><span
					>Officia nam porro eveniet, reprehenderit quisquam rerum deleniti ipsam incidunt
					magnam velit labore accusantium ullam eum dolore quia atque esse! Rerum,
					asperiores esse assumenda nisi delectus est ipsum iusto eius!</span
				><span
					>Quibusdam hic nemo accusantium facere necessitatibus modi tempora rem maxime
					voluptatibus voluptas recusandae blanditiis quasi est nihil quidem libero
					quisquam quod officia deserunt, illum ad! Commodi molestiae rem animi
					dolorem.</span
				><span
					>Eligendi libero laboriosam omnis repellendus accusantium sunt veniam
					asperiores. Fugiat dolores eaque quidem neque dolorem eveniet, repellendus et
					animi accusantium, nihil quibusdam nulla exercitationem nisi! Voluptatem,
					pariatur voluptate. Laboriosam, a!</span
				><span
					>Repellendus esse in recusandae similique magnam dignissimos quos libero
					voluptatum sunt aliquam rerum distinctio debitis ex eveniet deleniti deserunt
					iure, voluptates sint reprehenderit officia! Accusamus magni doloribus earum
					tenetur laudantium!</span
				><span
					>Maiores voluptas enim aliquid laborum quisquam velit ipsa quaerat, odio rerum,
					eum quod quidem. Eos, qui hic? Obcaecati libero consectetur, architecto sit
					minus labore vitae in, ab dolores ipsam ipsum.</span
				><span
					>Pariatur rerum natus quos totam possimus quo aperiam iusto, id minima. Ullam
					modi nesciunt cumque repellat quisquam quas id sit cum! Sint, repellat dolore
					repellendus adipisci quod dolorum incidunt aperiam.</span
				><span
					>Corrupti in ducimus voluptatibus ut maiores alias, cumque velit, tempore, hic
					amet nemo? Obcaecati nisi expedita explicabo, magnam illo quis eligendi nostrum
					consequuntur aperiam ea aut? Possimus perferendis dolore inventore.</span
				><span
					>Cum rerum aliquid ipsum reprehenderit. Aliquam labore cupiditate, omnis ipsum
					molestiae aliquid harum obcaecati animi quasi delectus inventore hic expedita,
					beatae enim quas. Saepe iste velit commodi a impedit maxime!</span
				><span
					>Reprehenderit, quis hic molestiae earum sint cumque molestias eligendi
					aspernatur at, praesentium similique autem! Incidunt reprehenderit, quisquam in
					possimus dolorem ea non aperiam labore, eum, optio nulla placeat perspiciatis
					harum.</span
				><span
					>Enim amet excepturi quisquam provident, qui saepe repudiandae nam similique,
					veniam velit consequatur vitae. Perspiciatis quisquam quos eveniet pariatur,
					possimus alias saepe, nihil eius labore laudantium numquam explicabo magnam
					tempore.</span
				><span
					>Voluptatem voluptatibus ratione aliquam, delectus assumenda quidem aliquid
					repudiandae veritatis obcaecati blanditiis quia alias beatae excepturi, atque
					praesentium recusandae perspiciatis pariatur fuga sequi. Earum aspernatur
					debitis tempore deserunt, itaque odio.</span
				><span
					>Atque optio a soluta dolores. Possimus explicabo minus, fugiat natus animi
					quaerat aliquam cum, ullam at minima nesciunt maiores deserunt quasi ipsam fuga
					cumque, reiciendis pariatur numquam officia ex vel?</span
				><span
					>Perferendis vitae rerum dolores tempora fugit ipsam quibusdam repellat
					laudantium! Aspernatur provident atque quibusdam vero nostrum? Alias nulla
					tempora impedit neque sequi non totam ducimus voluptas exercitationem hic. At,
					dolorum?</span
				><span
					>Officia qui molestiae magni quos illo sapiente deleniti fugit itaque impedit
					corporis numquam, consequatur recusandae inventore iusto sed alias deserunt
					placeat at. Quod ut provident libero ea ducimus ipsa sequi.</span
				><span
					>Dicta, neque atque aliquid veritatis quisquam hic temporibus assumenda
					consectetur suscipit deleniti distinctio, obcaecati, quo rerum non quam cum
					provident repellat inventore labore beatae sapiente adipisci quae ex. Est,
					sunt?</span
				><span
					>Labore exercitationem cum accusamus eligendi at iure nostrum, in quaerat rerum
					pariatur dicta minima alias quod aut est quibusdam non excepturi, fuga rem
					asperiores placeat veritatis modi velit? Minus, odit?</span
				><span
					>Atque voluptatem est accusamus voluptatibus dolor inventore, nobis quas
					recusandae assumenda soluta consequatur porro magni? Consectetur placeat,
					eveniet commodi incidunt harum neque doloremque ea officia est odit cum
					nesciunt. Eveniet.</span
				><span
					>Quos reprehenderit saepe praesentium, sint soluta asperiores aut totam
					recusandae ullam dolorem nam commodi porro laudantium aspernatur, aliquid
					repellat nostrum? Hic perspiciatis culpa minus omnis distinctio dicta fugit
					voluptatibus. Maxime?</span
				><span
					>Enim unde voluptatibus quia accusamus, nemo exercitationem esse tempora sequi
					explicabo labore quo voluptas dicta sed, inventore laborum assumenda impedit
					ipsam distinctio, neque maiores optio. Odit adipisci ipsa eaque. A.</span
				><span
					>Reprehenderit tempore impedit reiciendis unde deserunt magnam neque repellat
					aliquid, quo quidem nesciunt, voluptatem suscipit eaque iure doloremque deleniti
					officia. Quos aliquam magnam corporis itaque eum molestiae labore aliquid
					adipisci!</span
				><span
					>Minima ipsam repellendus, odit temporibus dolores nostrum. A quisquam magni ex
					ea repellat qui nisi, quas repudiandae maiores suscipit neque, quod error magnam
					laudantium dolores ullam. Fugiat nihil quaerat ab!</span
				><span
					>Provident voluptate saepe architecto, suscipit iure sed, repudiandae aliquid
					numquam doloribus consequuntur dolor rerum rem voluptas explicabo fugiat!
					Laboriosam iste ratione quasi corrupti harum perspiciatis eius quo magni quia
					ipsa.</span
				><span
					>Repudiandae quas aut libero quam, in necessitatibus sequi consectetur
					distinctio iure, at numquam quidem accusantium. Quasi aperiam recusandae minima
					magnam laudantium iste necessitatibus dolorum excepturi sapiente. Iusto earum
					dolores quae.</span
				><span
					>Aspernatur veniam ad libero placeat unde incidunt nam odio? Rem id doloremque
					perspiciatis quidem ipsum consectetur nemo quam esse, a molestias optio, atque
					mollitia ut, quos quae? Repudiandae, magnam autem!</span
				><span
					>Voluptatem ab odio, repellendus laboriosam repellat maiores saepe recusandae,
					dolore distinctio consectetur eos. Atque impedit laudantium labore eaque
					voluptas, cupiditate, dolores maiores praesentium eum expedita blanditiis
					temporibus exercitationem similique iure?</span
				><span
					>Quos eveniet placeat doloribus fugiat reprehenderit necessitatibus alias
					mollitia asperiores. Praesentium, accusantium est! Dolor molestiae iusto nihil
					cumque asperiores. Repudiandae, saepe laborum ipsum quae quibusdam
					exercitationem minima eaque dicta nam.</span
				><span
					>Eveniet maxime iure officia quae. A id impedit consectetur nihil? Omnis sit
					nihil neque saepe molestias accusamus odit, quae ex voluptate nemo quibusdam ad
					mollitia, tenetur quos voluptatibus dolor veritatis?</span
				><span
					>Dolores beatae dignissimos expedita a! Facere officia nihil aspernatur deleniti
					illo soluta corporis doloribus, maiores totam explicabo est excepturi enim
					fugiat laborum deserunt natus. Officiis error nulla autem distinctio
					eaque!</span
				><span
					>Incidunt ullam excepturi dolores cum odio hic vitae dolorem eos vel iste eum,
					assumenda et consequuntur quidem ab, quod tempore sint laborum. Libero beatae
					consequuntur nesciunt cumque dolorum! Sapiente, voluptatibus.</span
				><span
					>Provident eaque atque maiores ipsa ullam? Adipisci, temporibus voluptatum,
					iusto distinctio mollitia sed porro perferendis aliquam blanditiis suscipit
					ipsum non quae consectetur quia ipsa nemo odit veritatis earum labore
					velit.</span
				><span
					>Pariatur quae ratione in. At temporibus voluptatibus quasi pariatur. Sunt
					doloremque numquam at fugiat provident dicta vero minima non, eveniet amet
					cumque similique hic quia quod modi repellat consequatur ad!</span
				><span
					>Sit nostrum, similique atque magnam voluptatibus non soluta, nemo eaque
					asperiores saepe tenetur minus aliquid tempora commodi facere itaque quibusdam,
					facilis culpa. Optio beatae maxime totam quos culpa impedit reprehenderit.</span
				><span
					>Voluptate ea consequuntur nihil minus dolorem? Quia atque iusto, unde
					doloremque magnam provident reprehenderit molestiae eligendi modi excepturi
					consequuntur beatae voluptatem doloribus dolor eius architecto placeat iure
					sapiente nam odio.</span
				><span
					>Quisquam, porro reiciendis! Sed veniam dicta cumque dolor, ducimus magnam
					aperiam accusantium necessitatibus numquam amet praesentium distinctio
					consequatur minus dignissimos dolorem ullam magni minima. Eos corporis aliquam
					deserunt inventore labore!</span
				><span
					>Temporibus quisquam ipsam eius ab impedit. Labore mollitia, ut sapiente
					necessitatibus eaque quas eligendi asperiores fuga magnam iusto architecto
					repellat voluptates beatae, expedita consectetur assumenda? Ducimus libero
					inventore adipisci unde.</span
				><span
					>Ipsa ipsam, adipisci expedita qui quia magnam dolores ratione molestiae!
					Tempora quo incidunt iusto ducimus, aliquam voluptates earum, repellendus illum,
					rerum quas sequi fuga veritatis consectetur iure quod cumque blanditiis?</span
				><span
					>Exercitationem facere numquam at recusandae inventore temporibus incidunt atque
					suscipit nihil sed, consequatur aliquam ut aliquid laudantium beatae veniam
					provident error ipsam, sint, officiis quisquam ipsa sapiente mollitia.
					Provident, temporibus.</span
				><span
					>Aliquam, rerum aspernatur! Dolor, rem temporibus nobis voluptatem officiis
					asperiores incidunt ea eos, aperiam provident corporis tempora sunt ipsam,
					architecto molestiae cupiditate illo officia adipisci. Temporibus neque aliquam
					tempore dolore?</span
				><span
					>Ipsum velit alias pariatur accusamus, error tenetur eveniet, voluptas quis
					consequuntur saepe ab distinctio expedita corrupti quae aliquam minima sunt
					cupiditate iste odio consectetur. Repudiandae, recusandae ratione! Ab,
					reiciendis sequi.</span
				><span
					>Dignissimos maxime doloremque architecto suscipit totam velit, voluptatibus
					ducimus nisi qui ad, accusantium nesciunt ratione deleniti facilis beatae,
					officiis assumenda deserunt at nihil cum blanditiis quia ipsa? Ipsam, quod
					voluptatem.</span
				><span
					>Ab facere ullam sed in sequi suscipit autem molestiae, reiciendis magni.
					Aliquam debitis nisi ducimus animi accusantium optio voluptatum amet ab ex velit
					facilis, itaque praesentium quasi natus eos recusandae.</span
				><span
					>Totam incidunt tempore iure at inventore. Odit autem dolorum explicabo rerum,
					quis corporis facere corrupti aspernatur doloremque necessitatibus eaque dolores
					laboriosam iusto voluptate. Nostrum mollitia velit autem esse blanditiis
					harum.</span
				><span
					>Praesentium, voluptatibus commodi rerum facilis aspernatur quia consequuntur
					labore unde, nihil, qui laborum vitae nostrum aliquam odit adipisci
					exercitationem. Ad quas, quis tenetur eos illo quam ullam! Delectus, quod
					pariatur.</span
				><span
					>Vitae quasi veritatis eius accusamus odit quisquam sapiente, eveniet cupiditate
					qui voluptas nobis quo corrupti dicta id velit, tempore et magni tempora
					perferendis! Esse sit quas eligendi sapiente fugit libero.</span
				><span
					>Quisquam nihil deserunt doloremque incidunt officia nam esse, doloribus
					voluptas voluptatibus? Expedita voluptas ex voluptatibus eius fugit consequuntur
					perspiciatis rerum! Eius voluptate exercitationem sed quis at unde et blanditiis
					temporibus!</span
				><span
					>Odio a cumque, molestiae in, quasi voluptate et exercitationem itaque optio
					maiores sint esse dolores quae libero? Adipisci aliquid tenetur vero quam, eum
					animi doloremque quo. Nesciunt nostrum odit commodi.</span
				><span
					>Corrupti sapiente iusto quis. Excepturi deserunt impedit beatae, a nihil
					voluptates illo molestias alias, porro quisquam modi laudantium ducimus sequi
					recusandae aliquid omnis consectetur? Deleniti itaque cumque consequatur omnis
					voluptate?</span
				><span
					>Quod nesciunt error unde voluptate nostrum. Dolorem ad vel alias repellendus
					eveniet voluptas esse tenetur fuga fugit eligendi sed maxime officia et facere
					nihil, temporibus, iure, hic cum illo? Deleniti.</span
				><span
					>Maiores officia distinctio maxime quisquam? Quos omnis minima maxime autem
					beatae ex, dolorum esse repellendus, excepturi accusamus unde possimus tempore
					nam quaerat reiciendis non a corporis aliquid sunt facilis quia.</span
				><span
					>Iure rerum consequatur eaque quae laborum est quidem debitis reiciendis,
					excepturi ipsam quod ipsa maxime deleniti officia modi voluptate atque velit
					consequuntur rem. Fuga quisquam nulla commodi delectus asperiores eaque?</span
				><span
					>Iure accusamus a expedita officiis error tempore ut eveniet nobis aspernatur
					eum, eius minima fugit facilis tempora adipisci consequatur ipsa eligendi? Sequi
					sint incidunt animi cum officiis, unde velit exercitationem.</span
				><span
					>Earum et voluptatum consectetur incidunt aliquam facere nulla, doloremque odit,
					aliquid inventore recusandae facilis. Blanditiis labore alias pariatur fuga
					tempora officia odit qui commodi molestiae quibusdam sunt vitae, dolores
					a.</span
				><span
					>Earum possimus ex, saepe beatae accusamus, tempora eveniet recusandae alias,
					culpa consequatur nihil temporibus incidunt dolor delectus consectetur fugit
					totam id. Quo beatae explicabo sit itaque, atque adipisci impedit
					repellat?</span
				><span
					>Vel temporibus veritatis vitae incidunt nostrum aliquid dolorum suscipit magnam
					aperiam error iure in ratione culpa, itaque placeat magni doloribus, ipsam
					eveniet eligendi possimus. Ex dicta at error vel voluptates.</span
				><span
					>Numquam, iure dicta. Nam maiores ab possimus dolorem atque nobis reiciendis aut
					quas, fugit, nihil obcaecati. Ratione, repellendus nisi numquam consequatur
					minima totam magni aspernatur praesentium cumque, commodi veniam sequi.</span
				><span
					>Facilis odio perspiciatis et hic provident ea magni dolorum sint officiis nisi
					eum inventore minus quis similique id ipsam architecto non, nobis dolor quae
					neque recusandae accusantium deleniti ad! Praesentium!</span
				><span
					>Iure suscipit est voluptate iusto aspernatur sunt voluptatem cupiditate
					assumenda quisquam cumque libero accusamus quibusdam corporis, ab temporibus
					illo iste. Est, nulla. Mollitia, neque! Iste blanditiis dolores harum. Minus,
					distinctio.</span
				><span
					>Exercitationem, esse! Quia cum nesciunt voluptates consectetur magnam porro
					necessitatibus, voluptatum placeat animi unde nam asperiores libero delectus in,
					hic minus tenetur ratione commodi. Tempore minima ipsa voluptates laudantium
					magni.</span
				><span
					>Architecto sapiente obcaecati soluta magnam libero ullam odio, nesciunt
					mollitia omnis dolorem officia, placeat, modi corporis voluptates ex quisquam
					rem facere magni possimus eos! Amet ratione quibusdam pariatur aspernatur
					fuga.</span
				><span
					>Magnam quia, deserunt perferendis praesentium velit ducimus nulla numquam at
					sapiente cumque ipsa blanditiis debitis modi! Illum ut vitae ipsa iste repellat
					eos vero exercitationem pariatur. Doloribus ipsam perspiciatis quae?</span
				><span
					>Magnam, saepe. Voluptatem nulla sapiente quam amet cum atque sequi maiores
					blanditiis ullam illo alias odio pariatur quos id aperiam, similique tenetur,
					error rem fugit saepe quis totam nesciunt consequatur?</span
				><span
					>Vitae temporibus minus quos voluptatum officiis unde, sapiente harum facere
					odit optio aut explicabo facilis. Ex debitis fugit eos, animi eligendi dolorum
					corrupti error eius totam impedit quis officia velit.</span
				><span
					>Laborum adipisci natus quasi deleniti, iure in illum expedita consectetur dolor
					repellat nihil possimus deserunt temporibus repellendus, libero pariatur,
					accusantium tenetur dolorum odit laudantium molestiae omnis ullam quas! At,
					ratione.</span
				><span
					>Recusandae, eaque necessitatibus excepturi optio pariatur veritatis tempora
					earum aut! Amet, a placeat iste sapiente in fugit. Sapiente officia, in quo
					ducimus deleniti mollitia blanditiis numquam, nemo natus, distinctio
					nihil.</span
				><span
					>Laborum, reprehenderit iste tempore consequuntur quo consectetur. Labore unde
					eius velit beatae facere, magni, quam consectetur eum voluptatum dolorem
					recusandae vero vel ipsam! Numquam at nam fugiat cupiditate laborum dicta.</span
				><span
					>Consequuntur laborum iste sunt, quaerat modi id nihil ex veniam excepturi minus
					maxime? Accusamus voluptatem pariatur, facilis inventore distinctio nostrum
					fugiat dolores consequatur recusandae id facere maiores, dignissimos optio
					maxime?</span
				><span
					>Placeat dicta soluta doloribus corporis reprehenderit. Velit quos quo pariatur
					impedit doloremque quam id eveniet? Dolore dolorem quas veritatis voluptatem.
					Ullam repudiandae aut quidem, quis nisi voluptates sit perspiciatis
					dolores!</span
				><span
					>Commodi, voluptates blanditiis, eveniet aliquid beatae reprehenderit unde
					laborum architecto eum qui, sit libero molestiae consequatur maiores officiis
					sunt in voluptatibus. Necessitatibus autem earum non sunt aperiam labore
					molestias accusamus!</span
				><span
					>Cupiditate vero consequuntur nemo iste, tempora eos minima velit numquam sit
					similique dolorem, aut consequatur neque unde asperiores porro amet quod cum
					accusantium tempore distinctio pariatur recusandae. Eos, quis quos.</span
				><span
					>Non itaque facere, repudiandae necessitatibus beatae corrupti earum magni
					laborum ipsum aperiam et fuga eveniet quos! Reprehenderit illum laboriosam
					quibusdam iste maxime consectetur ipsa aspernatur blanditiis. Necessitatibus
					veniam ab eum!</span
				><span
					>Soluta esse harum, sunt veniam, quasi iste ullam praesentium modi voluptatem
					illum, incidunt explicabo culpa molestias. Doloribus ab optio dolor deserunt,
					voluptates debitis? Incidunt aliquid ipsa nesciunt fugit provident
					adipisci.</span
				><span
					>Tenetur beatae placeat ea aut iusto perspiciatis vitae voluptate, aliquid qui
					quasi error harum? Sint eum provident fugiat! Porro impedit maiores alias harum.
					Odit iusto aspernatur nostrum rerum assumenda dolores?</span
				><span
					>Nesciunt eveniet esse optio deleniti porro distinctio ipsum nisi omnis iusto
					ducimus corrupti cupiditate a fuga suscipit harum, est commodi. Eos laboriosam
					quibusdam earum animi ipsum quos mollitia cumque nobis.</span
				><span
					>Nesciunt impedit repudiandae tenetur itaque id! Fugit dicta repellendus
					excepturi harum? Esse provident dolorem asperiores, a maiores velit totam
					laudantium animi facere vero iste. Temporibus quasi a asperiores placeat
					officia.</span
				><span
					>Eos deserunt ratione magnam explicabo maiores vero unde cumque ipsa blanditiis
					officia fugiat deleniti, placeat ipsum repudiandae ea libero temporibus
					voluptatum sunt dolor beatae soluta eveniet. Nulla nostrum totam repellat.</span
				><span
					>Neque maxime nobis corporis accusamus reiciendis nesciunt modi labore totam!
					Minus sed, libero, ipsum atque reprehenderit eligendi nobis rerum culpa quae
					quis, praesentium optio laudantium non veniam totam illum placeat.</span
				><span
					>Recusandae laudantium saepe quis minima optio itaque nisi officiis vero
					similique numquam eos incidunt perspiciatis ipsam sit nesciunt, sunt sed
					consequatur. Laudantium sit quod blanditiis pariatur quo sint ad quis.</span
				><span
					>Dolorem atque quia dolor, hic est nihil nulla quas, porro nemo ipsa
					necessitatibus voluptatibus explicabo alias consequatur delectus accusamus
					similique illum perspiciatis provident? Voluptatem, temporibus? Eos illo nemo
					sint ab.</span
				><span
					>Nobis ea optio eum dolorum quam! Optio, fugit! Sint, laborum, vitae sed
					doloremque aspernatur eaque amet ullam officia fugiat odio commodi autem
					repudiandae iusto ipsum. Quam laboriosam voluptate veritatis mollitia?</span
				><span
					>Dolore, tempore sint quisquam cum, sunt voluptate consequatur ducimus
					asperiores labore similique aspernatur. Illo, amet tempore! Reprehenderit totam
					quisquam inventore illo nemo repudiandae harum, consequatur exercitationem,
					alias recusandae facilis. Quae.</span
				><span
					>Fugit minima explicabo facilis sequi distinctio corrupti hic minus enim
					blanditiis maxime quasi rem, laudantium velit? A saepe quaerat quos quisquam
					qui, maxime sit fugiat aliquam odio rem aperiam molestias.</span
				><span
					>Labore unde sed illo optio quia. Voluptates iure assumenda similique
					consequuntur odit ullam voluptas blanditiis atque fugiat veniam. Explicabo, quis
					illum. Ratione repellat vero odio, odit maxime libero illum nihil!</span
				><span
					>Ipsum quas consequuntur veritatis libero ullam, corrupti magni! Aspernatur,
					blanditiis ullam incidunt distinctio id accusamus quibusdam repellendus
					perspiciatis molestiae porro laboriosam natus mollitia labore error quia
					voluptate. Asperiores, accusamus quae!</span
				><span
					>Quasi reiciendis eveniet fugiat vero accusantium soluta magni? Molestias nemo
					ducimus optio nisi nulla in placeat exercitationem error. Ut tempora possimus
					vitae dolores eum optio ullam eos at error quibusdam.</span
				><span
					>Ex, quae ut quibusdam natus repellendus repellat libero aut molestiae mollitia
					error impedit molestias corrupti rerum iure delectus vitae maiores sit deleniti
					non perferendis laboriosam adipisci tempora dolorum! Ipsam, fugit!</span
				><span
					>Amet, molestias quam. Libero quos, natus optio sunt totam ipsa repudiandae
					velit, adipisci, ipsum aut veritatis? Ex, pariatur minima? Expedita tempora
					sequi ut ex qui nobis nostrum architecto. Fugit, doloribus.</span
				><span
					>Dignissimos, laudantium quidem. Repellendus sint architecto quibusdam dolorum
					adipisci. Illo ab nesciunt molestiae magni ducimus, aspernatur eum harum, quod
					officia laborum quia reiciendis doloribus similique aperiam quae sapiente dolore
					porro?</span
				><span
					>Laudantium provident fugiat incidunt minima, eius amet esse natus sint nam
					porro illum iure accusantium reprehenderit in? At illo, eius unde, dolor,
					aperiam natus eveniet aspernatur rerum laudantium iste incidunt.</span
				><span
					>Cumque provident asperiores laborum voluptates quae molestiae eos earum ratione
					possimus consectetur pariatur dicta necessitatibus non, aut beatae recusandae
					sapiente omnis veniam, corrupti quibusdam illum expedita dignissimos adipisci!
					Voluptatem, architecto.</span
				><span
					>Sapiente recusandae earum accusantium, omnis corrupti eligendi soluta ipsum qui
					iste magnam, veniam aperiam sit neque reprehenderit tempore ducimus! Ipsum odit
					illo cum. Ullam, esse blanditiis autem quo reiciendis iusto!</span
				><span
					>Impedit perferendis molestias omnis adipisci, eligendi dolorem non eaque
					quaerat veniam repellat labore saepe enim aspernatur doloribus nesciunt, rerum,
					tempore voluptatibus amet ut quis cumque hic beatae. Dignissimos, omnis
					magni.</span
				><span
					>Eum unde voluptas in quisquam ea fuga, corporis natus mollitia eligendi
					incidunt molestiae eius iusto maiores perspiciatis. Ratione tempora enim, iste a
					omnis, veniam alias fugiat, expedita consectetur obcaecati dolore.</span
				>
			</p>
		</ParentModal>
	</div>
</template>

<script setup lang="ts">
	// import html2pdf from 'html2pdf.js';

	definePageMeta({
		name: 'regent-tracking-traceability-report',
		layout: 'console-layout',
	});

	const {
		page,
		size,
		searchString,
		computedVehicles,
		fetchingClientVehicles,
		errorFetchingClientVehicles,
		totalPages,
		computedStatistics,
	} = useDeviceTraceabilityReport();

	// onMounted(() => {
	// 	import('html2pdf.js').then((html2pdf) => {
	// 		const el = document.getElementById('your-div-id');
	// 		html2pdf
	// 			.default()
	// 			.from(el as HTMLElement)
	// 			.save();
	// 	});
	// });
</script>
