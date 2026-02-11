<template>
	<div
		class="laptop:p-4 laptop-lg:p-8 flex flex-1 flex-col rounded-lg border-2 bg-white p-2 outline-none">
		<div
			class="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800"
			role="alert">
			<div class="flex items-center">
				<svg
					class="me-2 h-4 w-4 shrink-0"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					viewBox="0 0 20 20">
					<path
						d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
				</svg>
				<span class="sr-only">Info</span>
				<h3 class="text-sm font-medium">Connecting With Us?</h3>
			</div>

			<p class="mt-2 mb-4 text-sm">
				Looking to connect your systems with us? Follow the guide provided here to get all
				the required information to call our JSON apis. It's your duty to protect your
				integration ID, API keys and refresh keys and Regent is not liable for any data
				leaked via unauthorized access to your keys.
				<NuxtLink
					:to="{ name: 'corp-branches' }"
					class="font-semibold underline underline-offset-2"
					>Add One</NuxtLink
				>
			</p>
		</div>

		<!-- step 1 -->
		<div
			class="mt-4 rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-800"
			role="alert">
			<h1 class="font-bold">1. Get Your Integration ID</h1>

			<p class="mt-2 mb-4 text-sm">
				The integration ID is a unique value that identifies your company to us. It is
				created once but can be re-used as many times as needed. You will need it each time
				you create an API key. It is a confidential key, which if acquired by a malicious
				actor, could allow them to provision API keys on your behalf.
				<span class="font-semibold underline underline-offset-2"
					>Keep your integration ID safe!</span
				>
			</p>
			<div class="flex">
				<button
					type="button"
					class="rounded-lg border border-gray-800 bg-transparent px-3 py-1.5 text-center text-sm font-medium text-gray-800 hover:bg-gray-900 hover:text-white focus:ring-4 focus:ring-gray-300 focus:outline-none"
					@click.prevent="">
					Request Integration ID
				</button>
			</div>
		</div>

		<!-- step 2 -->
		<div
			class="mt-4 rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-800"
			role="alert">
			<h1 class="font-bold">2. Select Permissions</h1>

			<p class="mt-2 mb-4 text-sm">
				With the integration id in hand, you should now proceed to limit what the API key
				can do. It is best advised to ensure that the key you generate can do as little as
				possible to ensure it's limited reach in the event of a breach. You could even
				decide to generate different keys for each action to further make it harder to
				access your data by master key.
			</p>
		</div>

		<!-- step 2 -->
		<div
			class="mt-4 rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-800"
			role="alert">
			<h1 class="font-bold">3. Get a Sample API Key</h1>

			<p class="mt-2 mb-4 text-sm">
				Finally! We can get an API key for ourselves. Kindly note that any API key you
				generate is not stored by Regent. It
				<span class="font-semibold underline underline-offset-2">expires after 7 days</span>
				and can be replaced by exchanging an accompanying refresh token. You can generate as
				many keys as possible but ensure you have a suitable way of refreshing them every 7
				days. The key you generate can only do what you allow it to do in step 2 above, so
				choose your permissions carefully.
			</p>
			<div class="flex">
				<button
					type="button"
					class="rounded-lg border border-gray-800 bg-transparent px-3 py-1.5 text-center text-sm font-medium text-gray-800 hover:bg-gray-900 hover:text-white focus:ring-4 focus:ring-gray-300 focus:outline-none"
					@click.prevent="">
					Get My API Key
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		name: '3rd-party-integrations',
	});
</script>
