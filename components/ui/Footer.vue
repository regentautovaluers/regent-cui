<template>
	<footer class="text-slate-100">
		<div class="relative grid min-h-96 grid-cols-4 gap-x-16 bg-black px-14 pt-20">
			<div
				class="absolute -top-20 left-20 min-h-32 w-[75%] translate-x-24 rounded-lg bg-blue-600 py-2 text-center">
				<h1 class="text-3xl font-semibold">Our Partners</h1>
			</div>
			<div>
				<h1 class="text-2xl font-bold">About Us.</h1>
				<p class="mt-5 font-light">
					Regent Auto Valuers is a trusted <br />
					provider of innovative automotive solutions <br />
					across Kenya and Rwanda.
				</p>
				<div class="mt-8 flex items-center space-x-6">
					<!-- facebook -->
					<button
						class="hover:text-slate-103 size-fit rounded-full bg-slate-100 p-3 text-gray-500 transition-all duration-100 ease-linear hover:bg-blue-600 hover:text-slate-100">
						<a
							href="#"
							target="_blank"
							rel="noopener noreferrer"
							class="size-full">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="27"
								height="27"
								viewBox="0 0 24 24"
								class="text-inherit">
								<path
									fill="currentColor"
									fill-rule="evenodd"
									d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6z"
									clip-rule="evenodd" />
							</svg>
						</a>
					</button>
					<!-- instagram -->
					<button
						class="hover:text-slate-103 size-fit rounded-full bg-slate-100 p-3 text-gray-500 transition-all duration-100 ease-linear hover:bg-blue-600 hover:text-slate-100">
						<a
							href="#"
							target="_blank"
							rel="noopener noreferrer"
							class="size-full">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="27"
								height="27"
								viewBox="0 0 24 24">
								<path
									fill="currentColor"
									fill-rule="evenodd"
									d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1M12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6m-5 3a5 5 0 1 1 10 0a5 5 0 0 1-10 0"
									clip-rule="evenodd" />
							</svg>
						</a>
					</button>

					<!-- twitter -->
					<button
						class="hover:text-slate-103 size-fit rounded-full bg-slate-100 p-3 text-gray-500 transition-all duration-100 ease-linear hover:bg-blue-600 hover:text-slate-100">
						<a
							href="#"
							target="_blank"
							rel="noopener noreferrer"
							class="size-full">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="27"
								height="27"
								viewBox="0 0 512 512">
								<path
									fill="currentColor"
									d="M389.2 48h70.6L305.6 224.2L487 464H345L233.7 318.6L106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9zm-24.8 373.8h39.1L151.1 88h-42z" />
							</svg>
						</a>
					</button>

					<!-- mail -->
					<button
						class="hover:text-slate-103 size-fit rounded-full bg-slate-100 p-3 text-gray-500 transition-all duration-100 ease-linear hover:bg-blue-600 hover:text-slate-100">
						<a
							href="#"
							target="_blank"
							rel="noopener noreferrer"
							class="size-full">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="27"
								height="27"
								viewBox="0 0 512 512">
								<path
									fill="currentColor"
									d="M356.3 234.667q48.224 0 79.707 25.985q15.665 12.993 24.419 31.92q8.907 19.568 8.907 43.148q0 37.373-20.732 59.669q-18.585 19.89-41.927 19.89q-24.88 0-27.337-22.617q-15.358 22.617-41.466 22.617q-21.04 0-33.326-12.19q-13.362-13.155-13.362-36.091q0-15.238 6.067-29.915t16.816-25.423q20.427-20.371 52.524-20.371q24.266 0 45.305 7.86l-10.29 66.726q-1.535 9.785-1.535 14.276q0 11.067 9.368 11.067q12.287 0 21.962-14.917q11.825-18.125 11.825-42.987q0-34.166-23.036-53.253q-25.494-21.013-63.274-21.013q-29.18 0-53.138 14.436q-22.575 13.635-33.94 36.892q-9.062 18.928-9.062 42.025q0 43.79 30.408 69.454q26.723 22.617 67.882 22.617q23.497 0 49.759-8.983l4.454 24.702q-27.798 9.143-56.67 9.143q-53.139 0-86.465-30.958q-35.476-32.721-35.476-86.616q0-50.847 33.633-83.57q34.71-33.523 88-33.523m10.75 78.917q-8.753 0-17.354 4.572q-8.6 4.571-14.743 12.591q-12.594 16.2-12.593 36.25q0 11.229 5.528 17.725q5.529 6.496 15.051 6.496q13.822 0 22.883-11.87q4.762-6.094 7.525-23.578l6.45-39.94q-7.831-2.246-12.746-2.246M64 92.153l189.002 162.75c-24.537 25.015-39.669 59.29-39.669 97.097q.001 5.386.405 10.668H64zm384-.001l.003 159.789c-24.915-23.912-58.743-38.607-96.003-38.607c-21.988 0-42.781 5.118-61.252 14.227zM415.306 64L256 201.174L96.693 64z" />
							</svg>
						</a>
					</button>
				</div>
			</div>
			<div>
				<h1 class="text-2xl font-bold">Quick Links.</h1>
				<div class="mt-5 flex flex-col space-y-2">
					<NuxtLink class="font-light">Request Valuation</NuxtLink>
					<NuxtLink class="font-light">Valuation Report</NuxtLink>
					<NuxtLink class="font-light">Roadside Assistance</NuxtLink>
					<NuxtLink class="font-light">Accident Management</NuxtLink>
					<NuxtLink class="font-light">Emergency Evacuation</NuxtLink>
					<NuxtLink class="font-light">AVA Memberships</NuxtLink>
					<NuxtLink class="font-light">Contact Us</NuxtLink>
				</div>
			</div>
			<div>
				<h1 class="text-2xl font-bold">Our Companies.</h1>
				<div class="mt-5 flex flex-col space-y-2">
					<NuxtLink class="font-light">Regent Auto Valuers</NuxtLink>
					<NuxtLink class="font-light">Regent Tracking</NuxtLink>
					<NuxtLink class="font-light">AVA</NuxtLink>
				</div>
			</div>
			<div></div>
		</div>
		<div class="flex items-center justify-between bg-gray-500 px-14 py-6">
			<p><span>&copy; 2025. Regent Auto Valuers. All rights reserved.</span></p>
			<p class="inline-flex space-x-2">
				<a href="#">Terms of Use</a><span>&VerticalBar;</span><a href="#">Privacy Policy</a>
			</p>
		</div>
	</footer>
</template>
